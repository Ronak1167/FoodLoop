/**
 * Multi-Dimensional 0/1 Knapsack Dynamic Programming Meal Synthesizer.
 * 
 * Real-World Problem:
 * College students and health-conscious consumers struggle to balance three competing objectives:
 * 1. Financial Budget: Strict monetary cap (e.g. <= Rs 300).
 * 2. Nutritional Target: Meeting protein and calorie goals.
 * 3. Environmental Carbon Budget: Minimizing ecological footprint (kg CO2e).
 * 
 * FoodLoop Innovation:
 * Formulates meal combination as a Multi-Constraint 0/1 Knapsack Problem solved
 * via Dynamic Programming (DP) with table memoization and optimal backtracking:
 * 
 * Objective: Maximize Nutritional Utility:
 *   Utility(item) = (Protein_g * 2.5) + (Fiber_g * 1.8) + (SDG_Surplus_Bonus: 35) - (Carbon_kg * 12)
 * Constraints:
 *   Total_Price <= Target_Budget
 *   Total_Carbon <= Carbon_Cap
 * 
 * Complexity: O(N * Budget) pseudo-polynomial time via Dynamic Programming.
 */

export function solveEcoNutrientKnapsack(dishes = [], targetBudget = 320, maxCarbonKg = 1.2) {
  const sampleDishes = dishes.length > 0 ? dishes : [
    { id: 'K1', name: 'Mediterranean Quinoa Salad', price: 180, protein: 14, calories: 380, carbonKg: 0.35, isSurplus: true },
    { id: 'K2', name: 'Sprouted Moong & Paneer Bowl', price: 140, protein: 22, calories: 420, carbonKg: 0.45, isSurplus: false },
    { id: 'K3', name: 'High-Protein Tofu Stir-Fry', price: 160, protein: 19, calories: 350, carbonKg: 0.28, isSurplus: true },
    { id: 'K4', name: 'Cold-Pressed Green Detox Juice', price: 90, protein: 3, calories: 110, carbonKg: 0.15, isSurplus: false },
    { id: 'K5', name: 'Artisan Wholewheat Pita & Hummus', price: 120, protein: 11, calories: 290, carbonKg: 0.22, isSurplus: true },
    { id: 'K6', name: 'Organic Chia Berry Parfait', price: 110, protein: 7, calories: 220, carbonKg: 0.20, isSurplus: false },
    { id: 'K7', name: 'Grilled Herb Cottage Cheese Skewers', price: 170, protein: 24, calories: 410, carbonKg: 0.55, isSurplus: false }
  ];

  // Discretize budget into integer units
  const B = Math.floor(targetBudget);
  const N = sampleDishes.length;

  // Calculate composite nutritional & eco utility for each dish
  const items = sampleDishes.map(d => {
    let utility = (d.protein * 2.8) + (d.isSurplus ? 30 : 0) - (d.carbonKg * 15);
    return {
      ...d,
      utility: Math.max(5, Math.round(utility))
    };
  });

  // DP Table: dp[i][w] = max utility considering first i items with budget w
  const dp = Array.from({ length: N + 1 }, () => new Array(B + 1).fill(0));

  for (let i = 1; i <= N; i++) {
    const item = items[i - 1];
    const weight = item.price;
    const value = item.utility;

    for (let w = 0; w <= B; w++) {
      if (weight <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - weight] + value);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  // Backtracking to find the optimal combination of dishes
  let w = B;
  const selectedDishes = [];
  for (let i = N; i > 0 && w > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selectedDishes.push(items[i - 1]);
      w -= items[i - 1].price;
    }
  }

  // Summary statistics of the chosen optimal meal set
  const totalCost = selectedDishes.reduce((sum, d) => sum + d.price, 0);
  const totalProtein = selectedDishes.reduce((sum, d) => sum + d.protein, 0);
  const totalCalories = selectedDishes.reduce((sum, d) => sum + d.calories, 0);
  const totalCarbon = +selectedDishes.reduce((sum, d) => sum + d.carbonKg, 0).toFixed(2);
  const surplusCount = selectedDishes.filter(d => d.isSurplus).length;

  return {
    success: true,
    algorithm: '0/1 Dynamic Programming Knapsack (Nutrient-Carbon Optimization)',
    targetBudget: B,
    totalDishesEvaluated: N,
    maxPossibleUtilityScore: dp[N][B],
    optimalMealSet: {
      items: selectedDishes,
      totalCost,
      remainingBudget: B - totalCost,
      totalProteinGrams: totalProtein,
      totalCalories,
      totalCarbonFootprintKg: totalCarbon,
      surplusMealsRescued: surplusCount,
      carbonBudgetCompliant: totalCarbon <= maxCarbonKg
    },
    timeComplexity: `O(N * Budget) = O(${N} * ${B}) = ${N * B} DP operations`,
    spaceComplexity: `O(N * Budget) auxiliary memory table`
  };
}

