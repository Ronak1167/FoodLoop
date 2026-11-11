/**
 * Binary Search Tree (BST) Implementation for Multi-Key Menu Indexing.
 * 
 * In FoodLoop, customers frequently filter meals by strict budget constraints:
 * e.g., "Find all dishes priced between ₹120 and ₹280".
 * 
 * By organizing menu items into a Binary Search Tree keyed on item price,
 * range queries and min/max lookups run in O(H) where H is tree height
 * (O(log N) for balanced trees), drastically outperforming linear O(N) array scans.
 * 
 * In-Order Traversal yields a naturally sorted list in O(N) without
 * calling an external sorting subroutine.
 * 
 * Complexities:
 *   - Insertion: O(H) average O(log N), worst O(N)
 *   - Search by exact price: O(H)
 *   - Range Query [minPrice, maxPrice]: O(K + H) where K is number of matched items
 *   - In-order traversal: O(N)
 *   - Space Complexity: O(N)
 */

export class BSTNode {
  constructor(key, data = null) {
    this.key = Number(key);            // Numerical index (e.g., price in INR)
    this.items = data ? [data] : [];  // Supports multiple dishes sharing identical price points
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

export class BinarySearchTree {
  constructor() {
    this.root = null;
    this.totalNodes = 0;
    this.totalItems = 0;
  }

  /**
   * Inserts a dish into the BST keyed by price.
   * If a node with the exact price already exists, appends the dish to that node's items array.
   */
  insert(price, dish) {
    const key = Number(price);
    const newNode = new BSTNode(key, dish);

    if (!this.root) {
      this.root = newNode;
      this.totalNodes = 1;
      this.totalItems = 1;
      return newNode;
    }

    let curr = this.root;
    while (true) {
      if (key === curr.key) {
        // Price collision: duplicate price point
        curr.items.push(dish);
        this.totalItems++;
        return curr;
      } else if (key < curr.key) {
        if (!curr.left) {
          curr.left = newNode;
          this.totalNodes++;
          this.totalItems++;
          return newNode;
        }
        curr = curr.left;
      } else {
        if (!curr.right) {
          curr.right = newNode;
          this.totalNodes++;
          this.totalItems++;
          return newNode;
        }
        curr = curr.right;
      }
    }
  }

  /**
   * Searches for exact price point.
   * Time Complexity: O(H)
   */
  search(price) {
    const key = Number(price);
    let curr = this.root;
    let comparisons = 0;

    while (curr) {
      comparisons++;
      if (curr.key === key) {
        return { found: true, key: curr.key, items: curr.items, comparisons };
      }
      if (key < curr.key) {
        curr = curr.left;
      } else {
        curr = curr.right;
      }
    }
    return { found: false, key, items: [], comparisons };
  }

  /**
   * Range Query: Efficiently retrieves all dishes with price between minPrice and maxPrice.
   * Prunes subtrees that lie strictly outside the range.
   * Time Complexity: O(K + H)
   */
  rangeQuery(minPrice, maxPrice) {
    const min = Number(minPrice);
    const max = Number(maxPrice);
    const result = [];
    const visitedNodes = [];

    function traverse(node) {
      if (!node) return;

      visitedNodes.push(node.key);

      // If current node's price > min, explore left subtree
      if (node.key > min) {
        traverse(node.left);
      }

      // If current node is within [min, max], collect its dishes
      if (node.key >= min && node.key <= max) {
        for (const item of node.items) {
          result.push({
            price: node.key,
            ...item
          });
        }
      }

      // If current node's price < max, explore right subtree
      if (node.key < max) {
        traverse(node.right);
      }
    }

    traverse(this.root);

    return {
      minPrice: min,
      maxPrice: max,
      totalMatched: result.length,
      nodesVisitedCount: visitedNodes.length,
      nodesVisited: visitedNodes,
      items: result
    };
  }

  /**
   * In-Order Traversal: Visits left, root, right.
   * Yields a sorted ascending list of all dishes.
   * Time Complexity: O(N)
   */
  inOrderTraversal() {
    const sorted = [];
    function inorder(node) {
      if (!node) return;
      inorder(node.left);
      for (const item of node.items) {
        sorted.push({
          price: node.key,
          ...item
        });
      }
      inorder(node.right);
    }
    inorder(this.root);
    return sorted;
  }

  /**
   * Finds the minimum price node in the BST.
   * Time Complexity: O(H)
   */
  getMin() {
    if (!this.root) return null;
    let curr = this.root;
    while (curr.left) {
      curr = curr.left;
    }
    return { price: curr.key, items: curr.items };
  }

  /**
   * Finds the maximum price node in the BST.
   * Time Complexity: O(H)
   */
  getMax() {
    if (!this.root) return null;
    let curr = this.root;
    while (curr.right) {
      curr = curr.right;
    }
    return { price: curr.key, items: curr.items };
  }

  /**
   * Generates a hierarchical JSON tree structure for visual frontend rendering.
   */
  getVisualTree() {
    function serializeNode(node, depth = 0) {
      if (!node) return null;
      return {
        key: node.key,
        itemCount: node.items.length,
        sampleName: node.items[0]?.name || 'Dish',
        depth,
        left: serializeNode(node.left, depth + 1),
        right: serializeNode(node.right, depth + 1)
      };
    }
    return serializeNode(this.root);
  }

  /**
   * Static factory helper to populate BST from a list of dishes.
   */
  static buildFromDishes(dishes = []) {
    const bst = new BinarySearchTree();
    for (const dish of dishes) {
      const price = dish.finalPrice || dish.price || 0;
      bst.insert(price, dish);
    }
    return bst;
  }
}

