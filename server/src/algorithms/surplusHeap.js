import { MinPriorityQueue } from './priorityQueue.js';

/**
 * Min-Heap for Food Rescue Prioritization based on collection deadlines (SDG 12 Target).
 * Time Complexity:
 *   - Insert surplus deal: O(log N)
 *   - Extract most urgent deal: O(log N)
 *   - Peek most urgent: O(1)
 */
export function prioritizeSurplusDeals(menuItems, trackSteps = true) {
  const minHeap = new MinPriorityQueue();
  const now = new Date();
  const steps = [];
  const validDeals = [];

  // Filter only active, in-stock surplus items
  const surplusCandidates = menuItems.filter(item => {
    if (!item.isSurplus || !item.isAvailable) return false;
    if (Number(item.surplusQuantity) <= 0) return false;
    const deadline = item.surplusDeadline ? new Date(item.surplusDeadline) : null;
    return !deadline || deadline > now;
  });

  if (trackSteps) {
    steps.push({
      step: 1,
      action: 'FILTER_ELIGIBLE_SURPLUS',
      description: `Filtered out expired and out-of-stock listings. ${surplusCandidates.length} eligible Food Rescue deals found.`,
      eligibleCount: surplusCandidates.length
    });
  }

  // Insert each deal into Min-Heap keyed by minutes remaining
  surplusCandidates.forEach((deal, idx) => {
    const deadline = deal.surplusDeadline ? new Date(deal.surplusDeadline) : new Date(Date.now() + 4 * 3600 * 1000);
    const minutesRemaining = Math.max(1, Math.round((deadline - now) / (1000 * 60)));

    const dealPayload = {
      ...deal,
      minutesRemaining,
      hoursRemaining: (minutesRemaining / 60).toFixed(1),
      urgencyLevel: minutesRemaining <= 120 ? 'CRITICAL_URGENCY' : 'MODERATE'
    };

    minHeap.insert(dealPayload, minutesRemaining);
    validDeals.push(dealPayload);

    if (trackSteps) {
      steps.push({
        step: steps.length + 1,
        action: 'HEAP_INSERT',
        description: `Inserted "${deal.name}": Deadline in ${dealPayload.hoursRemaining} hrs (${minutesRemaining} mins). Enqueued with priority = ${minutesRemaining}.`,
        insertedItem: deal.name,
        priorityMinutes: minutesRemaining,
        heapSnapshot: minHeap.getHeapSnapshot()
      });
    }
  });

  // Extract all deals in priority order (earliest deadline first)
  const prioritizedList = [];
  const extractionSteps = [];

  // Clone heap for non-destructive extraction
  const tempHeap = new MinPriorityQueue();
  minHeap.heap.forEach(node => tempHeap.insert(node.element, node.priority));

  while (!tempHeap.isEmpty()) {
    const extracted = tempHeap.extractMin();
    prioritizedList.push(extracted.element);
  }

  return {
    totalActiveDeals: prioritizedList.length,
    mostUrgentDeal: prioritizedList[0] || null,
    prioritizedDeals: prioritizedList,
    heapSnapshot: minHeap.getHeapSnapshot(),
    steps,
    timeComplexity: 'O(N log N) for heap build & extraction',
    spaceComplexity: 'O(N)'
  };
}
