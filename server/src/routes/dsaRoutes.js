import express from 'express';
import { roadNetwork } from '../algorithms/roadGraph.js';
import { dijkstraShortestPath } from '../algorithms/dijkstra.js';
import { allocateDeliveryPartner } from '../algorithms/partnerAllocation.js';
import { mergeSortRestaurants, binarySearchRestaurant, linearSearchRestaurants } from '../algorithms/sortingSearching.js';
import { FIFOQueue, UrgencyPriorityQueue } from '../algorithms/orderQueue.js';
import { prioritizeSurplusDeals } from '../algorithms/surplusHeap.js';
import { generateHashRecommendations } from '../algorithms/recommendationHash.js';
import { OrderTrackingLinkedList } from '../algorithms/doublyLinkedList.js';
import { CartActionStack } from '../algorithms/stack.js';
import { BinarySearchTree } from '../algorithms/binarySearchTree.js';
import { CustomerUser, RestaurantOwnerUser, DeliveryPartnerUser, AdminUser, RegularFoodItem, SurplusFoodDeal } from '../algorithms/oopModels.js';
import { calculateMicrobialFreshness } from '../algorithms/freshnessKinetics.js';
import { matchSurplusToShelters } from '../algorithms/zeroHungerDispatch.js';
import { calculateMultimodalRelayRoute } from '../algorithms/multimodalRelay.js';
import { solveEcoNutrientKnapsack } from '../algorithms/ecoKnapsack.js';
import { Restaurants, Users, Orders, MenuItems } from '../db/storage.js';

const router = express.Router();

// Stateful instances for interactive live demo
const activeTrackingSession = OrderTrackingLinkedList.createDefaultLifecycle('ORDER-LIVE-9021');
const activeCartStackSession = new CartActionStack([
  { id: 'SEED-1', name: 'Mediterranean Quinoa Salad Bowl', price: 280, quantity: 1 }
]);

// 1. Comprehensive DSA & PBL Summary Registry
router.get('/summary', (req, res) => {
  res.json({
    project: 'FoodLoop – Smart & Sustainable Food Delivery System',
    course: 'CSE B.Tech 2nd Year, Data Structures Lab (PBL)',
    institution: 'Jaypee Institute of Information Technology (JIIT), Noida-62',
    faculty: ['Sherry Garg', 'Lalita Mishra'],
    sdgAlignment: {
      primary: 'SDG 12: Responsible Consumption and Production (Food Rescue surplus deals & eco packaging)',
      secondary: 'SDG 9: Industry, Innovation & Infrastructure (Smart group delivery route consolidation)'
    },
    implementedDataStructures: [
      {
        name: 'Graph (Adjacency List)',
        type: 'Non-Linear',
        usage: 'City road network model with 16 sector hubs, road weights (km), and transit types',
        timeComplexity: 'O(V + E) representation, O(deg(V)) neighbor lookup',
        spaceComplexity: 'O(V + E)'
      },
      {
        name: "Dijkstra's Algorithm",
        type: 'Graph Shortest Path',
        usage: 'Eco-route computation for electric couriers to minimize vehicle travel and emissions',
        timeComplexity: 'O((V + E) log V)',
        spaceComplexity: 'O(V + E)'
      },
      {
        name: 'Doubly Linked List',
        type: 'Linear (Node-based)',
        usage: 'Live 6-stage order tracking lifecycle with O(1) bidirectional transitions and rollback',
        timeComplexity: 'O(1) advance/revert, O(1) head/tail insertion',
        spaceComplexity: 'O(N)'
      },
      {
        name: 'Stack (LIFO)',
        type: 'Linear',
        usage: 'Cart state modification Undo/Redo engine preventing accidental order errors',
        timeComplexity: 'O(1) push, O(1) pop, O(1) peek',
        spaceComplexity: 'O(N)'
      },
      {
        name: 'Binary Search Tree (BST)',
        type: 'Hierarchical / Non-Linear',
        usage: 'Multi-key menu price indexing with O(log N) budget search and range queries [min, max]',
        timeComplexity: 'O(H) search/insert, O(K + H) range query, O(N) in-order traversal',
        spaceComplexity: 'O(N)'
      },
      {
        name: 'Binary Min-Heap / Priority Queue',
        type: 'Complete Binary Tree (Array-based)',
        usage: 'Urgency queue prioritizing surplus deals expiring within 2 hours; courier matching',
        timeComplexity: 'O(log N) insert, O(log N) extractMin, O(1) peek',
        spaceComplexity: 'O(N)'
      },
      {
        name: 'FIFO Queue',
        type: 'Linear',
        usage: 'Standard chronological kitchen preparation sequencing for regular meal orders',
        timeComplexity: 'O(1) enqueue, O(1) dequeue',
        spaceComplexity: 'O(N)'
      },
      {
        name: 'Merge Sort',
        type: 'Divide and Conquer Sorting',
        usage: 'Multi-criteria restaurant sorting (Rating, Distance, Delivery Time, Price Tier)',
        timeComplexity: 'O(N log N) in all cases (best, average, worst)',
        spaceComplexity: 'O(N) auxiliary space'
      },
      {
        name: 'Binary Search vs Linear Search',
        type: 'Searching Algorithm Benchmark',
        usage: 'Comparing logarithmic O(log N) indexed search vs O(N) sequential search over restaurant catalog',
        timeComplexity: 'O(log N) vs O(N)',
        spaceComplexity: 'O(1)'
      },
      {
        name: 'Hash Map & Frequency Counter',
        type: 'Key-Value Associative',
        usage: 'Fast recommendation engine scoring dishes based on past dietary habits and budget fit',
        timeComplexity: 'O(1) average lookup/insert',
        spaceComplexity: 'O(M + N)'
      }
    ]
  });
});

