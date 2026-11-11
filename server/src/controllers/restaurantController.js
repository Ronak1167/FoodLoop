import { Restaurants, MenuItems, Orders, Reviews } from '../db/storage.js';

export async function getAllRestaurants(req, res) {
  try {
    const { search, cuisine, rating, priceRange, hasSurplus } = req.query;
    let list = await Restaurants.find({ status: 'approved' });

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        (r.cuisines && r.cuisines.some(c => c.toLowerCase().includes(q)))
      );
    }

    if (cuisine && cuisine !== 'all') {
      const cLower = cuisine.toLowerCase();
      list = list.filter(r =>
        r.cuisines && r.cuisines.some(c => c.toLowerCase() === cLower)
      );
    }

    if (rating) {
      const minRating = Number(rating);
      list = list.filter(r => (r.rating || 0) >= minRating);
    }

    if (priceRange && priceRange !== 'all') {
      list = list.filter(r => r.priceRange === priceRange);
    }

    // Attach active surplus deals count to each restaurant
    const now = new Date();
    const allSurplusItems = await MenuItems.find({
      isSurplus: true,
      isAvailable: true,
      surplusQuantity: { $gt: 0 }
    });

    const enriched = list.map(rest => {
      const activeDeals = allSurplusItems.filter(item => {
        const matchesRest = String(item.restaurantId) === String(rest._id);
        const deadline = item.surplusDeadline ? new Date(item.surplusDeadline) : null;
        return matchesRest && (!deadline || deadline > now);
      });
      return {
        ...rest,
        activeSurplusDealsCount: activeDeals.length
      };
    });

    if (hasSurplus === 'true') {
      return res.json({ restaurants: enriched.filter(r => r.activeSurplusDealsCount > 0) });
    }

    return res.json({ restaurants: enriched });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch restaurants', error: err.message });
  }
}

