/**
 * Comprehensive Automated Test Suite for FoodLoop DSA & OOP Modules.
 * Course: CSE B.Tech 2nd Year Data Structures Lab (PBL)
 * Jaypee Institute of Information Technology (JIIT), Noida-62
 * Faculty: Sherry Garg & Lalita Mishra
 * 
 * Tests 10 Core Data Structures and Algorithms:
 * 1. Road Network Graph (Adjacency List)
 * 2. Dijkstra's Shortest Path Algorithm
 * 3. Min-Priority Queue (Binary Min-Heap)
 * 4. FIFO Order Processing Queue
 * 5. Merge Sort Algorithm
 * 6. Binary Search vs Linear Search
 * 7. Doubly Linked List (Order Status Lifecycle)
 * 8. LIFO Stack (Cart Action Undo / Redo Engine)
 * 9. Binary Search Tree (Menu Price Range Indexer)
 * 10. OOP Domain Hierarchy & Polymorphism
 */

import assert from 'assert';
import { roadNetwork } from '../src/algorithms/roadGraph.js';
import { dijkstraShortestPath } from '../src/algorithms/dijkstra.js';
import { MinPriorityQueue } from '../src/algorithms/priorityQueue.js';
import { FIFOQueue, UrgencyPriorityQueue } from '../src/algorithms/orderQueue.js';
import { mergeSortRestaurants, binarySearchRestaurant, linearSearchRestaurants } from '../src/algorithms/sortingSearching.js';
import { prioritizeSurplusDeals } from '../src/algorithms/surplusHeap.js';
import { generateHashRecommendations } from '../src/algorithms/recommendationHash.js';
import { OrderTrackingLinkedList } from '../src/algorithms/doublyLinkedList.js';
import { Stack, CartActionStack } from '../src/algorithms/stack.js';
import { BinarySearchTree } from '../src/algorithms/binarySearchTree.js';
import { CustomerUser, RestaurantOwnerUser, DeliveryPartnerUser, AdminUser, RegularFoodItem, SurplusFoodDeal } from '../src/algorithms/oopModels.js';
import { calculateMicrobialFreshness, FreshnessSegmentTree } from '../src/algorithms/freshnessKinetics.js';
import { DisjointSetUnion, matchSurplusToShelters } from '../src/algorithms/zeroHungerDispatch.js';
import { calculateMultimodalRelayRoute } from '../src/algorithms/multimodalRelay.js';
import { solveEcoNutrientKnapsack } from '../src/algorithms/ecoKnapsack.js';

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

console.log('\n======================================================');
console.log('   FOODLOOP DATA STRUCTURES & OOP LAB TEST HARNESS   ');
console.log('======================================================\n');

// 1. Graph Test
console.log('--- 1. Road Network Graph (Adjacency List) ---');
test('Graph contains 16 sector nodes and bidirectional edges', () => {
  const nodes = roadNetwork.getAllNodes();
  assert.strictEqual(nodes.length, 16, 'Expected 16 sector nodes');
  assert.ok(roadNetwork.nodes['N1'], 'N1 must exist');
  assert.ok(roadNetwork.nodes['N7'], 'N7 must exist');

  const neighborsN1 = roadNetwork.getNeighbors('N1');
  assert.ok(neighborsN1.length > 0, 'N1 should have adjacent neighbors');
  // Check bidirectionality
  const firstNeighbor = neighborsN1[0];
  const backNeighbors = roadNetwork.getNeighbors(firstNeighbor.node);
  const connectsBack = backNeighbors.some(nb => nb.node === 'N1');
  assert.ok(connectsBack, 'Road graph must be bidirectional');
});

// 2. Dijkstra Test
console.log('\n--- 2. Dijkstra Shortest Path Algorithm ---');
test('Calculates valid shortest path between N1 and N7', () => {
  const result = dijkstraShortestPath('N1', 'N7', true);
  assert.strictEqual(result.success, true);
  assert.ok(result.totalDistanceKm > 0, 'Distance should be greater than 0');
  assert.strictEqual(result.path[0], 'N1', 'Start of path must be N1');
  assert.strictEqual(result.path[result.path.length - 1], 'N7', 'End of path must be N7');
  assert.ok(result.steps.length > 0, 'Steps must be tracked for viva analysis');
});

