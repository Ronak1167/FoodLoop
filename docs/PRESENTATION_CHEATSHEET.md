# 🎓 FoodLoop — Presentation & Viva Cheatsheet
> **JIIT CSE B.Tech 2nd Year — Data Structures Lab (PBL)**  
> **Batch**: B2 | **Academic Year**: 2026–2027  
> **Faculty Mentors & Evaluators**: Dr. Sherry Garg & Dr. Lalita Mishra  
> **Repository**: [https://github.com/Ronak1167/FoodLoop](https://github.com/Ronak1167/FoodLoop)  
> **Live App**: [https://594fc5b781cbca41-103-225-190-132.serveousercontent.com](https://594fc5b781cbca41-103-225-190-132.serveousercontent.com) (or `http://localhost:5000`)  
> **DSA Visualizer**: [http://localhost:5000/dsa-lab](http://localhost:5000/dsa-lab)  

---

## 🔑 1. Master Login & Password Reference

> [!IMPORTANT]
> **UNIVERSAL PASSWORD FOR ALL ACCOUNTS**: `password123`  
> On the login page, you can either click the **1-Click Autofill Buttons** or type any of the credentials below manually.

### A. Team Member Personalized Accounts (JIIT Emails)
| Team Member | Enrollment | Role / Portal | Login Email | Password |
| :--- | :--- | :--- | :--- | :--- |
| **Ronak Jain** | `2501030128` | **Platform Admin** (`/admin-dashboard`) | `ronak@jiit.ac.in` | `password123` |
| **Pragya Ahlawat** | `2501030121` | **Customer / Food Rescue** (`/`) | `pragya@jiit.ac.in` | `password123` |
| **Rishabh Tyagi** | `2501030130` | **Restaurant Owner** (`/restaurant-dashboard`) | `rishabh@jiit.ac.in` | `password123` |
| **Shobhit Khatana** | `2501030144` | **Delivery Partner** (`/delivery-dashboard`) | `shobhit@jiit.ac.in` | `password123` |

---

### B. Role-Based Demo Accounts (Autofill Buttons on Login Screen)
| Role | Portal / Destination | Email | Password | What You Can Demo |
| :--- | :--- | :--- | :--- | :--- |
| **Customer** | `/` (Home & Marketplace) | `customer@foodloop.com` | `password123` | Cart Undo/Redo, Food Rescue discount deals, Group order rooms (`LOOP-XXXX`), BST price filter |
| **Restaurant Owner** | `/restaurant-dashboard` | `greenbowl@foodloop.com` | `password123` | Live incoming kitchen FIFO queue, publishing surplus meals with Arrhenius decay pricing |
| **Delivery Partner** | `/delivery-dashboard` | `delivery@foodloop.com` | `password123` | Min-Heap priority queue assignment, live Dijkstra turn-by-turn routing with EV scooter |
| **Platform Administrator** | `/admin-dashboard` | `admin@foodloop.com` | `password123` | SDG 12 & SDG 9 analytics, orphanages & shelter emergency surplus dispatch via DSU & Bipartite Matching |

---

### C. Delivery Partners by Road Network Node (For Dijkstra Demo)
| Courier Name | Assigned Node | Vehicle Type | Email | Password |
| :--- | :--- | :--- | :--- | :--- |
| **Rohan Das** | `N2` (Galleria Market) | Ather 450X (Electric EV) | `delivery@foodloop.com` | `password123` |
| **Amit Kumar** | `N5` (MG Road Metro) | Ola S1 Pro (Electric EV) | `amit.delivery@foodloop.com` | `password123` |
| **Priya Sundaram** | `N1` (DLF Cyber City) | TVS iQube (Electric EV) | `priya.delivery@foodloop.com` | `password123` |
| **Vikas Mehra** | `N7` (Sushant Lok 1) | Hero Electric Optima EV | `vikas.delivery@foodloop.com` | `password123` |
| **Sunil Yadav** | `N4` (Sector 29) | Standard Petrol Scooter | `sunil.delivery@foodloop.com` | `password123` |

---

## ⏱️ 2. Rapid 3-Minute Presentation Walkthrough Script

### Minute 0:00 – 0:45: Problem Statement & SDG Alignment (Pragya Ahlawat)
* *"Respected evaluators, Dr. Sherry Garg and Dr. Lalita Mishra, commercial food delivery services discard tonnes of edible surplus every night while dispatching single petrol motorbikes for isolated orders."*
* *"Our project, **FoodLoop**, addresses **UN SDG 12 (Responsible Consumption & Production)** and **SDG 9 (Industry, Innovation & Infrastructure)** through 14 classical and advanced Data Structures."*

### Minute 0:45 – 1:30: Classical DSA Demonstration (Ronak Jain & Rishabh Tyagi)
* Open [**`http://localhost:5000/dsa-lab`**](http://localhost:5000/dsa-lab).
* **Tab 1 — Road Graph & Dijkstra**: Select Source `N1` (Cyber City) and Destination `N7` (Sushant Lok). Click **Calculate Shortest Route**. Point out:
  * Time complexity: $O((V + E) \log V)$ using Min-Priority Queue.
  * Node-by-node relaxation steps shown in the animated step table.
* **Tab 2 — Doubly Linked List Order Tracker**: Click **Advance Stage** and **Revert Stage**. Show bidirectional pointers $O(1)$ without circular JSON serialization errors.
* **Tab 3 — Cart Undo/Redo LIFO Stack**: Click **Add Item**, then click **Undo**, then click **Redo**. Show twin stacks in $O(1)$.
* **Tab 4 — BST Menu Indexer**: Enter Min ₹100 and Max ₹250. Click **Execute Range Query**. Show sorted items in $O(K + H)$ time.

### Minute 1:30 – 2:30: Breakthrough Advanced Innovations (Shobhit Khatana)
* **Tab 8 — Arrhenius Freshness Kinetics**: Explain how biochemical decay $P(t) = P_{\text{floor}} + (P_{\text{base}} - P_{\text{floor}}) \cdot e^{-\lambda t}$ powers continuous surplus discounting, with Segment Tree range queries in $O(\log N)$.
* **Tab 9 — Zero-Hunger NGO Redistribution**: Show Disjoint Set Union (DSU) in $O(\alpha(N))$ and Maximum-Weight Bipartite Graph Matching pairing surplus meals with orphanages before expiration.
* **Tab 10 — Multi-Modal Drone-to-EV DAG Relay**: Show 3-leg zero-carbon transit corridor.
* **Tab 11 — Dynamic Programming Eco-Knapsack**: Show $O(N \cdot B)$ knapsack maximizing clean nutrition within budget and carbon caps.

### Minute 2:30 – 3:00: Automated Test Suite & Code Quality (All Team Members)
* Switch to terminal and show:
  ```bash
  npm test
  ```
* Point out: **14/14 Unit Tests Passing**, automated GitHub Actions CI pipeline running with 100% green status on every push.

---

## ❓ 3. Top 5 Viva Questions & Fast Model Answers

### Q1: Why use a Doubly Linked List for order tracking instead of an Array?
* **Answer**: An order has sequential stages (Placed $\leftrightarrow$ Kitchen $\leftrightarrow$ Out for Delivery $\leftrightarrow$ Delivered). A Doubly Linked List enables $O(1)$ forward and backward transitions using `prev` and `next` pointers without needing array index shifting ($O(N)$).

### Q2: Why is Dijkstra's time complexity $O((V + E) \log V)$?
* **Answer**: We use an Adjacency List with a Binary Min-Heap Priority Queue. There are $V$ `extractMin` operations (each taking $O(\log V)$) and up to $E$ edge relaxations (each `decreaseKey` taking $O(\log V)$), giving total time $O((V + E) \log V)$.

### Q3: How does the BST range query achieve $O(K + H)$ complexity?
* **Answer**: $H$ is the tree height ($O(\log N)$ on balanced trees). We traverse down to the smallest element $\ge \text{minPrice}$ in $O(H)$, and then visit only the $K$ nodes that fall inside the interval $[\text{minPrice}, \text{maxPrice}]$ via in-order pruning, without scanning the whole dataset ($O(N)$).

### Q4: How does the Cart Undo/Redo stack work?
* **Answer**: We use two LIFO stacks: `undoStack` and `redoStack`. When a user modifies the cart, the inverse operation is pushed to `undoStack` in $O(1)$ and `redoStack` is cleared. When Undo is triggered, the operation is popped from `undoStack` and pushed to `redoStack` in $O(1)$.

### Q5: What is the real-world benefit of Bipartite Matching in Food Rescue?
* **Answer**: It solves the surplus food mismatch problem. Instead of random allocation, it uses a bipartite graph where left nodes are surplus commercial kitchens and right nodes are registered shelters/orphanages, maximizing overall satisfied beneficiaries before meals spoil.

---

## 📁 4. Project Directory Map For Quick Reference During Viva

```text
FoodLoop/
├── client/src/pages/DsaLabVisualizer.jsx  # Interactive UI for all 11 DSA models
├── server/src/algorithms/
│   ├── roadGraph.js                      # 16-Node Adjacency List Graph
│   ├── dijkstra.js                       # Dijkstra Shortest Path + Min-Heap
│   ├── doublyLinkedList.js               # Order Lifecycle Doubly Linked List
│   ├── stack.js                          # Cart Action Twin LIFO Stacks
│   ├── binarySearchTree.js               # Price BST with Range Queries
│   ├── priorityQueue.js                  # Binary Min-Heap Priority Queue
│   ├── orderQueue.js                     # FIFO & Urgency Kitchen Queues
│   ├── sortingSearching.js               # Merge Sort & Binary Search
│   ├── recommendationHash.js             # Hash Map Frequency Counter
│   ├── freshnessKinetics.js              # Arrhenius Decay & Segment Tree
│   ├── zeroHungerDispatch.js             # DSU & Bipartite Graph Matching
│   ├── multimodalRelay.js                # Drone-EV Relay Transit DAG
│   ├── ecoKnapsack.js                    # Multi-Dimensional 0/1 Knapsack DP
│   └── oopModels.js                      # Formal OOP Domain Hierarchy
├── server/test/dsa.test.js               # 14-Module Automated Test Suite
└── docs/                                 # Academic Project Submission Deliverables
```