// 2. Road Network Graph
router.get('/graph', (req, res) => {
  try {
    const nodes = roadNetwork.getAllNodes();
    const edges = roadNetwork.edges.map(([from, to, distance, roadName, roadType]) => ({
      from,
      to,
      distance,
      roadName,
      roadType
    }));
    const adjacencyListObj = {};
    for (const [nodeId, neighbors] of roadNetwork.adjacencyList.entries()) {
      adjacencyListObj[nodeId] = neighbors;
    }

    return res.json({
      totalNodes: nodes.length,
      totalEdges: edges.length,
      nodes,
      edges,
      adjacencyList: adjacencyListObj
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// 3. Dijkstra's Shortest Path
router.post('/dijkstra', (req, res) => {
  try {
    const { startNode = 'N1', targetNode = 'N7', trackSteps = true } = req.body;
    const result = dijkstraShortestPath(startNode, targetNode, trackSteps);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// 4. Intelligent Partner Allocation
router.post('/partner-allocation', async (req, res) => {
  try {
    const { restaurantNode = 'N2' } = req.body;
    const partners = await Users.find({ role: 'delivery_partner' });
    const result = allocateDeliveryPartner(restaurantNode, partners, true);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// 5. Merge Sort Restaurants
router.post('/sort', async (req, res) => {
  try {
    const { sortBy = 'rating', customerCoords = [77.086, 28.471] } = req.body;
    const allRestaurants = await Restaurants.find({ status: 'approved' });
    const result = mergeSortRestaurants(allRestaurants, sortBy, customerCoords, true);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// 6. Binary Search vs Linear Search
router.post('/search', async (req, res) => {
  try {
    const { query = 'GreenBowl' } = req.body;
    const allRestaurants = await Restaurants.find({ status: 'approved' });

    // Pre-sort alphabetically for binary search
    const nameSorted = [...allRestaurants].sort((a, b) =>
      (a.name || '').toLowerCase().localeCompare((b.name || '').toLowerCase())
    );

    const binaryResult = binarySearchRestaurant(nameSorted, query, true);
    const linearResult = linearSearchRestaurants(allRestaurants, query, true);

    return res.json({
      query,
      sortedArraySample: nameSorted.map(r => r.name),
      binarySearch: binaryResult,
      linearSearch: linearResult
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// 7. Order Processing Queue (FIFO vs Urgency Priority Queue)
router.get('/order-queue', async (req, res) => {
  try {
    const allOrders = await Orders.find({}, { limit: 12, sort: { createdAt: -1 } });

    const fifo = new FIFOQueue();
    const priorityQueue = new UrgencyPriorityQueue();

    for (const ord of allOrders) {
      fifo.enqueue(ord);
      priorityQueue.enqueueOrder(ord);
    }

    return res.json({
      fifoQueue: {
        totalEnqueued: fifo.size(),
        frontElement: fifo.peek(),
        orderList: fifo.toArray(),
        timeComplexity: 'O(1) Enqueue, O(1) Dequeue'
      },
      urgencyPriorityQueue: {
        totalEnqueued: priorityQueue.size(),
        highestUrgencyElement: priorityQueue.peek(),
        heapSnapshot: priorityQueue.getSnapshot(),
        timeComplexity: 'O(log N) Enqueue, O(log N) Dequeue'
      }
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// 8. Food Rescue Prioritization using Min-Heap
router.get('/surplus-heap', async (req, res) => {
  try {
    const items = await MenuItems.find({ isSurplus: true });
    const result = prioritizeSurplusDeals(items, true);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// 9. Food Recommendation using Hash Maps & Frequency Counting
router.post('/recommendations', async (req, res) => {
  try {
    const { targetBudget = 300, dietaryPreference = 'all', preferredCuisine = 'all' } = req.body;
    const items = await MenuItems.find({ isAvailable: true });
    const orders = await Orders.find({}, { limit: 20 });

    const result = generateHashRecommendations(items, orders, {}, {
      targetBudget,
      dietaryPreference,
      preferredCuisine,
      trackSteps: true
    });

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// 10. Doubly Linked List - Order Lifecycle Tracking
router.get('/linked-list', (req, res) => {
  try {
    return res.json({
      orderId: activeTrackingSession.orderId,
      size: activeTrackingSession.size,
      currentStage: activeTrackingSession.getCurrentStageSafe(),
      stages: activeTrackingSession.toArray(),
      timeComplexity: {
        advance: 'O(1)',
        revert: 'O(1)',
        search: 'O(N)'
      }
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post('/linked-list/advance', (req, res) => {
  try {
    const result = activeTrackingSession.advanceStage();
    return res.json({
      ...result,
      stages: activeTrackingSession.toArray()
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post('/linked-list/revert', (req, res) => {
  try {
    const result = activeTrackingSession.revertStage();
    return res.json({
      ...result,
      stages: activeTrackingSession.toArray()
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// 11. Stack - Cart Modification Undo/Redo Engine
router.get('/stack', (req, res) => {
  try {
    return res.json(activeCartStackSession.getSnapshot());
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post('/stack/record', (req, res) => {
  try {
    const { actionType = 'ADD_ITEM', itemPayload = { name: 'Avocado Toast', price: 180, quantity: 1 } } = req.body;
    const previousState = [...activeCartStackSession.currentCart];

    if (actionType === 'ADD_ITEM') {
      activeCartStackSession.currentCart.push(itemPayload);
    } else if (actionType === 'REMOVE_ITEM') {
      activeCartStackSession.currentCart = activeCartStackSession.currentCart.filter(i => i.name !== itemPayload.name);
    } else if (actionType === 'APPLY_COUPON') {
      activeCartStackSession.currentCart = activeCartStackSession.currentCart.map(i => ({
        ...i,
        price: Math.max(10, Math.round(i.price * 0.8))
      }));
    }

    const recorded = activeCartStackSession.recordAction(actionType, itemPayload, previousState);
    return res.json({
      actionRecorded: recorded,
      snapshot: activeCartStackSession.getSnapshot()
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post('/stack/undo', (req, res) => {
  try {
    const result = activeCartStackSession.undo();
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post('/stack/redo', (req, res) => {
  try {
    const result = activeCartStackSession.redo();
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// 12. Binary Search Tree (BST) - Multi-Key Menu Indexer
router.get('/bst', async (req, res) => {
  try {
    const items = await MenuItems.find({ isAvailable: true });
    const bst = BinarySearchTree.buildFromDishes(items);

    return res.json({
      totalDishesIndexed: bst.totalItems,
      uniquePriceNodes: bst.totalNodes,
      minPriceItem: bst.getMin(),
      maxPriceItem: bst.getMax(),
      inOrderSorted: bst.inOrderTraversal(),
      treeHierarchy: bst.getVisualTree()
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post('/bst/range', async (req, res) => {
  try {
    const { minPrice = 150, maxPrice = 300 } = req.body;
    const items = await MenuItems.find({ isAvailable: true });
    const bst = BinarySearchTree.buildFromDishes(items);
    const rangeResult = bst.rangeQuery(minPrice, maxPrice);

    return res.json(rangeResult);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post('/bst/search', async (req, res) => {
  try {
    const { price = 240 } = req.body;
    const items = await MenuItems.find({ isAvailable: true });
    const bst = BinarySearchTree.buildFromDishes(items);
    const searchResult = bst.search(price);

    return res.json(searchResult);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// 13. OOP Models & Class Hierarchy Demonstration
router.get('/oop-models', (req, res) => {
  try {
    // Instantiate Polymorphic Users
    const customer = new CustomerUser('U-201', 'Ronak Jain', 'ronak@foodloop.com', 150, 6);
    const restaurantOwner = new RestaurantOwnerUser('U-202', 'Chef Ananya', 'ananya@greenbowl.com', 'R-101', 'Organic Farm Bowls');
    const deliveryPartner = new DeliveryPartnerUser('U-203', 'Vikram Singh', 'vikram@delivery.com', 'Electric Scooter EV-450', 'N1', 4.95);
    const admin = new AdminUser('U-204', 'System Administrator', 'admin@foodloop.com');

    // Instantiate Polymorphic Food Items
    const standardDish = new RegularFoodItem('ITEM-10', 'Artisan Sourdough Pizza', 340, 'Italian', true, true);
    const rescueDeal = new SurplusFoodDeal('ITEM-11', 'Fresh Morning Bagels Batch', 220, 'Bakery', true, 55, 6, 75);

    return res.json({
      oopPrinciplesDemonstrated: {
        encapsulation: 'Private ES2022 (#) fields for internal state (id, ecoPoints, vehicleType, pricing) accessed strictly via validated getters/setters.',
        inheritance: 'Subclasses inherit common attributes from BaseUser and FoodItem base classes via "extends" and "super()".',
        polymorphism: 'Overridden methods like calculateFinalPrice(), getEcoImpactScore(), getDashboardRoute(), and getRolePermissions() behave distinctly at runtime.',
        abstraction: 'Public methods hide complex internal discount and emission offset algorithms.'
      },
      polymorphicUsers: [
        customer.toJSON(),
        restaurantOwner.toJSON(),
        deliveryPartner.toJSON(),
        admin.toJSON()
      ],
      polymorphicDishes: [
        {
          name: standardDish.getName(),
          basePrice: standardDish.getBasePrice(),
          finalPriceWithEcoPackaging: standardDish.calculateFinalPrice(true),
          ecoImpactScore: standardDish.getEcoImpactScore(),
          itemDetails: standardDish.toJSON()
        },
        {
          name: rescueDeal.getName(),
          basePrice: rescueDeal.getBasePrice(),
          discountPercent: rescueDeal.getDiscountPercent() + '% OFF',
          finalPriceWithEcoPackaging: rescueDeal.calculateFinalPrice(true),
          ecoImpactScore: rescueDeal.getEcoImpactScore(),
          itemDetails: rescueDeal.toJSON()
        }
      ]
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// 14. Innovation 1: Microbial Freshness Decay & Dynamic Markdown Pricing
router.post('/freshness-decay', (req, res) => {
  try {
    const {
      basePrice = 280,
      floorPrice = 80,
      prepTimeMinutesAgo = 75,
      maxSafeShelfLifeMinutes = 240,
      storageType = 'thermal_insulated',
      ambientTempCelsius = 32
    } = req.body;

    const result = calculateMicrobialFreshness({
      basePrice,
      floorPrice,
      prepTimeMinutesAgo,
      maxSafeShelfLifeMinutes,
      storageType,
      ambientTempCelsius
    });
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// 15. Innovation 2: Zero-Hunger Emergency Dispatch (Bipartite Matching & DSU)
router.post('/zero-hunger-dispatch', (req, res) => {
  try {
    const { donors = [], shelters = [] } = req.body;
    const result = matchSurplusToShelters(donors, shelters);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// 16. Innovation 3: Multi-Modal Drone-EV Relay Route Optimizer
router.post('/multimodal-relay', (req, res) => {
  try {
    const { sourceNode = 'N1', destinationNode = 'N7', totalDistanceRoadKm = 5.6 } = req.body;
    const result = calculateMultimodalRelayRoute(sourceNode, destinationNode, totalDistanceRoadKm);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// 17. Innovation 4: Nutrient-Carbon Pareto Frontier Meal Synthesizer (DP Knapsack)
router.post('/eco-knapsack', async (req, res) => {
  try {
    const { targetBudget = 320, maxCarbonKg = 1.2 } = req.body;
    const items = await MenuItems.find({ isAvailable: true });
    
    // Convert menu items to knapsack candidates
    const candidates = items.slice(0, 15).map((m, idx) => ({
      id: m._id || 'M' + idx,
      name: m.name,
      price: m.finalPrice || m.price || 150,
      protein: m.nutrition?.protein || Math.round(8 + (idx * 3) % 18),
      calories: m.nutrition?.calories || Math.round(250 + (idx * 45) % 350),
      carbonKg: +(0.2 + (idx * 0.08) % 0.6).toFixed(2),
      isSurplus: Boolean(m.isSurplus)
    }));

    const result = solveEcoNutrientKnapsack(candidates, targetBudget, maxCarbonKg);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
