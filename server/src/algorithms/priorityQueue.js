/**
 * Generic Min-Priority Queue implementation using a Binary Min-Heap.
 * Time Complexity:
 *   - Insertion: O(log N)
 *   - Extract-Min: O(log N)
 *   - Peek: O(1)
 * Space Complexity: O(N)
 */
export class MinPriorityQueue {
  constructor() {
    this.heap = [];
  }

  parent(i) {
    return Math.floor((i - 1) / 2);
  }

  leftChild(i) {
    return 2 * i + 1;
  }

  rightChild(i) {
    return 2 * i + 2;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  size() {
    return this.heap.length;
  }

  peek() {
    return this.isEmpty() ? null : this.heap[0];
  }

  insert(element, priority) {
    const node = { element, priority, id: element?.id || element?._id || element?.node || String(element) };
    this.heap.push(node);
    this.bubbleUp(this.heap.length - 1);
  }

  enqueue(element, priority) {
    this.insert(element, priority);
  }

  bubbleUp(index) {
    let current = index;
    while (current > 0) {
      const p = this.parent(current);
      if (this.heap[current].priority < this.heap[p].priority) {
        // Swap
        const temp = this.heap[current];
        this.heap[current] = this.heap[p];
        this.heap[p] = temp;
        current = p;
      } else {
        break;
      }
    }
  }

  extractMin() {
    if (this.isEmpty()) return null;
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }
    return min;
  }

  dequeue() {
    return this.extractMin();
  }

  sinkDown(index) {
    let smallest = index;
    const left = this.leftChild(index);
    const right = this.rightChild(index);
    const length = this.heap.length;

    if (left < length && this.heap[left].priority < this.heap[smallest].priority) {
      smallest = left;
    }

    if (right < length && this.heap[right].priority < this.heap[smallest].priority) {
      smallest = right;
    }

    if (smallest !== index) {
      const temp = this.heap[index];
      this.heap[index] = this.heap[smallest];
      this.heap[smallest] = temp;
      this.sinkDown(smallest);
    }
  }

  getHeapSnapshot() {
    return this.heap.map(node => ({
      priority: node.priority,
      name: node.element?.name || node.element?.node || node.element?.orderNumber || String(node.element),
      details: node.element
    }));
  }
}

/**
 * Generic Max-Priority Queue implementation using a Binary Max-Heap.
 */
export class MaxPriorityQueue {
  constructor() {
    this.heap = [];
  }

  parent(i) { return Math.floor((i - 1) / 2); }
  leftChild(i) { return 2 * i + 1; }
  rightChild(i) { return 2 * i + 2; }
  isEmpty() { return this.heap.length === 0; }
  size() { return this.heap.length; }
  peek() { return this.isEmpty() ? null : this.heap[0]; }

  insert(element, priority) {
    const node = { element, priority };
    this.heap.push(node);
    this.bubbleUp(this.heap.length - 1);
  }

  bubbleUp(index) {
    let current = index;
    while (current > 0) {
      const p = this.parent(current);
      if (this.heap[current].priority > this.heap[p].priority) {
        const temp = this.heap[current];
        this.heap[current] = this.heap[p];
        this.heap[p] = temp;
        current = p;
      } else {
        break;
      }
    }
  }

  extractMax() {
    if (this.isEmpty()) return null;
    const max = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }
    return max;
  }

  sinkDown(index) {
    let largest = index;
    const left = this.leftChild(index);
    const right = this.rightChild(index);
    const length = this.heap.length;

    if (left < length && this.heap[left].priority > this.heap[largest].priority) {
      largest = left;
    }
    if (right < length && this.heap[right].priority > this.heap[largest].priority) {
      largest = right;
    }
    if (largest !== index) {
      const temp = this.heap[index];
      this.heap[index] = this.heap[largest];
      this.heap[largest] = temp;
      this.sinkDown(largest);
    }
  }
}
