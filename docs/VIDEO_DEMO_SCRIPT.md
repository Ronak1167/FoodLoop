# FoodLoop – 2-to-3 Minute Video Demo Submission Script
## JIIT CSE B.Tech 2nd Year – Data Structures Lab (PBL)

**Batch**: B2  
**Faculty Evaluators**: Dr. Sherry Garg & Dr. Lalita Mishra  
**Team Members**:
- Pragya Ahlawat (2501030121)
- Ronak Jain (2501030128)
- Rishabh Tyagi (2501030130)
- Shobhit Khatana (2501030144)

---

### Video Overview
- **Recommended Length**: 2 minutes 30 seconds to 3 minutes
- **Recording Tool**: OBS Studio, Windows Xbox Game Bar (`Win + G`), or Loom.
- **Microphone**: Clear spoken voice, steady screen recording of `http://localhost:5000`.

---

### Step-by-Step Script & Visual Walkthrough

#### [00:00 – 00:30] Introduction & Academic Attribution
- **Visual**: Show homepage (`http://localhost:5000`) with FoodLoop logo, SDG Badges, and team info.
- **Voiceover**:
  > *"Good morning respected faculty. We are Team B2 — Pragya Ahlawat, Ronak Jain, Rishabh Tyagi, and Shobhit Khatana, presenting our Project-Based Learning submission for the Data Structures Lab under the mentorship of Dr. Sherry Garg and Dr. Lalita Mishra ma'am.
  > Our project is **FoodLoop** — a Smart & Sustainable Food Delivery System engineered for **SDG 12: Responsible Consumption and Production** and **SDG 9: Industry, Innovation, and Infrastructure**.
  > FoodLoop tackles two critical problems: commercial restaurant food waste through our Food Rescue marketplace, and delivery carbon emissions through collaborative group ordering."*

---

#### [00:30 – 01:10] Core Full-Stack Application & Innovations
- **Visual**: Click on **Food Rescue** tab, show countdown deal timers, show **Group Order** (`LOOP-XXXX`), and open **Cart**.
- **Voiceover**:
  > *"In the application, customers can purchase fresh, surplus meals at 50% to 65% discount before collection deadlines pass, preventing landfill food waste.
  > At checkout, our platform defaults to single-use plastic cutlery opt-out and 100% biodegradable bagasse packaging, rewarding customers with eco-points.
  > Our Group Ordering feature allows friends to create a room code, select their dishes together, and consolidate everything into a single electric scooter delivery trip."*

---

#### [01:10 – 02:20] Live Data Structures & Algorithms Lab Visualizer (HIGH VALUE FOR EVALUATION)
- **Visual**: Click the **"DSA Lab"** tab in the top navigation bar.
- **Voiceover**:
  > *"To demonstrate our Data Structures Lab curriculum, we built an interactive visualizer right into the platform.
  > 
  > 1. **Graph & Dijkstra's Algorithm**: Here we model the city as a weighted graph of 16 sector nodes using an Adjacency List. When we click 'Run Dijkstra' from Node N1 to N7, it uses a custom Binary Min-Heap to calculate the optimal 5.6-kilometer route in O((V+E) log V) time, showing every relaxation step.
  > 
  > 2. **Order Lifecycle with Doubly Linked List**: Here our order lifecycle is a node-based Doubly Linked List. With our advance and revert controls, pointer traversal happens in O(1) time without database re-queries.
  > 
  > 3. **Cart Undo/Redo Engine with LIFO Stack**: We implemented twin stacks. When an item is added or removed, it pushes to the Undo Stack. Clicking 'Undo' pops the action and restores prior state in O(1) time.
  > 
  > 4. **Menu Price Indexer with Binary Search Tree (BST)**: All dishes are indexed by price. When filtering meals between ₹150 and ₹300, the BST prunes external subtrees, executing range queries in sub-linear O(K + H) time.
  > 
  > 5. **Min-Heap Surplus Urgency**: Here the Min-Heap prioritizes meals by remaining minutes, keeping the deal expiring soonest at the root.
  > 
  > 6. **Merge Sort & Search Benchmark**: Here we show Merge Sort running in O(N log N) time and Binary Search taking only 2 to 3 comparisons versus sequential Linear Search.
  > 
  > 7. **Advanced Breakthroughs (Teacher-Requested Innovations)**:
  >    - **Microbial Spoilage Decay & Segment Tree**: We model Arrhenius bacterial kinetics to dynamically decrement meal price along an exponential markdown curve before food spoils.
  >    - **Zero-Hunger Emergency Dispatch (SDG 2)**: Uses Disjoint Set Union (DSU) and Bipartite Matching to automatically dispatch expiring food to local orphanages and shelters at zero cost.
  >    - **Drone-EV Multi-Modal Relay**: Solves traffic and emissions by routing cargo drones through sky corridors to smart solar locker handshakes for last-mile EV delivery.
  >    - **Eco-Nutrient DP Knapsack**: Uses Dynamic Programming to synthesize meal combinations maximizing clean protein while strictly capping wallet budget and carbon footprint."*

---

#### [02:20 – 02:45] Object-Oriented Programming (OOP) Demonstration
- **Visual**: Switch to the **OOP Architecture** tab in the visualizer.
- **Voiceover**:
  > *"For our OOP evaluation, our codebase incorporates:
  > - **Encapsulation** using private ES2022 hashtag fields `#` guarding internal prices and points.
  > - **Inheritance** where Customer, Restaurant Owner, and Courier classes inherit from an abstract BaseUser.
  > - And **Polymorphism**, where our SurplusFoodDeal dynamically overrides `calculateFinalPrice()` to apply SDG discounts and `getEcoImpactScore()` to reflect food waste diversion."*

---

#### [02:45 – 03:00] Test Harness & Conclusion
- **Visual**: Quick flash of terminal running `npm test` showing `14 PASSED, 0 FAILED`.
- **Voiceover**:
  > *"All 14 algorithmic modules are verified by our automated test harness with 100% pass rate.
  > Thank you Sherry ma'am and Lalita ma'am for your guidance throughout the semester. We look forward to our viva evaluation."*