export async function getRestaurantById(req, res) {
  try {
    const { id } = req.params;
    const restaurant = await Restaurants.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const items = await MenuItems.find({ restaurantId: restaurant._id, isAvailable: true });
    const reviews = await Reviews.find({ restaurantId: restaurant._id }, { sort: { createdAt: -1 } });

    // Separate regular items and surplus rescue items
    const now = new Date();
    const surplusDeals = [];
    const regularMenu = [];

    for (const item of items) {
      if (item.isSurplus) {
        const deadline = item.surplusDeadline ? new Date(item.surplusDeadline) : null;
        const isNotExpired = !deadline || deadline > now;
        const hasStock = Number(item.surplusQuantity) > 0;

        if (isNotExpired && hasStock) {
          const hoursLeft = deadline ? Math.max(0, ((deadline - now) / (1000 * 60 * 60))).toFixed(1) : 4;
          surplusDeals.push({
            ...item,
            hoursRemaining: Number(hoursLeft)
          });
        }
      } else {
        regularMenu.push(item);
      }
    }

    return res.json({
      restaurant,
      regularMenu,
      surplusDeals,
      reviews
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch restaurant details', error: err.message });
  }
}

export async function getMyRestaurant(req, res) {
  try {
    let restaurant = await Restaurants.findOne({ ownerId: req.user._id });
    if (!restaurant) {
      // Auto-create a starter restaurant profile for this owner if not yet registered
      restaurant = await Restaurants.create({
        name: `${req.user.name}'s Kitchen`,
        ownerId: req.user._id,
        description: 'Sustainable culinary delicacies prepared with fresh local ingredients.',
        address: req.user.address || { street: 'Main Commercial Street', city: 'Gurugram', state: 'Haryana', zipCode: '122001' },
        cuisines: ['Healthy Bowls', 'Eco-Certified'],
        rating: 5.0,
        totalRatings: 1,
        priceRange: '$$',
        bannerImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
        logoImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=200&q=80',
        status: 'approved',
        ecoPackagingAvailable: true,
        ecoPackagingFee: 15,
        mealsRescuedCount: 0,
        wastePreventedKg: 0,
        deliveryTime: '25-35 mins',
        deliveryFee: 30,
        minOrder: 150
      });
    }

    const items = await MenuItems.find({ restaurantId: restaurant._id });
    const orders = await Orders.find({ restaurantId: restaurant._id }, { sort: { createdAt: -1 } });

    return res.json({
      restaurant,
      items,
      recentOrders: orders.slice(0, 10)
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch restaurant management profile', error: err.message });
  }
}

export async function updateRestaurant(req, res) {
  try {
    const restaurant = await Restaurants.findOne({ ownerId: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: 'No restaurant associated with this owner account' });
    }

    const updated = await Restaurants.findByIdAndUpdate(restaurant._id, req.body, { new: true });
    return res.json({ message: 'Restaurant updated successfully', restaurant: updated });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update restaurant', error: err.message });
  }
}

export async function createMenuItem(req, res) {
  try {
    const restaurant = await Restaurants.findOne({ ownerId: req.user._id });
    if (!restaurant) {
      return res.status(403).json({ message: 'Only registered restaurant owners can create menu items' });
    }

    const {
      name,
      description,
      price,
      category,
      image,
      isVeg = true,
      isSurplus = false,
      originalPrice,
      discountPercentage,
      surplusQuantity,
      surplusDeadline,
      preparationInfo,
      safetyGuarantee,
      calories,
      estimatedWasteKg
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    const newItem = await MenuItems.create({
      restaurantId: restaurant._id,
      name: name.trim(),
      description: description || '',
      price: Number(price),
      category: category || (isSurplus ? 'Surplus Deals' : 'Main Course'),
      image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      isVeg: Boolean(isVeg),
      isSurplus: Boolean(isSurplus),
      originalPrice: originalPrice ? Number(originalPrice) : (isSurplus ? Number(price) * 2 : Number(price)),
      discountPercentage: discountPercentage ? Number(discountPercentage) : (isSurplus ? 50 : 0),
      surplusQuantity: isSurplus ? Number(surplusQuantity || 5) : 0,
      surplusDeadline: surplusDeadline || (isSurplus ? new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() : null),
      preparationInfo: preparationInfo || (isSurplus ? 'Prepared fresh in the current service shift and stored in temperature-controlled eco-packaging.' : ''),
      safetyGuarantee: safetyGuarantee || (isSurplus ? 'Verified Safe Surplus certified under SDG 12 standards.' : ''),
      calories: Number(calories || 400),
      estimatedWasteKg: Number(estimatedWasteKg || (isSurplus ? 0.45 : 0)),
      isAvailable: true
    });

    return res.status(201).json({ message: 'Menu item created successfully', item: newItem });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create menu item', error: err.message });
  }
}

export async function updateMenuItem(req, res) {
  try {
    const { itemId } = req.params;
    const item = await MenuItems.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Verify restaurant ownership
    const restaurant = await Restaurants.findById(item.restaurantId);
    if (!restaurant || String(restaurant.ownerId) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to modify this menu item' });
    }

    const updated = await MenuItems.findByIdAndUpdate(itemId, req.body, { new: true });
    return res.json({ message: 'Item updated successfully', item: updated });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update menu item', error: err.message });
  }
}

export async function deleteMenuItem(req, res) {
  try {
    const { itemId } = req.params;
    const item = await MenuItems.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const restaurant = await Restaurants.findById(item.restaurantId);
    if (!restaurant || String(restaurant.ownerId) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to delete this menu item' });
    }

    await MenuItems.findByIdAndDelete(itemId);
    return res.json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete menu item', error: err.message });
  }
}

export async function getRestaurantAnalytics(req, res) {
  try {
    const restaurant = await Restaurants.findOne({ ownerId: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const orders = await Orders.find({ restaurantId: restaurant._id });
    const completedOrders = orders.filter(o => o.status === 'Delivered');

    let totalRevenue = 0;
    let surplusSalesRevenue = 0;
    let surplusMealsSold = 0;
    let totalWastePreventedKg = 0;

    for (const o of completedOrders) {
      totalRevenue += Number(o.totalAmount || 0);
      for (const item of o.items || []) {
        if (item.isSurplus) {
          surplusSalesRevenue += (Number(item.price) * Number(item.quantity));
          surplusMealsSold += Number(item.quantity);
          totalWastePreventedKg += (Number(item.quantity) * 0.45);
        }
      }
    }

    // Include platform baseline counter for this restaurant
    const finalMealsRescued = (restaurant.mealsRescuedCount || 0) + surplusMealsSold;
    const finalWasteSavedKg = ((restaurant.wastePreventedKg || 0) + totalWastePreventedKg).toFixed(1);
    const co2SavedKg = (finalWasteSavedKg * 2.5).toFixed(1);

    return res.json({
      analytics: {
        totalOrders: orders.length,
        completedOrders: completedOrders.length,
        totalRevenue: Math.round(totalRevenue),
        surplusSalesRevenue: Math.round(surplusSalesRevenue),
        mealsRescued: finalMealsRescued,
        wastePreventedKg: Number(finalWasteSavedKg),
        co2PreventedKg: Number(co2SavedKg),
        rating: restaurant.rating,
        totalRatings: restaurant.totalRatings
      }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to get analytics', error: err.message });
  }
}
