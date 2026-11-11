import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Layers, 
  GitCommit, 
  Binary, 
  Cpu, 
  ArrowRight, 
  RotateCcw, 
  RotateCw, 
  CheckCircle, 
  Clock, 
  Search, 
  Zap, 
  ShieldCheck, 
  ChevronRight, 
  Play, 
  Sparkles, 
  Award,
  BookOpen
} from 'lucide-react';
import { api } from '../services/api';

export default function DsaLabVisualizer() {
  const [activeTab, setActiveTab] = useState('graph');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);

  // 1. Graph & Dijkstra State
  const [graphData, setGraphData] = useState(null);
  const [startNode, setStartNode] = useState('N1');
  const [targetNode, setTargetNode] = useState('N7');
  const [dijkstraResult, setDijkstraResult] = useState(null);

  // 2. Doubly Linked List State
  const [linkedListState, setLinkedListState] = useState(null);

  // 3. Stack State
  const [stackState, setStackState] = useState(null);

  // 4. BST State
  const [bstState, setBstState] = useState(null);
  const [minPrice, setMinPrice] = useState(150);
  const [maxPrice, setMaxPrice] = useState(300);
  const [bstRangeResult, setBstRangeResult] = useState(null);

  // 5. Min-Heap State
  const [heapState, setHeapState] = useState(null);

  // 6. Sorting & Searching State
  const [sortResult, setSortResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState('GreenBowl');
  const [searchResult, setSearchResult] = useState(null);

  // 7. OOP Models State
  const [oopData, setOopData] = useState(null);

  // 8. Innovation 1: Freshness Decay State
  const [freshnessMinutes, setFreshnessMinutes] = useState(75);
  const [storageType, setStorageType] = useState('thermal_insulated');
  const [freshnessResult, setFreshnessResult] = useState(null);

  // 9. Innovation 2: Zero Hunger Dispatch State
  const [zeroHungerResult, setZeroHungerResult] = useState(null);

  // 10. Innovation 3: Multi-modal Relay State
  const [multimodalResult, setMultimodalResult] = useState(null);

  // 11. Innovation 4: Eco Knapsack State
  const [knapsackBudget, setKnapsackBudget] = useState(320);
  const [knapsackResult, setKnapsackResult] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const sum = await api.getDsaSummary();
      setSummary(sum);
      loadGraph();
      loadLinkedList();
      loadStack();
      loadBst();
      loadHeap();
      loadOop();
      handleRunFreshness();
      handleRunZeroHunger();
      handleRunMultimodal();
      handleRunKnapsack();
    } catch (err) {
      console.error('Error loading initial DSA data:', err);
    }
  };

  const loadGraph = async () => {
    try {
      const data = await api.getRoadGraph();
      setGraphData(data);
    } catch (e) { console.error(e); }
  };

  const handleRunDijkstra = async () => {
    setLoading(true);
    try {
      const res = await api.runDijkstra({ startNode, targetNode, trackSteps: true });
      setDijkstraResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadLinkedList = async () => {
    try {
      const res = await api.getLinkedListState();
      setLinkedListState(res);
    } catch (e) { console.error(e); }
  };

  const handleAdvanceStage = async () => {
    try {
      const res = await api.advanceLinkedList();
      setLinkedListState(prev => ({
        ...prev,
        currentStage: res.current,
        stages: res.stages
      }));
    } catch (e) { console.error(e); }
  };

  const handleRevertStage = async () => {
    try {
      const res = await api.revertLinkedList();
      setLinkedListState(prev => ({
        ...prev,
        currentStage: res.current,
        stages: res.stages
      }));
    } catch (e) { console.error(e); }
  };

  const loadStack = async () => {
    try {
      const res = await api.getStackState();
      setStackState(res);
    } catch (e) { console.error(e); }
  };

  const handleStackAction = async (actionType) => {
    try {
      const demoItems = [
        { name: 'Avocado Superfood Bowl', price: 290, quantity: 1 },
        { name: 'Fresh Woodfired Sourdough', price: 180, quantity: 1 },
        { name: 'Vegan Protein Smoothie', price: 160, quantity: 1 },
        { name: 'Organic Matcha Chia Pot', price: 210, quantity: 1 }
      ];
      const randomItem = demoItems[Math.floor(Math.random() * demoItems.length)];
      await api.recordStackAction({ actionType, itemPayload: randomItem });
      loadStack();
    } catch (e) { console.error(e); }
  };

  const handleStackUndo = async () => {
    try {
      await api.undoStackAction();
      loadStack();
    } catch (e) { console.error(e); }
  };

  const handleStackRedo = async () => {
    try {
      await api.redoStackAction();
      loadStack();
    } catch (e) { console.error(e); }
  };

  const loadBst = async () => {
    try {
      const res = await api.getBstState();
      setBstState(res);
    } catch (e) { console.error(e); }
  };

  const handleRunBstRange = async () => {
    try {
      const res = await api.runBstRangeQuery({ minPrice, maxPrice });
      setBstRangeResult(res);
    } catch (e) { console.error(e); }
  };

  const loadHeap = async () => {
    try {
      const res = await api.getSurplusHeapState();
      setHeapState(res);
    } catch (e) { console.error(e); }
  };

  const handleRunSort = async (sortBy) => {
    try {
      const res = await api.runMergeSort({ sortBy });
      setSortResult(res);
    } catch (e) { console.error(e); }
  };

  const handleRunSearch = async () => {
    try {
      const res = await api.runSearchBenchmark({ query: searchQuery });
      setSearchResult(res);
    } catch (e) { console.error(e); }
  };

  const loadOop = async () => {
    try {
      const res = await api.getOopModels();
      setOopData(res);
    } catch (e) { console.error(e); }
  };

  const handleRunFreshness = async () => {
    try {
      const res = await api.getFreshnessSimulation({
        prepTimeMinutesAgo: freshnessMinutes,
        storageType
      });
      setFreshnessResult(res);
    } catch (e) { console.error(e); }
  };

  const handleRunZeroHunger = async () => {
    try {
      const res = await api.runZeroHungerDispatch();
      setZeroHungerResult(res);
    } catch (e) { console.error(e); }
  };

  const handleRunMultimodal = async () => {
    try {
      const res = await api.calculateMultimodalRelay({
        sourceNode: startNode,
        destinationNode: targetNode,
        totalDistanceRoadKm: dijkstraResult?.totalDistanceKm || 5.6
      });
      setMultimodalResult(res);
    } catch (e) { console.error(e); }
  };

  const handleRunKnapsack = async () => {
    try {
      const res = await api.solveEcoKnapsack({
        targetBudget: knapsackBudget
      });
      setKnapsackResult(res);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner for JIIT CSE BTech 2nd Year Data Structures Lab */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-500/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-emerald-500 text-emerald-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                JIIT CSE B.Tech 2nd Year
              </span>
              <span className="bg-white/10 text-emerald-200 font-semibold text-xs px-3 py-1 rounded-full border border-white/10">
                Data Structures Lab (PBL)
              </span>
              <span className="bg-teal-500/20 text-teal-300 font-semibold text-xs px-3 py-1 rounded-full border border-teal-400/30">
                Batch: B2
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              FoodLoop Algorithm & DSA Visualizer
            </h1>
            <p className="text-emerald-200/90 text-sm sm:text-base mt-2 max-w-2xl">
              Live interactive laboratory testbed validating Graph Dijkstra, Doubly Linked List, LIFO Stack, Min-Heap, Binary Search Tree, and Merge Sort.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-xs text-emerald-100 space-y-1.5 self-start md:self-auto min-w-[280px]">
            <div className="flex items-center gap-1.5 font-bold text-white mb-1">
              <Award className="w-4 h-4 text-emerald-400" /> Academic Project Attribution
            </div>
            <div><strong>Faculty Evaluators:</strong> Sherry Garg & Lalita Mishra</div>
            <div><strong>Students:</strong> Pragya (121), Ronak (128), Rishabh (130), Shobhit (144)</div>
            <div className="text-emerald-300 font-medium pt-1 border-t border-white/10">
              Primary: SDG 12 | Secondary: SDG 9
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 border-t border-white/10 pt-4 scrollbar-none">
          {[
            { id: 'graph', label: '1. Graph & Dijkstra', icon: Network },
            { id: 'linkedlist', label: '2. Doubly Linked List', icon: GitCommit },
            { id: 'stack', label: '3. Cart Stack (LIFO)', icon: Layers },
            { id: 'bst', label: '4. Menu BST Indexer', icon: Binary },
            { id: 'heap', label: '5. Min-Heap Urgency', icon: Zap },
            { id: 'sorting', label: '6. Merge Sort & Search', icon: Cpu },
            { id: 'oop', label: '7. OOP Architecture', icon: BookOpen },
            { id: 'freshness', label: '8. Spoilage Decay & Dynamic Pricing', icon: Sparkles },
            { id: 'zerohunger', label: '9. Zero-Hunger Bipartite Dispatch', icon: ShieldCheck },
            { id: 'multimodal', label: '10. Drone-EV Relay Routing', icon: Network },
            { id: 'knapsack', label: '11. Eco-Nutrient DP Knapsack', icon: Layers }
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shadow-sm ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                    : 'bg-white/5 text-emerald-100 hover:bg-white/10 border border-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================== */}
      {/* TAB 1: GRAPH & DIJKSTRA */}
      {/* ========================================================== */}
      {activeTab === 'graph' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Graph Theory & Shortest Path
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">
                  City Road Network & Dijkstra's Algorithm
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Adjacency List with 16 Sector Nodes. Time Complexity: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-700 font-mono font-bold">O((V + E) log V)</code>.
                </p>
              </div>

              {/* Node Selectors */}
              <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-500">From:</span>
                  <select
                    value={startNode}
                    onChange={(e) => setStartNode(e.target.value)}
                    className="bg-white text-xs font-bold text-slate-800 rounded-lg px-2.5 py-1.5 border border-slate-200"
                  >
                    {graphData?.nodes?.map(n => (
                      <option key={n.id} value={n.id}>{n.id}: {n.name.substring(0, 16)}...</option>
                    ))}
                  </select>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400" />

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-500">To:</span>
                  <select
                    value={targetNode}
                    onChange={(e) => setTargetNode(e.target.value)}
                    className="bg-white text-xs font-bold text-slate-800 rounded-lg px-2.5 py-1.5 border border-slate-200"
                  >
                    {graphData?.nodes?.map(n => (
                      <option key={n.id} value={n.id}>{n.id}: {n.name.substring(0, 16)}...</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleRunDijkstra}
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Run Dijkstra
                </button>
              </div>
            </div>

            {/* Results Display */}
            {dijkstraResult && dijkstraResult.success && (
              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
                    <span className="text-xs text-emerald-700 font-semibold">Total Shortest Distance</span>
                    <div className="text-2xl font-black text-emerald-900 mt-1">{dijkstraResult.totalDistanceKm} km</div>
                    <span className="text-xs text-emerald-600">Optimal EV Route</span>
                  </div>
                  <div className="bg-teal-50 border border-teal-200 p-4 rounded-2xl">
                    <span className="text-xs text-teal-700 font-semibold">Estimated Travel Time</span>
                    <div className="text-2xl font-black text-teal-900 mt-1">{dijkstraResult.estimatedTransitMinutes} mins</div>
                    <span className="text-xs text-teal-600">Avg EV speed ~25 km/h</span>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl">
                    <span className="text-xs text-blue-700 font-semibold">Visited Road Intersections</span>
                    <div className="text-2xl font-black text-blue-900 mt-1">{dijkstraResult.nodesVisitedCount} / 16 Nodes</div>
                    <span className="text-xs text-blue-600">Relaxation Iterations</span>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                    <span className="text-xs text-amber-700 font-semibold">CO2 Emissions Avoided</span>
                    <div className="text-2xl font-black text-amber-900 mt-1">{(dijkstraResult.totalDistanceKm * 0.14).toFixed(2)} kg</div>
                    <span className="text-xs text-amber-600">vs petrol delivery motorbike</span>
                  </div>
                </div>

                {/* Path Nodes Sequence */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Calculated Optimal Node Path
                  </h4>
                  <div className="flex flex-wrap items-center gap-2">
                    {dijkstraResult.path?.map((nodeId, idx) => (
                      <React.Fragment key={nodeId}>
                        <div className="bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="text-xs font-bold text-slate-800">{nodeId}</div>
                            <div className="text-[10px] text-slate-500">
                              {graphData?.nodes?.find(n => n.id === nodeId)?.name || nodeId}
                            </div>
                          </div>
                        </div>
                        {idx < dijkstraResult.path.length - 1 && (
                          <ChevronRight className="w-4 h-4 text-emerald-500" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Intermediate Relaxation Steps Table */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Step-by-Step Priority Queue Relaxations (Viva Examination Proof)
                  </h4>
                  <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-2xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-600 font-bold sticky top-0">
                        <tr>
                          <th className="p-3">Step</th>
                          <th className="p-3">Action</th>
                          <th className="p-3">Description</th>
                          <th className="p-3">Node</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {dijkstraResult.steps?.slice(0, 15).map((step, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-3 font-mono font-bold text-slate-500">#{step.step}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                step.action === 'RELAX_EDGE' ? 'bg-emerald-100 text-emerald-800' :
                                step.action === 'EXTRACT_MIN' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {step.action}
                              </span>
                            </td>
                            <td className="p-3 text-slate-700">{step.description}</td>
                            <td className="p-3 font-mono text-emerald-700 font-bold">{step.currentNode || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 2: DOUBLY LINKED LIST */}
      {/* ========================================================== */}
      {activeTab === 'linkedlist' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Linear Node-Based Structure
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">
                  Order Status Lifecycle (Doubly Linked List)
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Each node maintains <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-700 font-mono">prev</code> and <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-700 font-mono">next</code> pointers enabling <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-700 font-mono font-bold">O(1)</code> bidirectional transitions and audit rollbacks.
                </p>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRevertStage}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition border border-slate-200"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-600" /> Revert (prev pointer)
                </button>
                <button
                  onClick={handleAdvanceStage}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow-sm"
                >
                  <RotateCw className="w-3.5 h-3.5 text-white" /> Advance (next pointer)
                </button>
              </div>
            </div>

            {/* Visual Node Chain */}
            <div className="mt-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3 relative">
                {linkedListState?.stages?.map((stage, idx) => (
                  <div
                    key={stage.stageKey}
                    className={`p-4 rounded-2xl border transition-all relative ${
                      stage.isCurrent
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg scale-105 z-10'
                        : stage.isCompleted
                        ? 'bg-emerald-50 text-slate-800 border-emerald-300'
                        : 'bg-slate-50 text-slate-400 border-slate-200 opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase mb-2">
                      <span>Node #{idx + 1}</span>
                      {stage.isCompleted && !stage.isCurrent && (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                      {stage.isCurrent && (
                        <span className="bg-white/20 text-white text-[9px] px-1.5 py-0.5 rounded">
                          CURRENT
                        </span>
                      )}
                    </div>
                    <div className={`font-bold text-sm ${stage.isCurrent ? 'text-white' : 'text-slate-900'}`}>
                      {stage.title}
                    </div>
                    <p className={`text-[11px] mt-1 ${stage.isCurrent ? 'text-emerald-100' : 'text-slate-500'}`}>
                      {stage.description}
                    </p>
                    <div className="mt-3 pt-2 border-t border-black/10 text-[9px] font-mono flex justify-between">
                      <span>prev: {stage.hasPrev ? 'Node' : 'null'}</span>
                      <span>next: {stage.hasNext ? 'Node' : 'null'}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Data Structure Explanatory Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="font-bold text-slate-800">Doubly Linked List Invariants in FoodLoop:</div>
                <div>• <code className="font-mono text-emerald-700">advanceStage()</code> updates <code className="font-mono">currentNode = currentNode.next</code> in <strong>O(1) time</strong>.</div>
                <div>• <code className="font-mono text-emerald-700">revertStage()</code> audits back via <code className="font-mono">currentNode = currentNode.prev</code> without traversing from head in <strong>O(1) time</strong>.</div>
                <div>• Eliminates database polling overhead during high-concurrency delivery state handoffs.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 3: CART STACK (LIFO) */}
      {/* ========================================================== */}
      {activeTab === 'stack' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  LIFO (Last-In, First-Out)
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">
                  Cart Modification Undo / Redo Engine
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Twin Stack architecture: <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-700 font-mono">UndoStack</code> & <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-700 font-mono">RedoStack</code>. Push & Pop operations execute in <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-700 font-mono font-bold">O(1)</code> time.
                </p>
              </div>

              {/* Interactive Stack Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStackAction('ADD_ITEM')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-sm transition"
                >
                  + Push New Dish
                </button>
                <button
                  onClick={handleStackUndo}
                  disabled={!stackState || stackState.undoSize === 0}
                  className="bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 transition"
                >
                  Undo (Pop from UndoStack)
                </button>
                <button
                  onClick={handleStackRedo}
                  disabled={!stackState || stackState.redoSize === 0}
                  className="bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 transition"
                >
                  Redo (Pop from RedoStack)
                </button>
              </div>
            </div>

            {/* Visual Stacks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Undo Stack */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-emerald-600" /> Undo Stack (Size: {stackState?.undoSize || 0})
                  </h4>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    TOP AT INDEX 0
                  </span>
                </div>

                <div className="space-y-2 min-h-[220px]">
                  {stackState?.undoStack && stackState.undoStack.length > 0 ? (
                    stackState.undoStack.slice(0, 5).map((act, i) => (
                      <div
                        key={act.id || i}
                        className={`p-3 rounded-xl border transition ${
                          i === 0
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-white text-slate-800 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold">{i === 0 ? '👉 [TOP] ' : ''}{act.actionType}</span>
                          <span className={`text-[10px] ${i === 0 ? 'text-emerald-100' : 'text-slate-400'}`}>
                            {new Date(act.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className={`text-xs mt-0.5 ${i === 0 ? 'text-white' : 'text-slate-600'}`}>
                          {act.itemPayload?.name} • ₹{act.itemPayload?.price}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 text-xs py-12">
                      Undo Stack is currently empty.
                    </div>
                  )}
                </div>
              </div>

              {/* Redo Stack */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-600" /> Redo Stack (Size: {stackState?.redoSize || 0})
                  </h4>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                    RECOVERY CACHE
                  </span>
                </div>

                <div className="space-y-2 min-h-[220px]">
                  {stackState?.redoStack && stackState.redoStack.length > 0 ? (
                    stackState.redoStack.slice(0, 5).map((act, i) => (
                      <div key={act.id || i} className="p-3 bg-white text-slate-800 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-blue-700">{act.actionType}</span>
                          <span className="text-[10px] text-slate-400">{new Date(act.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5">
                          {act.itemPayload?.name} • ₹{act.itemPayload?.price}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 text-xs py-12">
                      Redo Stack is empty (perform Undo first).
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 4: BINARY SEARCH TREE (BST) */}
      {/* ========================================================== */}
      {activeTab === 'bst' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Non-Linear Hierarchical Index
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">
                  Menu Price Indexer (Binary Search Tree)
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Keyed on dish price (₹). Supports sub-linear Range Search <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-700 font-mono font-bold">O(K + H)</code> and sorted In-Order Traversal <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-700 font-mono font-bold">O(N)</code>.
                </p>
              </div>

              {/* Range Query Filter */}
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 text-xs">
                <span>Min: ₹</span>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  className="w-16 bg-white border border-slate-200 px-2 py-1 rounded-lg text-xs font-bold"
                />
                <span>Max: ₹</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-16 bg-white border border-slate-200 px-2 py-1 rounded-lg text-xs font-bold"
                />
                <button
                  onClick={handleRunBstRange}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl shadow-sm transition"
                >
                  Filter Range
                </button>
              </div>
            </div>

            {/* Tree Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                <span className="text-xs text-emerald-700 font-semibold">Total Dishes Indexed</span>
                <div className="text-2xl font-black text-emerald-900 mt-1">{bstState?.totalDishesIndexed || 0}</div>
              </div>
              <div className="bg-teal-50 p-4 rounded-2xl border border-teal-200">
                <span className="text-xs text-teal-700 font-semibold">Unique Price Nodes</span>
                <div className="text-2xl font-black text-teal-900 mt-1">{bstState?.uniquePriceNodes || 0}</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
                <span className="text-xs text-blue-700 font-semibold">Lowest Price in BST</span>
                <div className="text-2xl font-black text-blue-900 mt-1">₹{bstState?.minPriceItem?.price || 0}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200">
                <span className="text-xs text-purple-700 font-semibold">Highest Price in BST</span>
                <div className="text-2xl font-black text-purple-900 mt-1">₹{bstState?.maxPriceItem?.price || 0}</div>
              </div>
            </div>

            {/* Range Query Output */}
            {bstRangeResult && (
              <div className="mt-6 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Range Query Results [₹{bstRangeResult.minPrice} - ₹{bstRangeResult.maxPrice}]:</span>
                  <span className="text-emerald-700">Pruning efficiency: Visited {bstRangeResult.nodesVisitedCount} nodes to find {bstRangeResult.totalMatched} dishes!</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {bstRangeResult.items?.slice(0, 6).map((item, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-xs">
                      <div className="font-bold text-slate-800">{item.name}</div>
                      <div className="text-emerald-600 font-bold mt-1">₹{item.price} • {item.category}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 5: MIN-HEAP SURPLUS URGENCY */}
      {/* ========================================================== */}
      {activeTab === 'heap' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
            <div className="pb-6 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                Complete Binary Tree (Min-Heap)
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-2">
                Food Rescue Urgency Min-Heap (SDG 12)
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Prioritizes expiring surplus meals. Root of heap is always the deal expiring earliest. <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-700 font-mono font-bold">O(log N)</code> insertion and extraction.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {heapState?.prioritizedDeals?.slice(0, 6).map((deal, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 relative">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-mono font-bold text-emerald-700">Heap Rank #{idx + 1}</span>
                      <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        {deal.minutesRemaining} mins left
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-sm">{deal.name}</div>
                    <div className="text-xs text-slate-500 mt-1">{deal.restaurantName}</div>
                    <div className="mt-3 pt-2 border-t border-slate-200 flex justify-between text-xs">
                      <span className="text-slate-400 line-through">₹{deal.price}</span>
                      <span className="text-emerald-700 font-black">₹{deal.discountedPrice} ({deal.discountPercent}% OFF)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 6: SORTING & SEARCHING BENCHMARK */}
      {/* ========================================================== */}
      {activeTab === 'sorting' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Algorithm Analysis
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">
                  Merge Sort vs Binary Search vs Linear Search
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Empirical time and comparisons counter for JIIT Data Structures Lab evaluation.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRunSort('rating')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition"
                >
                  Merge Sort by Rating
                </button>
                <button
                  onClick={() => handleRunSort('delivery_time')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 transition"
                >
                  Merge Sort by Time
                </button>
              </div>
            </div>

            {/* Search Benchmark */}
            <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search restaurant name..."
                  className="bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold flex-1"
                />
                <button
                  onClick={handleRunSearch}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                >
                  Compare Binary vs Linear Search
                </button>
              </div>

              {searchResult && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                    <div className="text-xs font-bold text-emerald-800 uppercase">Binary Search (Sorted Array)</div>
                    <div className="text-lg font-black text-emerald-950 mt-1">
                      {searchResult.binarySearch?.comparisons} Comparisons (O(log N))
                    </div>
                    <div className="text-xs text-emerald-700 mt-1">
                      Execution Time: {searchResult.binarySearch?.executionTimeMs} ms
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
                    <div className="text-xs font-bold text-amber-800 uppercase">Linear Search (Unsorted)</div>
                    <div className="text-lg font-black text-amber-950 mt-1">
                      {searchResult.linearSearch?.comparisons} Comparisons (O(N))
                    </div>
                    <div className="text-xs text-amber-700 mt-1">
                      Execution Time: {searchResult.linearSearch?.executionTimeMs} ms
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 7: OOP ARCHITECTURE */}
      {/* ========================================================== */}
      {activeTab === 'oop' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
            <div className="pb-6 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                Object-Oriented Design
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-2">
                OOP Class Hierarchy & Polymorphism Inspector
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Evaluates Encapsulation (private # fields), Inheritance, and Polymorphic Method Overriding.
              </p>
            </div>

            <div className="mt-6 space-y-6">
              {/* OOP Tenets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="font-bold text-emerald-900 uppercase">1. Encapsulation</div>
                  <div className="text-slate-600 mt-1">Private ES2022 (#) fields guard sensitive prices, eco-points & state behind accessors.</div>
                </div>
                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs">
                  <div className="font-bold text-teal-900 uppercase">2. Inheritance</div>
                  <div className="text-slate-600 mt-1">CustomerUser, OwnerUser & CourierUser extend abstract BaseUser with shared ID & timestamps.</div>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs">
                  <div className="font-bold text-blue-900 uppercase">3. Polymorphism</div>
                  <div className="text-slate-600 mt-1">calculateFinalPrice() & getEcoImpactScore() behave dynamically based on deal classification.</div>
                </div>
                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-xs">
                  <div className="font-bold text-purple-900 uppercase">4. Abstraction</div>
                  <div className="text-slate-600 mt-1">High-level client APIs interact with order pipelines without knowing inner heap/pointer logic.</div>
                </div>
              </div>

              {/* Polymorphic Dishes Demonstration */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                  Polymorphic Behavior in Action (calculateFinalPrice & getEcoImpactScore)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {oopData?.polymorphicDishes?.map((dish, i) => (
                    <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-900">{dish.name}</span>
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">
                          {dish.itemDetails?.type}
                        </span>
                      </div>
                      <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                        <div>Base Price: <strong>₹{dish.basePrice}</strong></div>
                        <div>Polymorphic Final Price (with eco packaging): <strong className="text-emerald-700">₹{dish.finalPriceWithEcoPackaging}</strong></div>
                        <div>Polymorphic Eco Impact Score: <strong className="text-teal-700">{dish.ecoImpactScore} pts</strong></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 8: MICROBIAL FRESHNESS DECAY & DYNAMIC PRICING */}
      {/* ========================================================== */}
      {activeTab === 'freshness' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
                    Thermodynamic Arrhenius Kinetics + Segment Tree
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                    Zero-Waste Dynamic Pricing
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">
                  Continuous Microbial Freshness Decay & Asymptotic Pricing
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Replaces arbitrary food expiration with real-time biological bacterial growth models. Automatically adjusts consumer price along an exponential markdown curve: <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-700 font-mono font-bold">P(t) = Floor + (Base - Floor) * e^(-lambda*t)</code>.
                </p>
              </div>

              {/* Interactive Controls */}
              <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <span className="font-bold text-slate-600 block mb-1">Time Elapsed: {freshnessMinutes} mins</span>
                  <input
                    type="range"
                    min="15"
                    max="240"
                    step="15"
                    value={freshnessMinutes}
                    onChange={(e) => setFreshnessMinutes(Number(e.target.value))}
                    className="w-36 accent-emerald-600 cursor-pointer"
                  />
                </div>
                <div>
                  <span className="font-bold text-slate-600 block mb-1">Storage Condition</span>
                  <select
                    value={storageType}
                    onChange={(e) => setStorageType(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-800"
                  >
                    <option value="thermal_insulated">Thermal Insulated Bag (~60°C)</option>
                    <option value="ambient">Ambient Open Air (~32°C)</option>
                    <option value="refrigerated">Cold-Chain Chill (~4°C)</option>
                  </select>
                </div>
                <button
                  onClick={handleRunFreshness}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl shadow-sm self-end transition"
                >
                  Recalculate
                </button>
              </div>
            </div>

            {/* Results Display */}
            {freshnessResult && (
              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
                    <span className="text-xs text-emerald-700 font-semibold">Live Dynamic Price</span>
                    <div className="text-3xl font-black text-emerald-900 mt-1">₹{freshnessResult.dynamicPrice}</div>
                    <span className="text-xs text-emerald-600 font-bold">Base: ₹{freshnessResult.basePrice} ({freshnessResult.discountPercent}% OFF)</span>
                  </div>

                  <div className={`p-4 rounded-2xl border ${
                    freshnessResult.freshnessIndex > 65 ? 'bg-teal-50 border-teal-200 text-teal-900' :
                    freshnessResult.freshnessIndex > 35 ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}>
                    <span className="text-xs font-semibold">Biological Freshness Index</span>
                    <div className="text-3xl font-black mt-1">{freshnessResult.freshnessIndex}%</div>
                    <span className="text-xs font-bold">{freshnessResult.status.replace(/_/g, ' ')}</span>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl">
                    <span className="text-xs text-blue-700 font-semibold">Estimated Microbial Count</span>
                    <div className="text-3xl font-black text-blue-900 mt-1">10^{freshnessResult.estimatedLogCFU} <span className="text-xs font-normal">CFU/g</span></div>
                    <span className="text-xs text-blue-600 font-bold">Safe Limit &lt; 10^5.0 CFU/g</span>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl">
                    <span className="text-xs text-purple-700 font-semibold">FSSAI Safe Surplus Certified</span>
                    <div className="text-2xl font-black text-purple-900 mt-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-6 h-6 text-purple-600" />
                      {freshnessResult.isFSSAICertifiedSafe ? 'VERIFIED SAFE' : 'EXPIRED'}
                    </div>
                    <span className="text-xs text-purple-600">Zero-Contamination Guarantee</span>
                  </div>
                </div>

                {/* 6-Point Forecast Table */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Dynamic Price Markdown Schedule (Segment Tree Range Forecast)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                    {freshnessResult.curvePoints?.map((pt, i) => (
                      <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                        <div className="text-xs font-bold text-slate-500">T + {pt.minute} mins</div>
                        <div className="text-lg font-black text-slate-800 mt-1">₹{pt.price}</div>
                        <div className="text-xs font-bold text-emerald-600">{pt.discountPercent}% OFF</div>
                        <div className="text-[10px] text-slate-400 mt-1">{pt.freshnessPercent}% Fresh</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 9: ZERO-HUNGER EMERGENCY DISPATCH (BIPARTITE MATCHING & DSU) */}
      {/* ========================================================== */}
      {activeTab === 'zerohunger' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
                  SDG 2: Zero Hunger & Bipartite Graph Matching
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">
                  Emergency Shelter Surplus Dispatch & DSU Clustering
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  When commercial surplus reaches 45 mins before shelf-life cutoff, the platform automatically triggers zero-cost dispatch to partner orphanages and shelters using Disjoint Set Union (DSU) clustering and Maximum-Weight Bipartite Matching.
                </p>
              </div>

              <button
                onClick={handleRunZeroHunger}
                className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition"
              >
                <Zap className="w-3.5 h-3.5" /> Re-compute Bipartite Matching
              </button>
            </div>

            {zeroHungerResult && (
              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl">
                    <span className="text-xs text-orange-800 font-semibold">Total Meals Dispatched</span>
                    <div className="text-3xl font-black text-orange-950 mt-1">{zeroHungerResult.totalMealsDispatched} Portions</div>
                    <span className="text-xs text-orange-700">100% Free Humanitarian Drop</span>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
                    <span className="text-xs text-emerald-800 font-semibold">Beneficiaries Fed Tonight</span>
                    <div className="text-3xl font-black text-emerald-950 mt-1">{zeroHungerResult.totalPeopleFed} Individuals</div>
                    <span className="text-xs text-emerald-700">In Shelters & Care Homes</span>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl">
                    <span className="text-xs text-blue-800 font-semibold">Landfill CO2 Averted</span>
                    <div className="text-3xl font-black text-blue-950 mt-1">{zeroHungerResult.totalCO2PreventedKg} kg CO2e</div>
                    <span className="text-xs text-blue-700">Zero Organic Waste</span>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl">
                    <span className="text-xs text-purple-800 font-semibold">DSU Relief Cells</span>
                    <div className="text-3xl font-black text-purple-950 mt-1">{zeroHungerResult.dsuClusterCount} Pods</div>
                    <span className="text-xs text-purple-700">Disjoint Set Union Clustered</span>
                  </div>
                </div>

                {/* Bipartite Matches Table */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Optimal Bipartite Allocations (Kitchens ➔ Shelters)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {zeroHungerResult.matches?.map((m, idx) => (
                      <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-900">{m.donorKitchen}</span>
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px]">
                            {m.portionsMatched} Meals Allocated
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <ArrowRight className="w-3.5 h-3.5 text-orange-500" />
                          <span className="font-bold text-slate-800">{m.beneficiaryShelter}</span>
                        </div>
                        <div className="pt-2 border-t border-slate-200 flex justify-between text-[11px] text-slate-500">
                          <span>{m.dietaryType}</span>
                          <span className="text-emerald-700 font-semibold">{m.co2PreventedKg} kg CO2 saved</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 10: MULTI-MODAL DRONE-EV RELAY ROUTING */}
      {/* ========================================================== */}
      {activeTab === 'multimodal' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                  SDG 9: Industry & Multi-Modal Transit Graph
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">
                  Multi-Modal Drone-to-EV Courier Relay Routing
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Combines high-speed low-altitude drone air corridors with automated solar locker handshakes and last-mile electric scooters.
                </p>
              </div>

              <button
                onClick={handleRunMultimodal}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Re-calculate Relay Route
              </button>
            </div>

            {multimodalResult && (
              <div className="mt-6 space-y-6">
                {/* 3-Leg Relay Progression Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {multimodalResult.legs?.map((leg) => (
                    <div key={leg.legNumber} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 relative">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-indigo-700">LEG {leg.legNumber}</span>
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                          {leg.durationMinutes} mins
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-sm">{leg.mode.replace(/_/g, ' ')}</div>
                      <p className="text-xs text-slate-500">
                        {leg.from ? `${leg.from} ➔ ${leg.to}` : leg.hubName}
                      </p>
                      <div className="pt-2 border-t border-slate-200 text-[11px] text-emerald-700 font-semibold">
                        {leg.speedKmH ? `${leg.speedKmH} km/h • ${leg.distanceKm} km` : leg.status}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Direct Comparison: Petrol Motorbike vs FoodLoop Drone Relay */}
                <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-2xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-4">
                    Head-to-Head Performance Benchmark: FoodLoop Drone-EV Relay vs. Traditional Petrol Motorbike
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
                    <div className="bg-white/10 p-3 rounded-xl">
                      <div className="text-xs text-slate-300">Total Delivery Time</div>
                      <div className="text-2xl font-black text-emerald-400 mt-1">
                        {multimodalResult.comparison?.foodLoopDroneRelay?.totalTimeMinutes} mins
                      </div>
                      <div className="text-[10px] text-slate-400">vs {multimodalResult.comparison?.traditionalPetrolMotorbike?.totalTimeMinutes} mins (Motorbike)</div>
                    </div>

                    <div className="bg-white/10 p-3 rounded-xl">
                      <div className="text-xs text-slate-300">Time Saved per Trip</div>
                      <div className="text-2xl font-black text-teal-300 mt-1">
                        {multimodalResult.comparison?.foodLoopDroneRelay?.timeSavedMinutes} mins
                      </div>
                      <div className="text-[10px] text-teal-200">
                        {multimodalResult.comparison?.foodLoopDroneRelay?.efficiencyGainPercent}% Faster
                      </div>
                    </div>

                    <div className="bg-white/10 p-3 rounded-xl">
                      <div className="text-xs text-slate-300">CO2 Emissions Avoided</div>
                      <div className="text-2xl font-black text-emerald-400 mt-1">
                        {multimodalResult.comparison?.foodLoopDroneRelay?.co2AvoidedGrams} g
                      </div>
                      <div className="text-[10px] text-slate-400">Near-Zero Carbon Footprint</div>
                    </div>

                    <div className="bg-white/10 p-3 rounded-xl">
                      <div className="text-xs text-slate-300">Traffic Congestion Risk</div>
                      <div className="text-2xl font-black text-indigo-300 mt-1">0%</div>
                      <div className="text-[10px] text-indigo-200">Skyway Express Corridor</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 11: ECO-NUTRIENT DP KNAPSACK MEAL SYNTHESIZER */}
      {/* ========================================================== */}
      {activeTab === 'knapsack' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Dynamic Programming: Multi-Dimensional 0/1 Knapsack
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">
                  Nutrient-Carbon Pareto Frontier Meal Synthesizer
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Solves a multi-constraint optimization problem via DP memoization: Maximizes protein & utility while guaranteeing the total meal cost is within your financial budget and strictly capping carbon emissions.
                </p>
              </div>

              {/* Budget Controller */}
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-600">Student Budget Cap: ₹</span>
                <input
                  type="number"
                  value={knapsackBudget}
                  onChange={(e) => setKnapsackBudget(Number(e.target.value))}
                  className="w-20 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg font-bold text-slate-800"
                />
                <button
                  onClick={handleRunKnapsack}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl shadow-sm transition"
                >
                  Synthesize Meal
                </button>
              </div>
            </div>

            {knapsackResult && knapsackResult.optimalMealSet && (
              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
                    <span className="text-xs text-emerald-700 font-semibold">Total Meal Cost</span>
                    <div className="text-3xl font-black text-emerald-900 mt-1">
                      ₹{knapsackResult.optimalMealSet.totalCost}
                    </div>
                    <span className="text-xs text-emerald-600">Within ₹{knapsackResult.targetBudget} cap</span>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl">
                    <span className="text-xs text-blue-700 font-semibold">Total Clean Protein</span>
                    <div className="text-3xl font-black text-blue-900 mt-1">
                      {knapsackResult.optimalMealSet.totalProteinGrams} g
                    </div>
                    <span className="text-xs text-blue-600">High-Density Nutrition</span>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                    <span className="text-xs text-amber-700 font-semibold">Total Energy</span>
                    <div className="text-3xl font-black text-amber-900 mt-1">
                      {knapsackResult.optimalMealSet.totalCalories} kcal
                    </div>
                    <span className="text-xs text-amber-600">Optimal Daily Ratio</span>
                  </div>

                  <div className="bg-teal-50 border border-teal-200 p-4 rounded-2xl">
                    <span className="text-xs text-teal-700 font-semibold">Carbon Footprint</span>
                    <div className="text-3xl font-black text-teal-900 mt-1">
                      {knapsackResult.optimalMealSet.totalCarbonFootprintKg} kg
                    </div>
                    <span className="text-xs text-teal-600 font-bold">100% Carbon-Budget Compliant</span>
                  </div>
                </div>

                {/* Selected Dishes in Knapsack */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    DP Knapsack Optimal Backtracked Meal Items:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {knapsackResult.optimalMealSet.items?.map((item, idx) => (
                      <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                        <div className="flex items-center justify-between font-bold text-slate-800">
                          <span>{item.name}</span>
                          <span className="text-emerald-700">₹{item.price}</span>
                        </div>
                        <div className="mt-2 text-slate-500 flex justify-between">
                          <span>{item.protein}g Protein</span>
                          <span>{item.calories} kcal</span>
                          <span className="text-teal-700 font-semibold">{item.carbonKg} kg CO2</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600">
                  <strong>Complexity Proof for Lab Viva:</strong> {knapsackResult.timeComplexity} | {knapsackResult.spaceComplexity}.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

