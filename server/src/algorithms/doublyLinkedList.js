/**
 * Doubly Linked List Implementation for Order Lifecycle Tracking.
 * 
 * In FoodLoop, an order transitions through discrete sequential stages:
 * [Order Placed] <-> [Restaurant Confirmed] <-> [Kitchen Preparing] <-> 
 * [Order Picked Up] <-> [Out for Delivery] <-> [Order Delivered]
 * 
 * Each stage node holds references to both next and previous stages,
 * enabling O(1) forward transitions, backward rollback/inspection,
 * and O(1) stage status queries.
 * 
 * Time Complexities:
 *   - Insertion at head / tail: O(1)
 *   - Current stage forward/backward navigation: O(1)
 *   - Deletion of given node: O(1)
 *   - Search by stage key: O(N)
 * Space Complexity: O(N)
 */

export class OrderStageNode {
  constructor(stageKey, title, description, timestamp = null, metadata = {}) {
    this.stageKey = stageKey;       // e.g., 'PLACED', 'CONFIRMED', 'PREPARING'
    this.title = title;             // e.g., 'Order Placed'
    this.description = description; // e.g., 'Customer verified payment'
    this.timestamp = timestamp || new Date().toISOString();
    this.isCompleted = false;
    this.isCurrent = false;
    this.metadata = metadata;       // courier ID, kitchen notes, etc.
    this.prev = null;
    this.next = null;
  }

  toSafeObject() {
    return {
      stageKey: this.stageKey,
      title: this.title,
      description: this.description,
      timestamp: this.timestamp,
      isCompleted: this.isCompleted,
      isCurrent: this.isCurrent,
      metadata: this.metadata,
      hasPrev: this.prev !== null,
      hasNext: this.next !== null,
      prevStageKey: this.prev ? this.prev.stageKey : null,
      nextStageKey: this.next ? this.next.stageKey : null
    };
  }
}

export class OrderTrackingLinkedList {
  constructor(orderId = null) {
    this.orderId = orderId;
    this.head = null;
    this.tail = null;
    this.currentNode = null;
    this.size = 0;
  }

  /**
   * Appends a new stage node to the end of the doubly linked list.
   * Time Complexity: O(1)
   */
  appendStage(stageKey, title, description, metadata = {}) {
    const newNode = new OrderStageNode(stageKey, title, description, new Date().toISOString(), metadata);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      this.currentNode = newNode;
      newNode.isCurrent = true;
      newNode.isCompleted = true;
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }
    this.size++;
    return newNode;
  }

  /**
   * Advances the order to the next stage in the lifecycle.
   * Time Complexity: O(1)
   */
  advanceStage() {
    if (!this.currentNode || !this.currentNode.next) {
      return { 
        success: false, 
        message: 'Already at the terminal stage (Order Delivered).', 
        current: this.currentNode ? this.currentNode.toSafeObject() : null 
      };
    }

    this.currentNode.isCurrent = false;
    this.currentNode.isCompleted = true;
    this.currentNode = this.currentNode.next;
    this.currentNode.isCurrent = true;
    this.currentNode.isCompleted = true;
    this.currentNode.timestamp = new Date().toISOString();

    return {
      success: true,
      message: `Order advanced to: ${this.currentNode.title}`,
      current: this.currentNode.toSafeObject()
    };
  }

  /**
   * Moves back to the previous stage (for audit, inspection, or rollback).
   * Time Complexity: O(1)
   */
  revertStage() {
    if (!this.currentNode || !this.currentNode.prev) {
      return { 
        success: false, 
        message: 'Already at the initial stage (Order Placed).', 
        current: this.currentNode ? this.currentNode.toSafeObject() : null 
      };
    }

    this.currentNode.isCurrent = false;
    this.currentNode.isCompleted = false;
    this.currentNode = this.currentNode.prev;
    this.currentNode.isCurrent = true;

    return {
      success: true,
      message: `Order reverted to previous stage: ${this.currentNode.title}`,
      current: this.currentNode.toSafeObject()
    };
  }

  /**
   * Finds a stage by its stage key.
   * Time Complexity: O(N)
   */
  findStage(stageKey) {
    let curr = this.head;
    while (curr) {
      if (curr.stageKey.toUpperCase() === stageKey.toUpperCase()) {
        return curr;
      }
      curr = curr.next;
    }
    return null;
  }

  /**
   * Returns current active stage node (with prev/next references).
   * Time Complexity: O(1)
   */
  getCurrentStage() {
    return this.currentNode;
  }

  /**
   * Returns current active stage as safe JSON-serializable object.
   * Time Complexity: O(1)
   */
  getCurrentStageSafe() {
    return this.currentNode ? this.currentNode.toSafeObject() : null;
  }

  /**
   * Converts the Doubly Linked List to an array representation for JSON serialization & UI rendering.
   * Time Complexity: O(N)
   */
  toArray() {
    const list = [];
    let curr = this.head;
    let idx = 0;
    while (curr) {
      list.push({
        index: idx,
        stageKey: curr.stageKey,
        title: curr.title,
        description: curr.description,
        timestamp: curr.timestamp,
        isCompleted: curr.isCompleted,
        isCurrent: curr.isCurrent,
        metadata: curr.metadata,
        hasPrev: curr.prev !== null,
        hasNext: curr.next !== null
      });
      curr = curr.next;
      idx++;
    }
    return list;
  }

  /**
   * Factory method: Creates the standard 6-stage FoodLoop delivery lifecycle.
   */
  static createDefaultLifecycle(orderId = 'FL-1001') {
    const tracking = new OrderTrackingLinkedList(orderId);
    tracking.appendStage('PLACED', 'Order Placed', 'Payment confirmed & order received by FoodLoop platform.');
    tracking.appendStage('CONFIRMED', 'Restaurant Confirmed', 'Kitchen verified inventory and accepted order.');
    tracking.appendStage('PREPARING', 'Kitchen Preparing', 'Chef is cooking with zero-waste portion control.');
    tracking.appendStage('PICKED_UP', 'Courier Picked Up', 'Delivery partner collected insulated eco-package.');
    tracking.appendStage('OUT_FOR_DELIVERY', 'Out for Delivery', 'EV Courier navigating shortest road graph route.');
    tracking.appendStage('DELIVERED', 'Delivered Safely', 'Meal handed over. Eco-points added to account.');

    // By default, stage 1 is placed
    return tracking;
  }
}