// 3. Min-Priority Queue Test
console.log('\n--- 3. Min-Priority Queue (Binary Min-Heap) ---');
test('Maintains Min-Heap invariant across multiple inserts and extractions', () => {
  const pq = new MinPriorityQueue();
  pq.insert('Deal C (120 mins)', 120);
  pq.insert('Deal A (30 mins)', 30);
  pq.insert('Deal D (180 mins)', 180);
  pq.insert('Deal B (45 mins)', 45);

  assert.strictEqual(pq.size(), 4);
  assert.strictEqual(pq.peek().priority, 30, 'Root of min-heap must be smallest priority (30)');

  const min1 = pq.extractMin();
  assert.strictEqual(min1.priority, 30);

  const min2 = pq.extractMin();
  assert.strictEqual(min2.priority, 45);

  const min3 = pq.extractMin();
  assert.strictEqual(min3.priority, 120);

  const min4 = pq.extractMin();
  assert.strictEqual(min4.priority, 180);

  assert.strictEqual(pq.isEmpty(), true);
});

// 4. FIFO Queue Test
console.log('\n--- 4. FIFO Queue & Urgency Queue ---');
test('FIFO queue enqueues and dequeues in exact chronological order', () => {
  const fifo = new FIFOQueue();
  fifo.enqueue({ orderNumber: 'ORD-101', totalAmount: 350 });
  fifo.enqueue({ orderNumber: 'ORD-102', totalAmount: 520 });
  fifo.enqueue({ orderNumber: 'ORD-103', totalAmount: 180 });

  assert.strictEqual(fifo.size(), 3);
  assert.strictEqual(fifo.peek().orderNumber, 'ORD-101');

  const dequeued = fifo.dequeue();
  assert.strictEqual(dequeued.orderNumber, 'ORD-101');
  assert.strictEqual(fifo.size(), 2);
  assert.strictEqual(fifo.peek().orderNumber, 'ORD-102');
});

// 5. Merge Sort Test
console.log('\n--- 5. Merge Sort (Divide & Conquer) ---');
test('Sorts restaurants by rating descending in O(N log N) time', () => {
  const mockRestaurants = [
    { name: 'Cafe A', rating: 3.8 },
    { name: 'Cafe B', rating: 4.9 },
    { name: 'Cafe C', rating: 4.2 },
    { name: 'Cafe D', rating: 4.7 }
  ];

  const sortedResult = mergeSortRestaurants(mockRestaurants, 'rating', [77.086, 28.471], true);
  assert.ok(sortedResult.sorted);
  const ratings = sortedResult.sorted.map(r => r.rating);
  assert.deepStrictEqual(ratings, [4.9, 4.7, 4.2, 3.8], 'Ratings must be descending');
  assert.ok(sortedResult.steps.length > 0, 'Merge steps must be recorded');
});

// 6. Binary Search vs Linear Search Test
console.log('\n--- 6. Binary Search vs Linear Search ---');
test('Binary search finds item in O(log N) while linear search takes O(N)', () => {
  const mockSorted = [
    { name: 'Artisan Bakery', rating: 4.8 },
    { name: 'Bao Craft', rating: 4.6 },
    { name: 'Earth Kitchen', rating: 4.9 },
    { name: 'GreenBowl Healthy', rating: 4.7 },
    { name: 'Pure Greens Salad', rating: 4.5 }
  ];

  const binResult = binarySearchRestaurant(mockSorted, 'Earth Kitchen', true);
  assert.strictEqual(binResult.found, true);
  assert.strictEqual(binResult.restaurant.name, 'Earth Kitchen');
  assert.ok(binResult.totalComparisons <= Math.ceil(Math.log2(mockSorted.length)) + 1);

  const linResult = linearSearchRestaurants(mockSorted, 'Earth Kitchen', true);
  assert.ok(linResult.totalMatches > 0);
  assert.ok(linResult.totalComparisons > 0);
});

// 7. Doubly Linked List Test
console.log('\n--- 7. Doubly Linked List (Order Status Lifecycle) ---');
test('Advances and reverts order stages via next and prev pointers in O(1)', () => {
  const lifecycle = OrderTrackingLinkedList.createDefaultLifecycle('TEST-ORD-01');
  assert.strictEqual(lifecycle.size, 6);
  assert.strictEqual(lifecycle.getCurrentStage().stageKey, 'PLACED');

  // Advance to CONFIRMED
  const adv1 = lifecycle.advanceStage();
  assert.strictEqual(adv1.success, true);
  assert.strictEqual(lifecycle.getCurrentStage().stageKey, 'CONFIRMED');
  assert.strictEqual(lifecycle.getCurrentStage().prev.stageKey, 'PLACED');

  // Advance to PREPARING
  const adv2 = lifecycle.advanceStage();
  assert.strictEqual(adv2.success, true);
  assert.strictEqual(lifecycle.getCurrentStage().stageKey, 'PREPARING');

  // Revert back to CONFIRMED
  const rev1 = lifecycle.revertStage();
  assert.strictEqual(rev1.success, true);
  assert.strictEqual(lifecycle.getCurrentStage().stageKey, 'CONFIRMED');

  const arrayRep = lifecycle.toArray();
  assert.strictEqual(arrayRep.length, 6);
});

