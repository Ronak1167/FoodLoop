/**
 * Stack (LIFO - Last-In, First-Out) Implementation.
 * 
 * Used for:
 * 1. Cart Modification Undo/Redo Engine: Allows customers to seamlessly rollback 
 *    accidental deletions, quantity mistakes, or coupon applications in O(1) time.
 * 2. Navigation Backtracking Stack: Tracks page transitions and state history.
 * 
 * Time Complexities:
 *   - Push: O(1)
 *   - Pop: O(1)
 *   - Peek: O(1)
 *   - IsEmpty / Size: O(1)
 * Space Complexity: O(N) auxiliary space
 */

export class Stack {
  #items;
  #maxCapacity;

  constructor(maxCapacity = 100) {
    this.#items = [];
    this.#maxCapacity = maxCapacity;
  }

  push(element) {
    if (this.#items.length >= this.#maxCapacity) {
      // Evict oldest base element if exceeding capacity
      this.#items.shift();
    }
    this.#items.push(element);
    return true;
  }

  pop() {
    if (this.isEmpty()) return null;
    return this.#items.pop();
  }

  peek() {
    if (this.isEmpty()) return null;
    return this.#items[this.#items.length - 1];
  }

  isEmpty() {
    return this.#items.length === 0;
  }

  size() {
    return this.#items.length;
  }

  clear() {
    this.#items = [];
  }

  toArray() {
    // Return array with Top of Stack at index 0 for display
    return [...this.#items].reverse();
  }
}

export class CartActionStack {
  constructor(initialCartState = []) {
    this.undoStack = new Stack(50);
    this.redoStack = new Stack(50);
    this.currentCart = [...initialCartState];
    this.actionHistory = [];
  }

  /**
   * Records a user action on the cart (ADD, REMOVE, UPDATE_QTY, APPLY_ECO_DISCOUNT)
   * Time Complexity: O(1)
   */
  recordAction(actionType, itemPayload, previousState = null) {
    const action = {
      id: 'ACT-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      actionType,
      itemPayload: { ...itemPayload },
      previousCartSnapshot: previousState ? JSON.parse(JSON.stringify(previousState)) : JSON.parse(JSON.stringify(this.currentCart)),
      timestamp: new Date().toISOString()
    };

    this.undoStack.push(action);
    // Any new action clears the redo stack (standard undo/redo semantics)
    this.redoStack.clear();

    this.actionHistory.push({
      type: actionType,
      itemId: itemPayload.id || itemPayload._id || itemPayload.name,
      itemName: itemPayload.name,
      timestamp: action.timestamp
    });

    return action;
  }

  /**
   * Executes an UNDO operation by popping from the Undo Stack and restoring previous state.
   * Time Complexity: O(1)
   */
  undo() {
    if (this.undoStack.isEmpty()) {
      return {
        success: false,
        message: 'Undo stack is empty: No cart actions to rollback.',
        cart: this.currentCart
      };
    }

    const lastAction = this.undoStack.pop();

    // Push current cart state to Redo Stack for forward recovery
    this.redoStack.push({
      ...lastAction,
      redoCartSnapshot: JSON.parse(JSON.stringify(this.currentCart))
    });

    // Revert current cart to previous snapshot
    this.currentCart = JSON.parse(JSON.stringify(lastAction.previousCartSnapshot));

    return {
      success: true,
      message: `Rolled back action: ${lastAction.actionType} on "${lastAction.itemPayload.name || 'item'}"`,
      revertedAction: lastAction,
      cart: this.currentCart,
      undoStackSize: this.undoStack.size(),
      redoStackSize: this.redoStack.size()
    };
  }

  /**
   * Executes a REDO operation by popping from the Redo Stack and re-applying state.
   * Time Complexity: O(1)
   */
  redo() {
    if (this.redoStack.isEmpty()) {
      return {
        success: false,
        message: 'Redo stack is empty: No rolled-back actions to re-apply.',
        cart: this.currentCart
      };
    }

    const nextAction = this.redoStack.pop();

    // Push back to Undo Stack
    this.undoStack.push(nextAction);

    // Apply the redo snapshot
    this.currentCart = JSON.parse(JSON.stringify(nextAction.redoCartSnapshot));

    return {
      success: true,
      message: `Re-applied action: ${nextAction.actionType} on "${nextAction.itemPayload.name || 'item'}"`,
      reappliedAction: nextAction,
      cart: this.currentCart,
      undoStackSize: this.undoStack.size(),
      redoStackSize: this.redoStack.size()
    };
  }

  getSnapshot() {
    return {
      currentCart: this.currentCart,
      undoStack: this.undoStack.toArray(),
      redoStack: this.redoStack.toArray(),
      undoSize: this.undoStack.size(),
      redoSize: this.redoStack.size(),
      topOfUndo: this.undoStack.peek(),
      topOfRedo: this.redoStack.peek()
    };
  }
}

