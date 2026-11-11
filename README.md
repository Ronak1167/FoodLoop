# FoodLoop – Smart & Sustainable Food Delivery System 🌱
> **JIIT CSE B.Tech 2nd Year – Data Structures Lab (PBL)**  
> **Department of Computer Science & Engineering and Information Technology**  
> **Jaypee Institute of Information Technology (JIIT), Noida Sector 62**  
> **Batch**: B2 | **Academic Year**: 2026–2027  
> **Faculty Mentors & Evaluators**: Dr. Sherry Garg & Dr. Lalita Mishra  

[![FoodLoop CI](https://github.com/Ronak1167/FoodLoop/actions/workflows/ci.yml/badge.svg)](https://github.com/Ronak1167/FoodLoop/actions)
![Tests](https://img.shields.io/badge/DSA%20Tests-14%2F14%20Passing-brightgreen?style=flat-square&logo=node.js)
![SDG](https://img.shields.io/badge/UN%20SDG-12%20%26%209-orange?style=flat-square)
![Node](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933?style=flat-square&logo=nodedotjs)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Live Demo](https://img.shields.io/badge/Live%20Demo-Online-success?style=flat-square&logo=render)

---

### 👥 Team Members & Project Attribution

| Name | Enrollment Number | Role / Contributions |
| :--- | :--- | :--- |
| **Pragya Ahlawat** | `2501030121` | UI/UX Design, Food Rescue Marketplace, Group Ordering Rooms |
| **Ronak Jain** | `2501030128` | Algorithm Design, Graph Dijkstra, Heap Queues, Automated Test Harness |
| **Rishabh Tyagi** | `2501030130` | Backend API Architecture, Doubly Linked List, LIFO Stack, Storage Engine |
| **Shobhit Khatana** | `2501030144` | BST Menu Indexing, Segment Tree Decay, Bipartite Matching, Report Documentation |

---

## 🔑 Presentation & Viva Quick Cheat-Sheet: Demo Credentials & Logins

> [!IMPORTANT]
> **UNIVERSAL PASSWORD FOR ALL ACCOUNTS**: `password123`  
> All 4 roles and all team member accounts are pre-loaded in the embedded database. On the [Login Page](http://localhost:5000/login), you can either click the **1-Click Autofill Buttons** or log in manually with any email below.

### 👥 Team Member Dedicated Accounts (JIIT Emails)
| Team Member | Enrollment | Role / Portal | Login Email | Password |
| :--- | :--- | :--- | :--- | :--- |
| **Ronak Jain** | `2501030128` | **Platform Admin** (`/admin-dashboard`) | `ronak@jiit.ac.in` | `password123` |
| **Pragya Ahlawat** | `2501030121` | **Customer / Food Rescue** (`/`) | `pragya@jiit.ac.in` | `password123` |
| **Rishabh Tyagi** | `2501030130` | **Restaurant Owner** (`/restaurant-dashboard`) | `rishabh@jiit.ac.in` | `password123` |
| **Shobhit Khatana** | `2501030144` | **Delivery Partner** (`/delivery-dashboard`) | `shobhit@jiit.ac.in` | `password123` |

### 🎭 1-Click Role-Based Demo Accounts
| Role | Portal / Destination | Email | Password | What You Can Demo |
| :--- | :--- | :--- | :--- | :--- |
| **Customer** | `/` (Home & Marketplace) | `customer@foodloop.com` | `password123` | Cart Undo/Redo, Food Rescue discount deals, Group order rooms (`LOOP-XXXX`), BST price filter |
| **Restaurant Owner** | `/restaurant-dashboard` | `greenbowl@foodloop.com` | `password123` | Live incoming kitchen FIFO queue, publishing surplus meals with Arrhenius decay pricing |
| **Delivery Partner** | `/delivery-dashboard` | `delivery@foodloop.com` | `password123` | Min-Heap priority queue assignment, live Dijkstra turn-by-turn routing with EV scooter |
| **Platform Administrator** | `/admin-dashboard` | `admin@foodloop.com` | `password123` | SDG 12 & SDG 9 analytics, orphanages & shelter emergency surplus dispatch via DSU & Bipartite Matching |

👉 **Full 3-Minute Presentation Walkthrough & Model Viva Answers**: See [**`docs/PRESENTATION_CHEATSHEET.md`**](file:///c:/Users/Ronak%20Jain/Downloads/FoodLoop/FoodLoop/docs/PRESENTATION_CHEATSHEET.md)

---

### 🎯 United Nations Sustainable Development Goals (SDG) Alignment
* **Primary Goal — SDG 12: Responsible Consumption and Production**:
  * Prevents safe, prepared commercial food from ending up in municipal landfills via real-time Food Rescue discounting.
  * Defaults to single-use plastic cutlery opt-out and 100% compostable sugarcane bagasse packaging with gamified Eco-Reward points.
* **Secondary Goal — SDG 9: Industry, Innovation, and Infrastructure**:
  * Collaborative group ordering rooms (`LOOP-XXXX`) consolidate multiple consumer orders into single low-carbon courier runs.
  * Multi-Modal Drone-to-EV delivery routing calculates lowest-emission transit corridors.
* **Humanitarian Impact — SDG 2: Zero Hunger**:
  * Automated emergency surplus dispatch routes unsold restaurant meals to orphanages and night shelters before expiration.

---

## 🌟 Executive Summary: What is FoodLoop?

**FoodLoop** is a modern full-stack food delivery application that merges the smooth ordering experience of platforms like Zomato and Swiggy with environmental responsibility and rigorous Computer Science Data Structures & Algorithms.

Unlike standard delivery systems that discard surplus meals and send individual gas-powered motorbikes for every small order, FoodLoop integrates:
1. A **Food Rescue Marketplace** where commercial kitchens list surplus meals at **50%–65% OFF**.
2. An **Interactive DSA Lab Visualizer** (`/dsa-lab`) demonstrating 11 classical data structures and algorithmic models directly inside the web browser.
3. A **Collaborative Group Order Hub** with dynamic bill splitting (by items or equal split).
4. **4 Role-Based Portals** (Customer, Restaurant Owner, Delivery Partner, Administrator) with 1-click demo logins.

---

## 🌐 Live Cloud Deployment & Public Access

FoodLoop is configured for multi-cloud deployment with 1-click automated builds:

### ⚡ 1. Live Instant Public URL
* **Main Application**: [**`https://594fc5b781cbca41-103-225-190-132.serveousercontent.com`**](https://594fc5b781cbca41-103-225-190-132.serveousercontent.com)
* **Interactive DSA Visualizer**: [**`https://594fc5b781cbca41-103-225-190-132.serveousercontent.com/dsa-lab`**](https://594fc5b781cbca41-103-225-190-132.serveousercontent.com/dsa-lab)
* **API Health Check**: [**`https://594fc5b781cbca41-103-225-190-132.serveousercontent.com/api/health`**](https://594fc5b781cbca41-103-225-190-132.serveousercontent.com/api/health)

---

### 🚀 2. 1-Click Free Cloud Deployment

#### Option A: Deploy to Render (Recommended for Full-Stack Node.js)
FoodLoop includes a pre-configured `render.yaml` blueprint. Click below to deploy a permanent free cloud instance:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Ronak1167/FoodLoop)

**Manual Render Setup (60 Seconds)**:
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New → Web Service**.
2. Connect your GitHub repository: `https://github.com/Ronak1167/FoodLoop`.
3. Configure settings:
   * **Environment**: `Node`
   * **Build Command**: `npm run render-build`
   * **Start Command**: `npm start`
   * **Plan**: `Free`
4. Click **Deploy Web Service**. Render will build the React frontend, start Express, and assign a permanent URL (e.g. `https://foodloop.onrender.com`).

#### Option B: Deploy with Docker
```bash
# Build the multi-stage production container
docker build -t foodloop .

# Run container on port 5000
docker run -d -p 5000:5000 --name foodloop-app foodloop
```

#### Option C: Deploy to Railway / Koyeb
* Connect `https://github.com/Ronak1167/FoodLoop` to [Railway](https://railway.app/) or [Koyeb](https://www.koyeb.com/).
* Railway automatically detects the root `Dockerfile` and deploys the full-stack container with SSL.

---

## 🛠️ System Requirements & Prerequisites

### Hardware Requirements
* **Processor**: Dual-Core 2.0 GHz or higher (Intel Core i3/i5/i7, AMD Ryzen, or Apple Silicon M-series).
* **RAM**: Minimum 4 GB (8 GB recommended).
* **Disk Space**: 500 MB free storage.

### Software Prerequisites
* **Operating System**: Windows 10/11, macOS, or Linux.
* **Node.js**: v18.0.0 or higher (v20+ recommended).
* **npm**: v9.0.0 or higher.
* **Web Browser**: Any modern browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).

---

## 🚀 Step-by-Step Installation & Running Guide

### Quick Start: 1-Command Full-Stack Server (Recommended)
FoodLoop includes an embedded resilient JSON storage engine in `server/data/`, meaning **no MongoDB service or external database setup is required to run out of the box**.

```bash
# 1. Clone the repository
git clone https://github.com/Ronak1167/FoodLoop.git
cd FoodLoop

# 2. Run the automated Data Structures Lab test suite (14/14 tests)
npm test

# 3. Start the unified application on port 5000
npm start
```

Once started, open your web browser and navigate to:
👉 **`http://localhost:5000`**

To jump straight into the Data Structures Lab Visualizer:
👉 **`http://localhost:5000/dsa-lab`**

---

### Development Mode (Independent Frontend & Backend)

If you wish to edit source code with live hot-reloading:

```bash
# Terminal 1 — Backend REST API (Port 5000):
cd server
npm start

# Terminal 2 — Frontend Vite Dev Server (Port 5173 with HMR):
cd client
npm run dev
```

Open **`http://localhost:5173`** for hot-reloading development.

---

## 🧪 Automated Test Suite (14/14 Tests Passing)

FoodLoop includes a standalone automated test harness in `server/test/dsa.test.js` validating every data structure and algorithm:

```bash
npm test
```

### Verified Test Suite Output
```text
======================================================
   FOODLOOP DATA STRUCTURES & OOP LAB TEST HARNESS   
======================================================

--- 1. Road Network Graph (Adjacency List) ---
  ✓ PASS: Graph contains 16 sector nodes and bidirectional edges

--- 2. Dijkstra Shortest Path Algorithm ---
  ✓ PASS: Calculates valid shortest path between N1 and N7

--- 3. Min-Priority Queue (Binary Min-Heap) ---
  ✓ PASS: Maintains Min-Heap invariant across multiple inserts and extractions

--- 4. FIFO Queue & Urgency Queue ---
  ✓ PASS: FIFO queue enqueues and dequeues in exact chronological order

--- 5. Merge Sort (Divide & Conquer) ---
  ✓ PASS: Sorts restaurants by rating descending in O(N log N) time

--- 6. Binary Search vs Linear Search ---
  ✓ PASS: Binary search finds item in O(log N) while linear search takes O(N)

--- 7. Doubly Linked List (Order Status Lifecycle) ---
  ✓ PASS: Advances and reverts order stages via next and prev pointers in O(1)

--- 8. LIFO Stack (Cart Undo / Redo Engine) ---
  ✓ PASS: Stack records actions and performs rollback (Undo) and recovery (Redo) in O(1)

--- 9. Binary Search Tree (Menu Price Indexer) ---
  ✓ PASS: BST inserts nodes, performs in-order traversal and executes range query

--- 10. Object-Oriented Domain Hierarchy & Polymorphism ---
  ✓ PASS: Validates encapsulation, class inheritance and dynamic polymorphic method overrides

--- 11. Microbial Freshness Decay & Segment Tree ---
  ✓ PASS: Calculates Arrhenius microbial decay and executes Segment Tree range query in O(log N)

--- 12. Zero-Hunger Emergency Dispatch (DSU & Bipartite Matching) ---
  ✓ PASS: DSU clusters nodes and Bipartite Matching pairs kitchens to shelters

--- 13. Multi-Modal Drone-EV Relay Route Optimizer ---
  ✓ PASS: Computes multi-modal drone-locker-EV route and verifies carbon avoidance

--- 14. Eco-Nutrient Multi-Dimensional DP Knapsack ---
  ✓ PASS: Solves 0/1 knapsack maximizing protein within financial budget and carbon cap

======================================================
TEST SUMMARY: 14 PASSED, 0 FAILED (100% SUCCESS RATE)
======================================================
```

---

## 👥 4 Role Dashboards & 1-Click Demo Logins

The application features instant 1-click role switcher buttons in the top navbar and login page:

| Role | Demo Email | Password | Key Features & Capabilities |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@foodloop.com` | `password123` | Browse menus, buy surplus deals, cart with undo/redo stack, live order tracking, group ordering rooms, sustainability points. |
| **Restaurant Owner** | `greenbowl@foodloop.com` | `password123` | Manage menu items, publish Food Rescue deals with countdown deadlines, update order preparation statuses, view revenue metrics. |
| **Delivery Partner** | `delivery@foodloop.com` | `password123` | View assigned orders, road graph navigation, GPS waypoint simulation, step orders through lifecycle (*Ready* ➔ *Delivered*). |
| **Administrator** | `admin@foodloop.com` | `password123` | Platform GMV analytics, food rescue impact counter, approve/suspend restaurants, audit all transactions, category oversight. |

---

## ⚡ Interactive DSA Lab Visualizer (`/dsa-lab`)

Located at **`http://localhost:5000/dsa-lab`**, this visualizer provides **11 interactive laboratory tabs** specifically designed for university lab evaluation and viva examinations:

| # | Data Structure / Algorithm | Real-World FoodLoop Application | Time Complexity | Space Complexity |
| :-: | :--- | :--- | :-: | :-: |
| **1** | **Graph (Adjacency List)** | 16-node city road network model with weighted bidirectional edges | $O(V + E)$ | $O(V + E)$ |
| **2** | **Dijkstra's Algorithm** | Shortest path routing for EV couriers with priority queue relaxation | $O((V + E) \log V)$ | $O(V + E)$ |
| **3** | **Doubly Linked List** | 6-stage live order tracking with $O(1)$ forward and backward rollback | $O(1)$ advance/revert | $O(N)$ |
| **4** | **LIFO Stack (Twin Stack)** | Cart action Undo/Redo engine preventing accidental order losses | $O(1)$ push/pop | $O(N)$ |
| **5** | **Binary Search Tree (BST)** | Menu price indexing with sub-linear range queries $[min, max]$ | $O(K + H)$ query | $O(N)$ |
| **6** | **Binary Min-Heap** | Urgency queue prioritizing surplus deals expiring soonest at root | $O(\log N)$ insert/extract | $O(N)$ |
| **7** | **Merge Sort** | Stable divide-and-conquer restaurant catalog sorting by rating/time | $O(N \log N)$ all cases | $O(N)$ |
| **8** | **Binary vs. Linear Search** | Logarithmic search over sorted names vs. linear sequential search | $O(\log N)$ vs $O(N)$ | $O(1)$ |
| **9** | **OOP Architecture** | Demonstrates private `#` encapsulation, inheritance, and polymorphism | N/A | N/A |
| **10** | **Segment Tree & Arrhenius Kinetics** | Microbial spoilage decay modeling with dynamic asymptotic pricing | $O(\log N)$ range query | $O(4N)$ |
| **11** | **DSU & Bipartite Matching** | Zero-Hunger emergency dispatch pairing surplus kitchens to shelters | $O(\alpha(N))$ & $O(V \cdot E)$ | $O(V + E)$ |
| **12** | **Multi-Modal Relay DAG** | Drone-to-EV courier handshake routing via smart solar lockers | $O((V + E) \log V)$ | $O(V + E)$ |
| **13** | **DP 0/1 Knapsack** | Multi-constraint meal synthesizer optimizing protein within budget & carbon | $O(N \cdot \text{Budget})$ | $O(N \cdot \text{Budget})$ |

---

## 🔬 4 Groundbreaking Real-World Innovations (What's New?)

These 4 innovations were engineered to address real-world problems unsolved by commercial food apps:

### Innovation 1: Thermodynamic Microbial Freshness Decay & Dynamic Asymptotic Pricing
* **Problem**: Current apps treat food freshness as binary ("safe" vs "expired"). Edible food is dumped simply because a clock hits an arbitrary time.
* **Solution**: Implements **Arrhenius bacterial growth kinetics** ($k = A \cdot e^{-E_a/RT}$) estimating Colony Forming Units ($CFU/g$). FoodLoop uses an exponential asymptotic markdown curve:
  $$P(t) = P_{\text{floor}} + (P_{\text{base}} - P_{\text{floor}}) \cdot e^{-\lambda t}$$
  ensuring meals are sold at decreasing prices before reaching critical thresholds.
* **Data Structure**: **Segment Tree** built over active batches for $O(\log N)$ range queries.

### Innovation 2: Zero-Hunger Emergency Dispatch (SDG 2)
* **Problem**: When surplus food enters the final 45 minutes before closing, commercial demand drops to zero, and kitchens dump food while nearby night shelters starve.
* **Solution**: Automatically transitions unsold surplus to **Zero-Cost Emergency Humanitarian Dispatch**.
* **Data Structure & Algorithm**: **Disjoint Set Union (DSU with Path Compression & Union by Rank)** clusters local volunteer pods in near-constant $O(\alpha(N))$ time, and **Maximum-Weight Bipartite Graph Matching** matches portions to shelter headcounts and dietary restrictions (e.g. pure veg).

### Innovation 3: Multi-Modal Drone-to-EV Courier Handshake Relay
* **Problem**: Gas-powered delivery motorbikes generate 142g $CO_2$/km and get stuck in arterial traffic.
* **Solution**: Splits trips $> 5\text{ km}$ into an express autonomous drone air corridor ($48\text{ km/h}$, 0 street traffic), a smart solar locker automated carousel handshake, and last-mile EV scooter doorstep delivery.
* **Data Structure**: Multi-layer Directed Acyclic Graph (DAG) with synchronized transfer windows ($|T_{\text{drone}} - T_{\text{courier}}| \le 2\text{ mins}$).

### Innovation 4: Eco-Nutrient Pareto Frontier Meal Synthesizer
* **Problem**: Consumers have competing goals: staying within a financial budget, meeting protein targets, and minimizing environmental carbon footprints.
* **Solution**: Formulates meal selection as a **Multi-Dimensional 0/1 Knapsack Problem** solved via **Dynamic Programming (DP)** with memoization ($O(N \cdot B)$), constructing the optimal meal set on the Pareto frontier.

---

## 📁 Project Directory Structure

```text
FoodLoop/
├── client/                          # React 18 Frontend
│   ├── dist/                        # Pre-built production bundle
│   ├── src/
│   │   ├── components/              # Navbar, Footer, FoodCard, CartDrawer, SDGBadge
│   │   ├── context/                 # AuthContext (RBAC), CartContext (State)
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Hero, Highlights, Quick Demo
│   │   │   ├── Restaurants.jsx      # Catalog, Multi-criteria Sorting
│   │   │   ├── FoodRescue.jsx       # Surplus Deals, Dynamic Markdown Timers
│   │   │   ├── GroupOrder.jsx       # Collaborative Room Codes (LOOP-XXXX)
│   │   │   ├── DsaLabVisualizer.jsx # 11-Tab Interactive DSA Visualizer
│   │   │   ├── OrderTracking.jsx    # Live Order Lifecycle Tracker
│   │   │   ├── SustainabilityDashboard.jsx # Eco-Points, CO2 Metrics
│   │   │   └── ... (Role Dashboards for Restaurant, Courier, Admin)
│   │   └── services/api.js          # REST Client for all 25 Endpoints
│   ├── package.json
│   └── vite.config.js
│
├── server/                          # Node.js + Express Backend
│   ├── data/                        # Persistent JSON Document Database
│   │   ├── users.json
│   │   ├── restaurants.json
│   │   ├── menuItems.json
│   │   └── orders.json
│   ├── src/
│   │   ├── algorithms/              # Custom Data Structures & Algorithms
│   │   │   ├── roadGraph.js         # Weighted Graph (Adjacency List - 16 Nodes)
│   │   │   ├── dijkstra.js          # Dijkstra Shortest Path with Min-Heap
│   │   │   ├── doublyLinkedList.js  # Order Lifecycle Doubly Linked List
│   │   │   ├── stack.js             # Cart Undo/Redo Twin Stack
│   │   │   ├── binarySearchTree.js  # Menu Price BST Indexer & Range Query
│   │   │   ├── priorityQueue.js     # Binary Min-Heap Priority Queue
│   │   │   ├── orderQueue.js        # FIFO Kitchen Preparation Queue
│   │   │   ├── sortingSearching.js  # Merge Sort & Binary Search
│   │   │   ├── recommendationHash.js# Hash Map Frequency Recommender
│   │   │   ├── freshnessKinetics.js # Arrhenius Decay & Segment Tree
│   │   │   ├── zeroHungerDispatch.js# DSU & Bipartite Graph Matching
│   │   │   ├── multimodalRelay.js   # Multi-Modal Drone-EV Relay DAG
│   │   │   ├── ecoKnapsack.js       # Dynamic Programming 0/1 Knapsack
│   │   │   └── oopModels.js         # Formal OOP Domain Hierarchy
│   │   ├── routes/                  # Express REST Routes
│   │   │   ├── dsaRoutes.js         # All DSA Evaluation API Endpoints
│   │   │   └── ... (auth, restaurants, orders, rescue, delivery, admin)
│   │   └── server.js                # Server Entrypoint & Unified Static Host
│   ├── test/
│   │   └── dsa.test.js              # 14-Module Automated Test Harness
│   └── package.json
│
├── docs/                            # Academic Submission Documents
│   ├── PRESENTATION_CHEATSHEET.md   # Presentation Guide & All Saved Passwords
│   ├── PROJECT_REPORT.md            # Official 8-Section Final Report
│   ├── VIDEO_DEMO_SCRIPT.md         # 2–3 Minute Video Submission Script
│   └── VIVA_PREPARATION_GUIDE.md    # Top 20 Viva Questions & Formula Reference
│
├── .gitignore                       # Clean Repository Ignore Rules
├── package.json                     # Root Orchestration Scripts
└── README.md                        # Master Documentation
```

---

## 📑 Academic Deliverables Included

All documentation required by the **JIIT Data Structures Lab (PBL) Submission Guidelines** has been prepared and formatted:

1. **Official 8-Section Project Report** ([`docs/PROJECT_REPORT.md`](file:///c:/Users/Ronak%20Jain/Downloads/FoodLoop/FoodLoop/docs/PROJECT_REPORT.md)):
   * Title Page with student names and enrollment numbers.
   * Table of Contents, Problem Statement, Scope.
   * UML Class Diagram (Mermaid & ASCII).
   * Comprehensive Time/Space Complexity Table for all 14 algorithms.
   * Numbered and captioned figures (Figures 5.1 through 5.11).
   * Formal Academic References (Cormen et al., UN SDG, FSSAI).
2. **Video Submission Walkthrough Script** ([`docs/VIDEO_DEMO_SCRIPT.md`](file:///c:/Users/Ronak%20Jain/Downloads/FoodLoop/FoodLoop/docs/VIDEO_DEMO_SCRIPT.md)):
   * Time-coded 2.5-minute speaking script for recording your team demo video.
3. **Viva Examination Cheat-Sheet** ([`docs/VIVA_PREPARATION_GUIDE.md`](file:///c:/Users/Ronak%20Jain/Downloads/FoodLoop/FoodLoop/docs/VIVA_PREPARATION_GUIDE.md)):
   * Top 20 viva questions with model answers and quick-reference formula sheet.
4. **Presentation Cheatsheet & Master Logins** ([`docs/PRESENTATION_CHEATSHEET.md`](file:///c:/Users/Ronak%20Jain/Downloads/FoodLoop/FoodLoop/docs/PRESENTATION_CHEATSHEET.md)):
   * All saved passwords, role credentials, 3-minute presentation script, and speaker breakdown.

---

## 📜 License

This project is submitted for academic evaluation under the **B.Tech CSE Curriculum at Jaypee Institute of Information Technology (JIIT), Noida-62**.  
Distributed under the ISC License. © 2026 FoodLoop Team.