// 8. Stack Test (Cart Action Undo / Redo)
console.log('\n--- 8. LIFO Stack (Cart Undo / Redo Engine) ---');
test('Stack records actions and performs rollback (Undo) and recovery (Redo) in O(1)', () => {
  const cartStack = new CartActionStack();
  assert.strictEqual(cartStack.undoStack.size(), 0);

  // Add Item 1
  cartStack.recordAction('ADD_ITEM', { name: 'Acai Bowl', price: 240, quantity: 1 });
  assert.strictEqual(cartStack.undoStack.size(), 1);
  assert.strictEqual(cartStack.undoStack.peek().itemPayload.name, 'Acai Bowl');

  // Add Item 2
  cartStack.recordAction('ADD_ITEM', { name: 'Chia Pudding', price: 160, quantity: 1 });
  assert.strictEqual(cartStack.undoStack.size(), 2);

  // Undo (should pop Item 2)
  const undoResult = cartStack.undo();
  assert.strictEqual(undoResult.success, true);
  assert.strictEqual(cartStack.undoStack.size(), 1);
  assert.strictEqual(cartStack.redoStack.size(), 1);

  // Redo (should re-apply Item 2)
  const redoResult = cartStack.redo();
  assert.strictEqual(redoResult.success, true);
  assert.strictEqual(cartStack.undoStack.size(), 2);
  assert.strictEqual(cartStack.redoStack.size(), 0);
});

// 9. Binary Search Tree Test
console.log('\n--- 9. Binary Search Tree (Menu Price Indexer) ---');
test('BST inserts nodes, performs in-order traversal and executes range query', () => {
  const bst = new BinarySearchTree();
  bst.insert(250, { name: 'Falafel Wrap' });
  bst.insert(120, { name: 'Iced Lemon Tea' });
  bst.insert(380, { name: 'Quinoa Buddha Bowl' });
  bst.insert(180, { name: 'Avocado Toast' });
  bst.insert(300, { name: 'Vegan Burger' });

  assert.strictEqual(bst.totalNodes, 5);
  assert.strictEqual(bst.getMin().price, 120);
  assert.strictEqual(bst.getMax().price, 380);

  // In-order traversal must be sorted ascending
  const inOrder = bst.inOrderTraversal();
  const prices = inOrder.map(i => i.price);
  assert.deepStrictEqual(prices, [120, 180, 250, 300, 380]);

  // Range Query: between 150 and 320
  const range = bst.rangeQuery(150, 320);
  assert.strictEqual(range.totalMatched, 3); // 180, 250, 300
  const matchedPrices = range.items.map(i => i.price);
  assert.deepStrictEqual(matchedPrices, [180, 250, 300]);
});

// 10. OOP Hierarchy & Polymorphism Test
console.log('\n--- 10. Object-Oriented Domain Hierarchy & Polymorphism ---');
test('Validates encapsulation, class inheritance and dynamic polymorphic method overrides', () => {
  const customer = new CustomerUser('U-1', 'Ronak', 'ronak@jiit.ac.in', 100, 2);
  const courier = new DeliveryPartnerUser('U-2', 'Aman', 'aman@ev.com', 'Electric Bike EV', 'N3');

  // Encapsulation test
  assert.strictEqual(customer.getName(), 'Ronak');
  assert.strictEqual(customer.getRole(), 'customer');

  // Polymorphic dashboard routing
  assert.strictEqual(customer.getDashboardRoute(), '/sustainability');
  assert.strictEqual(courier.getDashboardRoute(), '/delivery-dashboard');

  // Polymorphic Food Items
  const regularDish = new RegularFoodItem('D-1', 'Pasta Fresca', 300, 'Italian', true);
  const surplusDeal = new SurplusFoodDeal('D-2', 'Surplus Artisan Bread', 200, 'Bakery', true, 50);

  // Polymorphic calculateFinalPrice
  const regPrice = regularDish.calculateFinalPrice(true); // 300 + 10 packaging = 310
  const surplusPrice = surplusDeal.calculateFinalPrice(true); // (200 * 0.5) + 10 packaging = 110

  assert.strictEqual(regPrice, 310);
  assert.strictEqual(surplusPrice, 110);

  // Polymorphic getEcoImpactScore
  assert.ok(surplusDeal.getEcoImpactScore() > regularDish.getEcoImpactScore(), 'Surplus deal must have higher eco score for waste diversion');
});

