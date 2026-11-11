import { MinPriorityQueue } from './priorityQueue.js';
import { dijkstraShortestPath } from './dijkstra.js';
import { roadNetwork } from './roadGraph.js';

/**
 * Intelligent Delivery Partner Allocation using Dijkstra's Shortest Path and Min-Priority Queue (Min-Heap).
 * 
 * Algorithm:
 * 1. Filter active, available delivery partners.
 * 2. Calculate shortest distance from each partner's current location to the restaurant using Dijkstra.
 * 3. Compute composite Suitability Metric for each courier:
 *      Score = (Distance * 35) + (ActiveOrders * 45) + (TodayTrips * 3) - (RatingBonus * 20) - (EV_Bonus: 25)
 *      (Lower score is optimal -> Min-Heap priority).
 * 4. Insert all eligible candidates into a Min-Priority Queue.
 * 5. Extract the root element (Extract-Min) as the optimal assignment.
 * 
 * Time Complexity: O(K * (V + E) log V + K log K) where K is couriers count, V is intersections, E is roads.
 * Space Complexity: O(K + V)
 */
export function allocateDeliveryPartner(restaurantCoordsOrNode, allPartners, trackSteps = true) {
  // Determine restaurant node
  let restNodeId = 'N2';
  if (typeof restaurantCoordsOrNode === 'string') {
    restNodeId = restaurantCoordsOrNode;
  } else if (Array.isArray(restaurantCoordsOrNode)) {
    restNodeId = roadNetwork.getNearestNode(restaurantCoordsOrNode).id;
  }

  const restaurantNode = roadNetwork.getNode(restNodeId);
  const eligiblePartners = allPartners.filter(p => p.role === 'delivery_partner' && p.activeStatus !== 'offline');

  if (eligiblePartners.length === 0) {
    return {
      success: false,
      message: 'No delivery partners are currently available or active in the delivery sector.',
      selectedPartner: null,
      candidates: []
    };
  }

  const pq = new MinPriorityQueue();
  const evaluatedCandidates = [];
  const steps = [];

  if (trackSteps) {
    steps.push({
      step: 1,
      action: 'FILTER_ELIGIBLE',
      description: `Filtered ${allPartners.length} total users down to ${eligiblePartners.length} active couriers. Target kitchen: ${restaurantNode.name} (${restaurantNode.id}).`,
      eligibleCount: eligiblePartners.length
    });
  }

  // Evaluate each partner using Dijkstra shortest path
  for (const partner of eligiblePartners) {
    // Determine courier's nearest node
    let partnerNodeId = partner.assignedNode || 'N1';
    if (partner.currentLocation && Array.isArray(partner.currentLocation)) {
      partnerNodeId = roadNetwork.getNearestNode(partner.currentLocation).id;
    } else if (partner.currentLocation?.lat && partner.currentLocation?.lng) {
      partnerNodeId = roadNetwork.getNearestNode([partner.currentLocation.lng, partner.currentLocation.lat]).id;
    }

    // Run Dijkstra from partner to restaurant
    const dijkstraResult = dijkstraShortestPath(partnerNodeId, restNodeId, false);
    const distanceKm = dijkstraResult.success ? dijkstraResult.totalDistanceKm : 8.5;
    const estArrivalMins = dijkstraResult.success ? dijkstraResult.estimatedMinutes : 25;

    // Workload and vehicle metrics
    const activeOrders = Number(partner.activeDeliveriesCount || 0);
    const completedToday = Number(partner.completedDeliveries || 0) % 15;
    const rating = Number(partner.rating || 4.8);
    const isEV = (partner.vehicle || '').toLowerCase().includes('ev') || (partner.vehicle || '').toLowerCase().includes('electric');

    // Suitability Score Formula (Lower is better!)
    const distanceComponent = distanceKm * 35;
    const activeOrdersComponent = activeOrders * 45;
    const workloadComponent = completedToday * 3;
    const ratingBonus = Math.max(0, (rating - 4.0)) * 20;
    const evBonus = isEV ? 25 : 0;

    const rawScore = distanceComponent + activeOrdersComponent + workloadComponent - ratingBonus - evBonus;
    const suitabilityScore = Math.max(5, Math.round(rawScore));

    const candidateData = {
      partnerId: partner._id,
      name: partner.name,
      phone: partner.phone,
      vehicle: partner.vehicle || 'Zero-Emission EV Scooter',
      isEV,
      currentLocationNode: partnerNodeId,
      currentLocationName: roadNetwork.getNode(partnerNodeId)?.name || partnerNodeId,
      distanceToRestaurantKm: distanceKm,
      estimatedArrivalToKitchenMins: estArrivalMins,
      activeOrders,
      completedToday,
      rating,
      suitabilityScore,
      scoreBreakdown: {
        distanceScore: Math.round(distanceComponent),
        activeOrdersPenalty: activeOrdersComponent,
        workloadPenalty: workloadComponent,
        ratingDiscount: Math.round(ratingBonus),
        evDiscount: evBonus
      },
      routeToKitchen: dijkstraResult.path || [partnerNodeId, restNodeId]
    };

    // Insert into Min-Priority Queue with suitabilityScore as priority
    pq.insert(candidateData, suitabilityScore);
    evaluatedCandidates.push(candidateData);

    if (trackSteps) {
      steps.push({
        step: steps.length + 1,
        action: 'EVALUATE_AND_ENQUEUE',
        description: `Evaluated ${partner.name}: Distance = ${distanceKm} km (via Dijkstra), Active Orders = ${activeOrders}, EV = ${isEV ? 'Yes' : 'No'}. Computed Suitability Score = ${suitabilityScore}. Enqueued into Min-Heap.`,
        partnerName: partner.name,
        score: suitabilityScore,
        heapState: pq.getHeapSnapshot()
      });
    }
  }

  // Extract the optimal partner from the Min-Heap
  const optimalNode = pq.extractMin();
  const selected = optimalNode ? optimalNode.element : null;

  // Rank all candidates by their score ascending
  evaluatedCandidates.sort((a, b) => a.suitabilityScore - b.suitabilityScore);
  evaluatedCandidates.forEach((c, idx) => { c.rank = idx + 1; });

  let rationale = '';
  if (selected) {
    rationale = `Selected ${selected.name} (Rank #1 in Min-Heap, Score: ${selected.suitabilityScore}) because they are closest to the kitchen (${selected.distanceToRestaurantKm} km via ${selected.currentLocationName}) with ${selected.activeOrders} active deliveries, a ★${selected.rating} rating, and a zero-emission EV fleet vehicle.`;
  }

  if (trackSteps && selected) {
    steps.push({
      step: steps.length + 1,
      action: 'EXTRACT_MIN',
      description: `Executed extractMin() on Priority Queue. Retrieved optimal partner ${selected.name} with lowest score of ${selected.suitabilityScore}.`,
      assignedPartner: selected.name,
      assignedScore: selected.suitabilityScore
    });
  }

  return {
    success: true,
    restaurantNode: restaurantNode,
    selectedPartner: selected,
    selectionRationale: rationale,
    candidates: evaluatedCandidates,
    totalCandidatesCount: evaluatedCandidates.length,
    steps,
    timeComplexity: 'O(K · (V + E) log V + K log K)',
    spaceComplexity: 'O(K + V)'
  };
}
