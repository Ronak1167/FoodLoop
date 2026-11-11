import crypto from 'crypto';
import { Orders, MenuItems, Restaurants, Users, Reviews } from '../db/storage.js';

export async function createOrder(req, res) {
  try {
    const {
      restaurantId,
      items,
      deliveryAddress,
      paymentMethod = 'UPI',
      noCutlery = true,
      ecoPackagingSelected = true,
      tip = 0,
      ecoPointsToRedeem = 0
    } = req.body;

    if (!restaurantId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Restaurant ID and non-empty items array are required' });
    }

    const restaurant = await Restaurants.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    let subtotal = 0;
    let rescuedMealsCount = 0;
    let totalWasteKg = 0;
    const validatedItems = [];

    // Verify and reserve items
    for (const item of items) {
      const dbItem = await MenuItems.findById(item.menuItemId || item._id);
      if (!dbItem) {
        return res.status(400).json({ message: `Item ${item.name || 'unknown'} is not available.` });
      }

      const qty = Math.max(1, Number(item.quantity) || 1);

      if (dbItem.isSurplus) {
        if (!dbItem.isAvailable || Number(dbItem.surplusQuantity) < qty) {
          return res.status(400).json({
            message: `Surplus deal "${dbItem.name}" has only ${dbItem.surplusQuantity || 0} left in stock.`
          });
        }

        // Decrement surplus inventory
        const newStock = Number(dbItem.surplusQuantity) - qty;
        await MenuItems.findByIdAndUpdate(dbItem._id, {
          surplusQuantity: newStock,
          isAvailable: newStock > 0
        });

        rescuedMealsCount += qty;
        totalWasteKg += (qty * (dbItem.estimatedWasteKg || 0.45));
      }

      const itemTotal = Number(dbItem.price) * qty;
      subtotal += itemTotal;

      validatedItems.push({
        menuItemId: dbItem._id,
        name: dbItem.name,
        price: Number(dbItem.price),
        quantity: qty,
        isSurplus: Boolean(dbItem.isSurplus),
        image: dbItem.image,
        category: dbItem.category
      });
    }

    const deliveryFee = Number(restaurant.deliveryFee || 30);
    const ecoPackagingFee = (ecoPackagingSelected && restaurant.ecoPackagingAvailable)
      ? Number(restaurant.ecoPackagingFee || 15)
      : 0;

    // Eco points calculation
    let ecoPointsEarned = 10; // Base participation
    if (noCutlery) ecoPointsEarned += 15; // Cutlery avoided
    if (ecoPackagingSelected) ecoPointsEarned += 10; // Eco box used
    if (rescuedMealsCount > 0) ecoPointsEarned += (rescuedMealsCount * 25); // Rescued meals bonus!

    // Handle redemption: 10 points = ₹5 discount
    let discount = 0;
    const user = await Users.findById(req.user._id);
    const availablePoints = user ? (user.rewardPoints || 0) : 0;
    const pointsToUse = Math.min(Number(ecoPointsToRedeem) || 0, availablePoints);

    if (pointsToUse > 0) {
      discount = Math.floor(pointsToUse / 2); // 10 pts = ₹5
    }

    const totalAmount = Math.max(0, subtotal + deliveryFee + ecoPackagingFee + Number(tip || 0) - discount);
    const orderNumber = 'FL-' + Math.floor(1000 + Math.random() * 9000);

    const now = new Date();
    const newOrder = await Orders.create({
      orderNumber,
      customerId: req.user._id,
      customerName: req.user.name,
      customerPhone: req.user.phone || '+91 98765 43210',
      restaurantId: restaurant._id,
      restaurantName: restaurant.name,
      restaurantAddress: restaurant.address,
      items: validatedItems,
      subtotal,
      deliveryFee,
      ecoPackagingFee,
      tip: Number(tip || 0),
      discount,
      totalAmount,
      noCutlery: Boolean(noCutlery),
      ecoPackagingSelected: Boolean(ecoPackagingSelected),
      ecoPointsEarned,
      ecoPointsUsed: pointsToUse,
      rescuedMealsCount,
      wasteSavedKg: Math.round(totalWasteKg * 10) / 10,
      status: 'Placed',
      statusHistory: [
        {
          status: 'Placed',
          timestamp: now.toISOString(),
          note: `Order placed. ${noCutlery ? 'No cutlery requested.' : ''} ${ecoPackagingSelected ? 'Biodegradable packaging selected.' : ''}`
        }
      ],
      deliveryAddress: deliveryAddress || req.user.address,
      paymentStatus: 'Paid',
      paymentMethod,
      estimatedDeliveryTime: 30,
      deliveryPartnerLocation: {
        lat: (restaurant.address?.coordinates?.[1] || 28.471) + 0.005,
        lng: (restaurant.address?.coordinates?.[0] || 77.086) + 0.005
      }
    });

    // Update customer's eco points and rescue counters
    if (user) {
      const netPointsChange = ecoPointsEarned - pointsToUse;
      await Users.findByIdAndUpdate(user._id, {
        $inc: {
          rewardPoints: netPointsChange,
          totalMealsRescued: rescuedMealsCount,
          totalWasteSavedKg: Math.round(totalWasteKg * 10) / 10
        }
      });
    }

    // Update restaurant rescue metrics
    await Restaurants.findByIdAndUpdate(restaurant._id, {
      $inc: {
        mealsRescuedCount: rescuedMealsCount,
        wastePreventedKg: Math.round(totalWasteKg * 10) / 10
      }
    });

    return res.status(201).json({
      message: 'Order placed successfully!',
      order: newOrder
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to place order', error: err.message });
  }
}

export async function getMyOrders(req, res) {
  try {
    const orders = await Orders.find({ customerId: req.user._id }, { sort: { createdAt: -1 } });
    return res.json({ orders });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch customer orders', error: err.message });
  }
}

export async function getOrderById(req, res) {
  try {
    const { id } = req.params;
    const order = await Orders.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure authorized access (customer, restaurant owner, delivery partner, or admin)
    const isCustomer = String(order.customerId) === String(req.user._id);
    const isDeliveryPartner = String(order.deliveryPartnerId) === String(req.user._id);
    const isOwner = req.user.role === 'restaurant_owner';
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isDeliveryPartner && !isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Unauthorized to view this order' });
    }

    return res.json({ order });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch order', error: err.message });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = [
      'Placed',
      'Accepted',
      'Preparing',
      'Ready for Pickup',
      'Picked Up',
      'Out for Delivery',
      'Delivered',
      'Cancelled'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status: ${status}` });
    }

    const order = await Orders.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const history = order.statusHistory || [];
    history.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || `Order status updated to ${status} by ${req.user.name}`
    });

    const updateFields = {
      status,
      statusHistory: history
    };

    // If assigned to delivery partner
    if (status === 'Picked Up' && !order.deliveryPartnerId && req.user.role === 'delivery_partner') {
      updateFields.deliveryPartnerId = req.user._id;
      updateFields.deliveryPartnerName = req.user.name;
      updateFields.deliveryPartnerPhone = req.user.phone || '+91 98444 55667';
      updateFields.deliveryPartnerVehicle = req.user.vehicle || 'Zero-Emission EV Scooter';
    }

    // If delivered, update delivery partner stats
    if (status === 'Delivered' && order.deliveryPartnerId) {
      await Users.findByIdAndUpdate(order.deliveryPartnerId, {
        $inc: {
          completedDeliveries: 1,
          totalEarnings: 65 // Base delivery fee + green tip
        }
      });
    }

    const updated = await Orders.findByIdAndUpdate(id, updateFields, { new: true });
    return res.json({ message: `Order status updated to ${status}`, order: updated });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update order status', error: err.message });
  }
}

export async function addReview(req, res) {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const order = await Orders.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (String(order.customerId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Only the ordering customer can leave a review' });
    }

    const reviewObj = {
      score: Number(rating) || 5,
      review: comment || 'Great food and eco-friendly packaging!',
      createdAt: new Date().toISOString()
    };

    await Orders.findByIdAndUpdate(id, { rating: reviewObj });

    // Also add to Reviews collection for the restaurant
    await Reviews.create({
      restaurantId: order.restaurantId,
      customerId: req.user._id,
      customerName: req.user.name,
      rating: reviewObj.score,
      comment: reviewObj.review,
      orderNumber: order.orderNumber
    });

    // Re-calculate restaurant rating
    const allReviews = await Reviews.find({ restaurantId: order.restaurantId });
    if (allReviews.length > 0) {
      const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      await Restaurants.findByIdAndUpdate(order.restaurantId, {
        rating: Math.round(avg * 10) / 10,
        totalRatings: allReviews.length
      });
    }

    return res.json({ message: 'Review submitted successfully', review: reviewObj });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to add review', error: err.message });
  }
}

export async function getRestaurantOrders(req, res) {
  try {
    const restaurant = await Restaurants.findOne({ ownerId: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const orders = await Orders.find({ restaurantId: restaurant._id }, { sort: { createdAt: -1 } });
    return res.json({ orders });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch restaurant orders', error: err.message });
  }
}
