import { MenuItems, Restaurants, Orders, Users } from '../db/storage.js';

export async function getSmartRecommendations(req, res) {
  try {
    const {
      budget = 350,
      preference = 'all',
      cuisine = 'all',
      sortBy = 'smart_score'
    } = req.query;

    const maxBudget = Number(budget) || 350;
    const now = new Date();

    const items = await MenuItems.find({ isAvailable: true });
    const restaurants = await Restaurants.find({ status: 'approved' });
    const restMap = new Map(restaurants.map(r => [String(r._id), r]));

    // Check customer's previous history if authenticated
    let userPastCuisines = new Set();
    if (req.user && req.user._id) {
      const pastOrders = await Orders.find({ customerId: req.user._id });
      for (const ord of pastOrders) {
        for (const it of ord.items || []) {
          if (it.category) userPastCuisines.add(it.category.toLowerCase());
        }
      }
      if (req.user.favoriteCuisines) {
        req.user.favoriteCuisines.forEach(c => userPastCuisines.add(c.toLowerCase()));
      }
    }

    const scoredItems = [];

    for (const item of items) {
      // Exclude expired surplus
      if (item.isSurplus) {
        const deadline = item.surplusDeadline ? new Date(item.surplusDeadline) : null;
        if (deadline && deadline <= now) continue;
        if (Number(item.surplusQuantity) <= 0) continue;
      }

      // Filter by preference
      if (preference === 'veg' && !item.isVeg) continue;
      if (preference === 'non-veg' && item.isVeg) continue;

      const rest = restMap.get(String(item.restaurantId));
      if (!rest) continue;

      // Filter by cuisine if specified
      if (cuisine !== 'all') {
        const cLower = cuisine.toLowerCase();
        const matchesCategory = item.category && item.category.toLowerCase().includes(cLower);
        const matchesRestCuisine = rest.cuisines && rest.cuisines.some(c => c.toLowerCase().includes(cLower));
        if (!matchesCategory && !matchesRestCuisine) continue;
      }

      let score = 0;
      const reasons = [];

      // 1. Budget Evaluation
      const price = Number(item.price);
      if (price <= maxBudget) {
        // Budget match score: up to 35 pts
        const savingsRatio = (maxBudget - price) / maxBudget;
        score += 25 + Math.round((1 - savingsRatio) * 10);
        reasons.push(`Fits nicely in your ₹${maxBudget} budget (₹${price})`);
      } else {
        // Over budget penalty
        score -= 40;
      }

      // 2. Food Rescue (SDG 12) Innovation bonus
      if (item.isSurplus) {
        score += 35;
        reasons.push(`SDG 12 Rescue Deal: ${item.discountPercentage}% OFF`);
      }

      // 3. Restaurant Rating weight
      const restRating = rest.rating || 4.5;
      score += Math.round((restRating / 5) * 20);

      // 4. Past Affinity
      if (userPastCuisines.has((item.category || '').toLowerCase())) {
        score += 15;
        reasons.push('Matches your taste history');
      }

      // 5. Eco-friendly packaging bonus
      if (rest.ecoPackagingAvailable) {
        score += 5;
      }

      scoredItems.push({
        ...item,
        smartScore: Math.max(10, score),
        matchReasons: reasons,
        restaurantName: rest.name,
        restaurantRating: rest.rating,
        restaurantAddress: rest.address,
        deliveryTime: rest.deliveryTime || '25-30 mins',
        deliveryFee: rest.deliveryFee || 30
      });
    }

    // Sort according to requested parameter
    if (sortBy === 'price_asc') {
      scoredItems.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'rating') {
      scoredItems.sort((a, b) => (b.restaurantRating || 0) - (a.restaurantRating || 0));
    } else if (sortBy === 'rescue_first') {
      scoredItems.sort((a, b) => (b.isSurplus ? 1 : 0) - (a.isSurplus ? 1 : 0) || b.smartScore - a.smartScore);
    } else {
      // Default: smart_score
      scoredItems.sort((a, b) => b.smartScore - a.smartScore);
    }

    // Curate sections for the UI
    const topPicks = scoredItems.filter(i => i.price <= maxBudget).slice(0, 8);
    const rescuePicks = scoredItems.filter(i => i.isSurplus && i.price <= maxBudget).slice(0, 6);
    const superSavers = scoredItems.filter(i => i.price <= (maxBudget * 0.65)).slice(0, 6);

    return res.json({
      query: { budget: maxBudget, preference, cuisine, sortBy },
      totalMatches: scoredItems.length,
      topPicks,
      rescuePicks,
      superSavers
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to generate recommendations', error: err.message });
  }
}
