import { MenuItems, Restaurants, Orders } from '../db/storage.js';

export async function getSurplusDeals(req, res) {
  try {
    const { category, maxPrice, isVeg } = req.query;
    const now = new Date();

    const items = await MenuItems.find({
      isSurplus: true,
      isAvailable: true
    });

    const restaurants = await Restaurants.find({});
    const restMap = new Map(restaurants.map(r => [String(r._id), r]));

    const activeDeals = [];

    for (const item of items) {
      const deadline = item.surplusDeadline ? new Date(item.surplusDeadline) : null;
      const isExpired = deadline && deadline <= now;
      const isOutOfStock = Number(item.surplusQuantity) <= 0;

      // Automatically mark unavailable if deadline passed or stock is 0
      if (isExpired || isOutOfStock) {
        if (item.isAvailable) {
          await MenuItems.findByIdAndUpdate(item._id, { isAvailable: false });
        }
        continue;
      }

      if (category && category !== 'all' && item.category !== category) {
        continue;
      }

      if (maxPrice && Number(item.price) > Number(maxPrice)) {
        continue;
      }

      if (isVeg !== undefined && isVeg !== 'all') {
        const wantVeg = isVeg === 'true';
        if (item.isVeg !== wantVeg) continue;
      }

      const rest = restMap.get(String(item.restaurantId));
      const hoursRemaining = deadline
        ? Math.max(0, (deadline - now) / (1000 * 60 * 60)).toFixed(1)
        : 4.0;

      activeDeals.push({
        ...item,
        hoursRemaining: Number(hoursRemaining),
        restaurantName: rest ? rest.name : 'Partner Kitchen',
        restaurantAddress: rest ? rest.address : {},
        restaurantRating: rest ? rest.rating : 4.8,
        ecoPackagingAvailable: rest ? rest.ecoPackagingAvailable : true,
        deliveryTime: rest ? rest.deliveryTime : '25 mins'
      });
    }

    // Sort by discount percentage descending by default
    activeDeals.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));

    return res.json({ deals: activeDeals });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch surplus deals', error: err.message });
  }
}

export async function getRescueStats(req, res) {
  try {
    const allRestaurants = await Restaurants.find({});
    const allOrders = await Orders.find({ status: 'Delivered' });

    let baselineRescued = 0;
    let baselineWasteKg = 0;

    for (const r of allRestaurants) {
      baselineRescued += (r.mealsRescuedCount || 0);
      baselineWasteKg += (r.wastePreventedKg || 0);
    }

    let dynamicRescued = 0;
    let dynamicWasteKg = 0;

    for (const o of allOrders) {
      for (const it of o.items || []) {
        if (it.isSurplus) {
          dynamicRescued += Number(it.quantity || 1);
          dynamicWasteKg += Number(it.quantity || 1) * 0.45;
        }
      }
    }

    const totalMealsRescued = baselineRescued + dynamicRescued;
    const totalWasteKg = Math.round((baselineWasteKg + dynamicWasteKg) * 10) / 10;
    const totalCo2SavedKg = Math.round(totalWasteKg * 2.5 * 10) / 10; // 2.5 kg CO2 per kg food waste
    const waterSavedLiters = Math.round(totalMealsRescued * 180); // approx 180L virtual water saved per meal

    return res.json({
      stats: {
        totalMealsRescued,
        totalWasteKg,
        totalCo2SavedKg,
        waterSavedLiters,
        activePartnersCount: allRestaurants.length,
        sdgGoals: ['SDG 12: Responsible Consumption', 'SDG 9: Industry & Innovation', 'SDG 13: Climate Action']
      }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch rescue stats', error: err.message });
  }
}
