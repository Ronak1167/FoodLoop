import { MinPriorityQueue } from './priorityQueue.js';

/**
 * Order Management Data Structures:
 * 1. FIFO Queue: First-In-First-Out for standard order sequencing (Time: O(1) enqueue/dequeue)
 * 2. Urgency Priority Queue: Min-Heap prioritizing time-critical orders (e.g. Food Rescue surplus
 *    deals expiring within 2 hours or urgent group orders) (Time: O(log N))
 */

export class FIFOQueue {
  constructor() {
    this.items = [];
  }

  enqueue(order) {
    const queueItem = {
      orderId: order._id || order.id || order.orderNumber,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      restaurantName: order.restaurantName,
      totalAmount: order.totalAmount,
      itemsCount: order.items?.length || 1,
      enqueuedAt: new Date().toISOString()
    };
    this.items.push(queueItem);
    return queueItem;
  }

  dequeue() {
    return this.items.length > 0 ? this.items.shift() : null;
  }

  peek() {
    return this.items.length > 0 ? this.items[0] : null;
  }

  size() {
    return this.items.length;
  }

  isEmpty() {
    return this.items.length === 0;
  }

  toArray() {
    return [...this.items];
  }
}

export class UrgencyPriorityQueue {
  constructor() {
    this.minHeap = new MinPriorityQueue();
  }

  /**
   * Enqueues an order with computed Urgency Metric.
   * Lower urgency score = processed first in Min-Heap.
   * Urgency factors:
   *   - Surplus food rescue deals near deadline: deadline minutes remaining (e.g., 45 mins -> high urgency)
   *   - Standard orders: default 180 mins
   *   - Group orders: -30 mins priority boost
   */
  enqueueOrder(order) {
    let urgencyScore = 180; // Default 3 hours buffer

    const hasSurplus = (order.items || []).some(i => i.isSurplus);
    if (hasSurplus) {
      urgencyScore = 60; // 1 hour priority
    }
    if (order.isGroupOrder) {
      urgencyScore -= 20; // Group order boost
    }

    const orderPayload = {
      orderId: order._id || order.id || order.orderNumber,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      restaurantName: order.restaurantName,
      isSurplus: hasSurplus,
      isGroupOrder: Boolean(order.isGroupOrder),
      totalAmount: order.totalAmount,
      urgencyScore,
      priorityLevel: urgencyScore <= 60 ? 'HIGH_URGENCY (Food Rescue)' : 'STANDARD'
    };

    this.minHeap.insert(orderPayload, urgencyScore);
    return orderPayload;
  }

  dequeueUrgentOrder() {
    const extracted = this.minHeap.extractMin();
    return extracted ? extracted.element : null;
  }

  peek() {
    const p = this.minHeap.peek();
    return p ? p.element : null;
  }

  size() {
    return this.minHeap.size();
  }

  getSnapshot() {
    return this.minHeap.getHeapSnapshot();
  }
}
