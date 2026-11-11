# FoodLoop – Data Structures Lab Viva Preparation Guide
## Top 20 Viva Questions & Model Answers for JIIT 2nd Year CSE

**Batch**: B2  
**Faculty Evaluators**: Dr. Sherry Garg & Dr. Lalita Mishra  
**Group Members**: Pragya Ahlawat (121), Ronak Jain (128), Rishabh Tyagi (130), Shobhit Khatana (144)

---

### Q1: Why did you choose an Adjacency List over an Adjacency Matrix for your road network graph?
**Answer**:  
The city road network is a **sparse graph** where $|V| = 16$ intersections and $|E| = 24$ roads.  
- An Adjacency Matrix would require $O(V^2) = 16^2 = 256$ memory cells, where most cells are zeroes ($0$).  
- An Adjacency List consumes only $O(V + E) = 16 + 24 = 40$ entries, significantly reducing memory footprint and allowing neighbor iteration in $O(\text{deg}(V))$ rather than scanning all $V$ columns.

---

### Q2: What is the time complexity of Dijkstra's algorithm in your project, and why?
**Answer**:  
Our Dijkstra algorithm runs in **$O((V + E) \log V)$** time.  
- We use a custom **Binary Min-Heap (Priority Queue)** rather than an unsorted array.  
- Inserting/extracting minimum distance vertices takes $O(\log V)$.  
- Each of the $E$ edges is relaxed at most once, and decrease-key / insertion takes $O(\log V)$.  
- If we had used an unsorted array, the complexity would have degraded to $O(V^2)$.

---

### Q3: Why is a Doubly Linked List better than an Array for the live Order Tracking lifecycle?
**Answer**:  
In an order delivery lifecycle ($Placed \leftrightarrow Confirmed \leftrightarrow Preparing \leftrightarrow Picked Up \leftrightarrow Delivered$):  
1. **$O(1)$ Transitions**: Advancing or reverting stage pointers (`curr = curr.next` or `curr = curr.prev`) takes constant $O(1)$ time with zero index arithmetic or shifting.  
2. **Audit Rollback**: A doubly linked list allows historical rollback and stage inspection in both directions without copying arrays or performing $O(N)$ lookups.  
3. **Dynamic Node Insertion**: Intermediate checkpoints (e.g. *Quality Inspection Passed* or *Delayed by Rain*) can be inserted between existing stages in $O(1)$ time given the pointer reference.

---

### Q4: How does your Stack ensure $O(1)$ Undo/Redo for the shopping cart?
**Answer**:  
We implemented a **Twin Stack Architecture** (`undoStack` and `redoStack`):  
- When an action occurs (e.g., adding a dish), a lightweight action snapshot is pushed onto the `undoStack` ($O(1)$).  
- When the user clicks **Undo**, the top element is popped from `undoStack`, pushed onto `redoStack`, and the prior cart state is restored ($O(1)$).  
- When the user clicks **Redo**, the top element is popped from `redoStack`, pushed back to `undoStack`, and the modification is re-applied ($O(1)$).  
- Any new modification clears `redoStack` to prevent non-linear branching.

---

### Q5: How does a Binary Search Tree (BST) improve menu price filtering over a simple array filter?
**Answer**:  
In a standard array, searching for dishes within a budget $[min, max]$ requires a full linear scan of all $N$ dishes ($O(N)$ time).  
In our BST:  
- Nodes are organized such that $\text{left.price} < \text{node.price} < \text{right.price}$.  
- When performing a **range query**, if the current node's price is smaller than $min$, we prune the entire left subtree without visiting it. If larger than $max$, we prune the entire right subtree.  
- This reduces search time to **$O(K + H)$** where $K$ is the number of matching items and $H$ is the tree height ($O(\log N)$ on average).  
- Furthermore, an **In-Order Traversal** of the BST produces a sorted price list in $O(N)$ time without running an expensive sorting algorithm.

---

