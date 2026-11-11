/**
 * Food Recommendation Algorithm using Hash Maps & Frequency Counting.
 * 
 * Data Structures:
 *   - Hash Map (JavaScript Map/Object) for O(1) order history frequency lookups.
 *   - Hash Map for user dietary and budget preferences.
 * 
 * Time Complexity:
 *   - Frequency Map Construction: O(M) where M is previous order items count.
 *   - Dish Scoring & Hash Lookups: O(N) where N is available menu items count.
 *   - Final Sorting: O(N log N)
 * Space Complexity: O(M + N)
 */

export function generateHashRecommendations(menuItems, pastOrders, userPreferences = {}, options = {}) {
  const {
    targetBudget = 350,
    dietaryPreference = 'all',
    preferredCuisine = 'all',
    trackSteps = true
  } = options;

  const steps = [];

  // 1. Build Frequency Maps from past orders
  const cuisineFrequencyMap = new Map();
  const categoryFrequencyMap = new Map();
  let totalPastItemsAnalyzed = 0;

  for (const order of pastOrders) {
    for (const item of (order.items || [])) {
      totalPastItemsAnalyzed++;
      const cat = (item.category || 'Main Course').toLowerCase();
      categoryFrequencyMap.set(cat, (categoryFrequencyMap.get(cat) || 0) + (item.quantity || 1));
    }
  }

  // 2. User Preference Hash Map
  const userProfileMap = new Map([
    ['targetBudget', Number(targetBudget)],
    ['dietaryPreference', dietaryPreference.toLowerCase()],
    ['preferredCuisine', preferredCuisine.toLowerCase()],
    ['favoriteCuisines', userPreferences.favoriteCuisines || []]
  ]);

  if (trackSteps) {
    steps.push({
      step: 1,
      action: 'BUILD_HASH_MAPS',
      description: `Constructed Hash Maps from ${pastOrders.length} past orders (${totalPastItemsAnalyzed} total dishes).`,
      categoryFrequency: Object.fromEntries(categoryFrequencyMap),
      userProfile: Object.fromEntries(userProfileMap)
    });
  }

  // 3. Score each available menu item using O(1) Hash Map lookups
  const scoredDishes = [];
  const now = new Date();

  for (const item of menuItems) {
    if (!item.isAvailable) continue;
    if (item.isSurplus && item.surplusDeadline && new Date(item.surplusDeadline) <= now) continue;

    // Hard dietary filter
    const itemVeg = Boolean(item.isVeg);
    if (dietaryPreference === 'veg' && !itemVeg) continue;
    if (dietaryPreference === 'non-veg' && itemVeg) continue;

    const price = Number(item.price);
    const catKey = (item.category || '').toLowerCase();
    let score = 0;
    const scoreLog = [];

    // Factor A: Budget Fit (up to 40 pts)
    if (price <= targetBudget) {
      const savingsRatio = (targetBudget - price) / targetBudget;
      const budgetPoints = Math.round(25 + (1 - savingsRatio) * 15);
      score += budgetPoints;
      scoreLog.push(`Budget Match: +${budgetPoints} pts (₹${price} <= ₹${targetBudget})`);
    } else {
      score -= 35;
      scoreLog.push(`Over Budget: -35 pts (₹${price} > ₹${targetBudget})`);
    }

    // Factor B: O(1) Frequency Map Lookup for past affinity
    const pastOrderCount = categoryFrequencyMap.get(catKey) || 0;
    if (pastOrderCount > 0) {
      const freqPoints = Math.min(30, pastOrderCount * 10);
      score += freqPoints;
      scoreLog.push(`Past Order Frequency (${pastOrderCount}x ordered ${catKey}): +${freqPoints} pts`);
    }

    // Factor C: SDG 12 Surplus Food Rescue Priority (+35 pts)
    if (item.isSurplus) {
      score += 35;
      scoreLog.push(`SDG 12 Food Rescue Bonus (${item.discountPercentage}% OFF): +35 pts`);
    }

    // Factor D: Cuisine alignment
    if (preferredCuisine !== 'all' && catKey.includes(preferredCuisine.toLowerCase())) {
      score += 20;
      scoreLog.push(`Preferred Cuisine Alignment: +20 pts`);
    }

    const finalDish = {
      ...item,
      recommendationScore: Math.max(10, score),
      scoreLog,
      pastOrderCount
    };

    scoredDishes.push(finalDish);
  }

  // 4. Sort candidates by recommendation score descending
  scoredDishes.sort((a, b) => b.recommendationScore - a.recommendationScore);

  if (trackSteps) {
    steps.push({
      step: 2,
      action: 'HASH_LOOKUP_AND_SCORING',
      description: `Scored ${scoredDishes.length} menu items using O(1) frequency lookups and budget constraints. Top ranked dish: "${scoredDishes[0]?.name}" (Score: ${scoredDishes[0]?.recommendationScore}).`,
      topScoredDishes: scoredDishes.slice(0, 5).map(d => ({
        name: d.name,
        price: d.price,
        score: d.recommendationScore,
        reasons: d.scoreLog
      }))
    });
  }

  return {
    recommendations: scoredDishes,
    topPicks: scoredDishes.slice(0, 8),
    categoryFrequency: Object.fromEntries(categoryFrequencyMap),
    userProfile: Object.fromEntries(userProfileMap),
    steps,
    timeComplexity: 'O(M + N log N) where M = past orders, N = menu items',
    spaceComplexity: 'O(M + N)'
  };
}