// 11. Microbial Freshness & Segment Tree Test
console.log('\n--- 11. Microbial Freshness Decay & Segment Tree ---');
test('Calculates Arrhenius microbial decay and executes Segment Tree range query in O(log N)', () => {
  const freshness = calculateMicrobialFreshness({
    basePrice: 300,
    floorPrice: 100,
    prepTimeMinutesAgo: 90,
    storageType: 'thermal_insulated'
  });
  assert.ok(freshness.freshnessIndex > 0 && freshness.freshnessIndex <= 100);
  assert.ok(freshness.dynamicPrice >= 100 && freshness.dynamicPrice <= 300);
  assert.strictEqual(freshness.isFSSAICertifiedSafe, true);

  // Segment Tree Test
  const mockBatches = [
    { id: 'B1', freshnessIndex: 88, restaurantName: 'R1', dishName: 'Dish 1' },
    { id: 'B2', freshnessIndex: 42, restaurantName: 'R2', dishName: 'Dish 2' },
    { id: 'B3', freshnessIndex: 65, restaurantName: 'R3', dishName: 'Dish 3' },
    { id: 'B4', freshnessIndex: 91, restaurantName: 'R4', dishName: 'Dish 4' }
  ];
  const segTree = new FreshnessSegmentTree(mockBatches);
  const rangeQuery = segTree.queryRange(0, 0, mockBatches.length - 1, 0, 3);
  assert.strictEqual(rangeQuery.minFreshnessIndex, 42);
  assert.strictEqual(rangeQuery.mostUrgentBatchId, 'B2');
});

// 12. Zero-Hunger Bipartite Matching & DSU Test
console.log('\n--- 12. Zero-Hunger Emergency Dispatch (DSU & Bipartite Matching) ---');
test('DSU clusters nodes and Bipartite Matching pairs kitchens to shelters', () => {
  const dsu = new DisjointSetUnion(['A', 'B', 'C', 'D']);
  dsu.union('A', 'B');
  dsu.union('C', 'D');
  assert.strictEqual(dsu.find('A'), dsu.find('B'));
  assert.notStrictEqual(dsu.find('A'), dsu.find('C'));
  assert.strictEqual(dsu.getClusters().length, 2);

  const dispatch = matchSurplusToShelters();
  assert.strictEqual(dispatch.success, true);
  assert.ok(dispatch.totalMealsDispatched > 0);
  assert.ok(dispatch.totalPeopleFed > 0);
  assert.ok(dispatch.matches.length > 0);
});

// 13. Multi-Modal Drone-EV Relay Test
console.log('\n--- 13. Multi-Modal Drone-EV Relay Route Optimizer ---');
test('Computes multi-modal drone-locker-EV route and verifies carbon avoidance', () => {
  const relay = calculateMultimodalRelayRoute('N1', 'N7', 5.6);
  assert.strictEqual(relay.success, true);
  assert.strictEqual(relay.legs.length, 3);
  assert.strictEqual(relay.legs[0].mode, 'AUTONOMOUS_ELECTRIC_DRONE');
  assert.strictEqual(relay.legs[1].mode, 'SMART_LOCKER_ROBOTIC_HANDSHAKE');
  assert.strictEqual(relay.legs[2].mode, 'ELECTRIC_SCOOTER_LAST_MILE');
  assert.ok(relay.comparison.foodLoopDroneRelay.co2AvoidedGrams > 0);
  assert.ok(relay.comparison.foodLoopDroneRelay.timeSavedMinutes > 0);
});

// 14. Eco-Nutrient DP Knapsack Test
console.log('\n--- 14. Eco-Nutrient Multi-Dimensional DP Knapsack ---');
test('Solves 0/1 knapsack maximizing protein within financial budget and carbon cap', () => {
  const knapsack = solveEcoNutrientKnapsack([], 300, 1.5);
  assert.strictEqual(knapsack.success, true);
  assert.ok(knapsack.optimalMealSet.items.length > 0);
  assert.ok(knapsack.optimalMealSet.totalCost <= 300);
  assert.ok(knapsack.optimalMealSet.totalProteinGrams > 20);
  assert.strictEqual(knapsack.optimalMealSet.carbonBudgetCompliant, true);
});

console.log('\n======================================================');
console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log('======================================================\n');

if (failed > 0) {
  process.exit(1);
}