### Q6: How does the Binary Min-Heap prioritize Food Rescue deals?
**Answer**:  
Surplus food rescue deals have collection deadlines (e.g., 45 minutes remaining vs. 180 minutes remaining).  
- The Min-Heap organizes deals based on remaining minutes as the priority key.  
- By definition of a Min-Heap, the root node ($A[0]$) always contains the minimum key (the deal expiring soonest).  
- Finding the most urgent deal is $O(1)$ (`peek()`), and inserting or extracting deals runs in $O(\log N)$ via `bubbleUp()` and `sinkDown()`.

---

### Q7: Why is Merge Sort preferred for sorting restaurants over Quick Sort or Bubble Sort?
**Answer**:  
1. **Guaranteed $O(N \log N)$**: Merge Sort is a divide-and-conquer algorithm with worst-case, average-case, and best-case time complexity of $O(N \log N)$. Quick Sort degrades to $O(N^2)$ on pre-sorted arrays.  
2. **Stability**: Merge Sort is a **stable sorting algorithm**, meaning that if two restaurants share identical ratings (e.g., both 4.8), their relative original order is preserved.  
3. Bubble Sort is $O(N^2)$, which is inefficient for large production catalogs.

---

### Q8: Compare Binary Search and Linear Search as implemented in your search benchmark.
**Answer**:  
- **Linear Search**: Checks every element sequentially from index $0$ to $N-1$. Works on unsorted data and handles substring queries, but requires $O(N)$ comparisons.  
- **Binary Search**: Requires the restaurant catalog to be pre-sorted alphabetically. In each step, it compares the target with the median element and discards half the array, achieving $O(\log N)$ comparisons.  
- For an array of 16 restaurants, Binary Search takes at most $\lceil \log_2(16) \rceil = 4$ comparisons, whereas Linear Search could take up to 16 comparisons.

---

### Q9: Where and how are Object-Oriented Programming (OOP) concepts demonstrated?
**Answer**:  
1. **Encapsulation**: Private `#` class fields (`#id`, `#basePrice`, `#ecoPoints`) in `oopModels.js` protect data from arbitrary modification. Public getters/setters enforce business rules.  
2. **Inheritance**: `BaseUser` is an abstract base class extended by `CustomerUser`, `RestaurantOwnerUser`, `DeliveryPartnerUser`, and `AdminUser`. `FoodItem` is extended by `RegularFoodItem` and `SurplusFoodDeal`.  
3. **Polymorphism**: The `calculateFinalPrice(ecoPackaging)` method is overridden by `SurplusFoodDeal` to dynamically apply markdown percentages, and `getEcoImpactScore()` yields higher rewards for food waste diversion.  
4. **Abstraction**: Callers interact with high-level methods like `advanceStage()` without needing to manipulate raw pointers.

---

### Q10: How does FoodLoop address UN Sustainable Development Goals (SDG 12 & 9)?
**Answer**:  
- **Primary — SDG 12 (Responsible Consumption & Production)**:  
  1. *Food Rescue Marketplace*: Restaurants sell fresh surplus food at 50%–65% off before closing, preventing landfill dumping.  
  2. *Single-use Plastic Cutlery Opt-out*: Selected by default, earning bonus eco-points.  
  3. *Compostable Bagasse Packaging*: Certified sugarcane bagasse packaging selection.  
- **Secondary — SDG 9 (Industry, Innovation & Infrastructure)**:  
  1. *Collaborative Group Ordering (`LOOP-XXXX`)*: Merges multiple office or dormitory orders into a single delivery run, drastically cutting vehicular courier emissions.  
  2. *Electric Scooter Routing*: Graph Dijkstra calculates shortest paths specifically for low-emission EV couriers.

---

### Q11: How does the Segment Tree work for Microbial Freshness Range Queries?
**Answer**:  
A **Segment Tree** is built over active restaurant inventory batches where each leaf stores the freshness index of a specific food batch. Internal tree nodes store the **minimum freshness index** and ID of the most urgent batch in their subsegment.  
- Querying which restaurant batch has the lowest freshness score in any subrange $[L, R]$ runs in **$O(\log N)$ time** rather than $O(N)$ linear scanning.  
- This allows FoodLoop to trigger automated price markdowns dynamically as microbial decay proceeds.

---

### Q12: How do Disjoint Set Union (DSU) and Bipartite Matching work in the Zero-Hunger Dispatch?
**Answer**:  
1. **Disjoint Set Union (DSU)**: Uses **Path Compression** (`parent[x] = find(parent[x])`) and **Union by Rank** to cluster geographically close kitchens, volunteer courier pods, and orphanages into emergency relief clusters in near-constant **$O(\alpha(N))$ time**.  
2. **Maximum-Weight Bipartite Matching**: Given disjoint sets $U$ (donor kitchens with surplus portions) and $V$ (beneficiary shelters with capacity needs and dietary restrictions), it finds the optimal matching that maximizes hungry individuals fed while respecting pure-vegetarian dietary constraints and minimizing transit distance.

---

### Q13: How does the Multi-Modal Drone-EV Relay transit graph work?
**Answer**:  
The city transit model is extended into a **Multi-Layer Directed Graph**:  
- Layer 1 (Air Corridor): Direct drone flight path at 48 km/h with 0 traffic congestion.  
- Layer 2 (Locker Handshake): Automated solar locker transfer node.  
- Layer 3 (Surface Road): Last-mile electric scooter travel.  
- The algorithm calculates the rendezvous point such that $|T_{\text{drone}} - T_{\text{courier}}| \le 2\text{ mins}$, saving up to 60% transit time and avoiding 780g of vehicle $CO_2$ per long-distance delivery.

---

### Q14: How does the Multi-Dimensional DP Knapsack solve the Meal Synthesizer problem?
**Answer**:  
It models meal selection as a **0/1 Knapsack Problem** with multi-dimensional constraints:  
- **Constraints**: Total price $\le \text{Budget}$ ($W$), Total carbon $\le \text{MaxCarbon}$ ($C$).  
- **Value**: Nutritional utility $U = \text{Protein} \times 2.8 + \text{SurplusBonus} - \text{Carbon} \times 15$.  
- The 2D DP table `dp[i][w]` stores the maximum utility considering the first $i$ dishes with budget $w$, taking $O(N \cdot W)$ time.  
- Optimal items are extracted in $O(N)$ via backtracking, proving polynomial-time multi-objective optimization for viva evaluators.

---

### Q15: Why are these innovations considered breakthroughs beyond commercial apps?
**Answer**:  
1. Commercial apps (Zomato/Swiggy) discard unsold food into garbage bins; FoodLoop uses **Arrhenius microbial kinetics & asymptotic pricing** to clear meals, and **DSU bipartite matching** to feed shelters at zero cost before spoilage.  
2. Commercial apps send one petrol motorbike for every order; FoodLoop uses **Group Ordering room codes** and **Multi-Modal Drone-EV Relays** to eliminate vehicular carbon.  
3. Commercial apps filter by simple price; FoodLoop uses a **Multi-Dimensional DP Knapsack** to optimize student protein intake and planet carbon footprint simultaneously.

---

### Quick Reference Formula Sheet for Viva

$$\text{Arrhenius Kinetic Spoilage}: k = A \cdot e^{-\frac{E_a}{RT}}$$
$$\text{Asymptotic Price Markdown}: P(t) = P_{\text{floor}} + (P_{\text{base}} - P_{\text{floor}}) \cdot e^{-\lambda t}$$
$$\text{Ackermann Inverse (DSU)}: O(\alpha(N)) < 5 \text{ for all practical } N$$
$$\text{DP Knapsack Transition}: dp[i][w] = \max(dp[i-1][w], dp[i-1][w - \text{price}_i] + \text{utility}_i)$$
$$\text{Binary Tree Height (balanced)}: H = \lfloor \log_2 N \rfloor$$
$$\text{Min-Heap Parent Index}: \text{parent}(i) = \lfloor (i - 1) / 2 \rfloor$$
$$\text{Min-Heap Left Child}: \text{left}(i) = 2i + 1$$
$$\text{Min-Heap Right Child}: \text{right}(i) = 2i + 2$$
$$\text{Dijkstra with Heap}: O((|V| + |E|) \log |V|)$$
$$\text{Merge Sort}: T(N) = 2T(N/2) + O(N) \implies O(N \log N)$$
$$\text{Binary Search}: T(N) = T(N/2) + O(1) \implies O(\log N)$$


