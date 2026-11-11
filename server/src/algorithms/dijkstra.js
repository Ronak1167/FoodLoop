import { MinPriorityQueue } from './priorityQueue.js';
import { roadNetwork } from './roadGraph.js';

/**
 * Executes Dijkstra's Shortest Path Algorithm on the delivery road graph.
 * 
 * Time Complexity: O((V + E) log V) where V is the number of road intersections
 *                  and E is the number of road segments.
 * Space Complexity: O(V + E) for the adjacency list, min-priority queue and distance array.
 * 
 * @param {string} startNodeId - Source node ID (e.g., 'N1')
 * @param {string} targetNodeId - Destination node ID (e.g., 'N7')
 * @param {boolean} trackSteps - Whether to log intermediate states for the DSA Lab
 */
export function dijkstraShortestPath(startNodeId, targetNodeId, trackSteps = true) {
  const allNodes = roadNetwork.getAllNodes();
  const nodeMap = roadNetwork.nodes;

  if (!nodeMap[startNodeId] || !nodeMap[targetNodeId]) {
    return {
      success: false,
      error: `Invalid node: start '${startNodeId}' or target '${targetNodeId}' does not exist in the road graph.`
    };
  }

  const distances = {};
  const previous = {};
  const edgeUsed = {};
  const visited = new Set();
  const steps = [];

  // 1. Initialize distances to infinity and start node to 0
  for (const node of allNodes) {
    distances[node.id] = Infinity;
    previous[node.id] = null;
    edgeUsed[node.id] = null;
  }
  distances[startNodeId] = 0;

  // 2. Initialize Min-Priority Queue
  const pq = new MinPriorityQueue();
  pq.insert(startNodeId, 0);

  if (trackSteps) {
    steps.push({
      step: 1,
      action: 'INITIALIZE',
      description: `Initialized distance table. Set dist[${startNodeId}] = 0, all other nodes = ∞. Enqueued source node ${startNodeId} into Min-Priority Queue.`,
      currentNode: startNodeId,
      pqState: pq.getHeapSnapshot(),
      distancesSnapshot: { ...distances }
    });
  }

  let stepCount = 1;

  // 3. Process the priority queue
  while (!pq.isEmpty()) {
    const minItem = pq.extractMin();
    const u = minItem.element;
    const currentDist = minItem.priority;

    if (visited.has(u)) continue;
    visited.add(u);

    const neighbors = roadNetwork.getNeighbors(u);
    const relaxationEvents = [];

    // Relaxation step for each neighbor edge (u -> v)
    for (const edge of neighbors) {
      const v = edge.node;
      const weight = edge.distance;

      if (!visited.has(v)) {
        const potentialDist = Number((currentDist + weight).toFixed(2));
        if (potentialDist < distances[v]) {
          const oldDist = distances[v];
          distances[v] = potentialDist;
          previous[v] = u;
          edgeUsed[v] = edge;
          pq.insert(v, potentialDist);

          relaxationEvents.push({
            neighbor: v,
            neighborName: nodeMap[v]?.name || v,
            road: edge.roadName,
            roadDistance: weight,
            oldDistance: oldDist === Infinity ? '∞' : oldDist,
            newDistance: potentialDist,
            relaxed: true
          });
        } else {
          relaxationEvents.push({
            neighbor: v,
            neighborName: nodeMap[v]?.name || v,
            road: edge.roadName,
            roadDistance: weight,
            oldDistance: distances[v],
            newDistance: potentialDist,
            relaxed: false
          });
        }
      }
    }

    stepCount++;
    if (trackSteps) {
      steps.push({
        step: stepCount,
        action: 'EXTRACT_MIN & RELAX',
        description: `Extracted node ${u} (${nodeMap[u]?.name}) with minimum tentative distance ${currentDist} km. Checked ${neighbors.length} outgoing roads. Relaxed ${relaxationEvents.filter(e => e.relaxed).length} neighbor distances.`,
        currentNode: u,
        currentNodeName: nodeMap[u]?.name,
        currentDistance: currentDist,
        relaxationEvents,
        pqState: pq.getHeapSnapshot(),
        distancesSnapshot: { ...distances }
      });
    }

    // Early termination if target reached
    if (u === targetNodeId) {
      break;
    }
  }

  // 4. Check reachability
  if (distances[targetNodeId] === Infinity) {
    return {
      success: false,
      reachable: false,
      message: `No connected route exists between ${nodeMap[startNodeId].name} and ${nodeMap[targetNodeId].name}.`,
      startNode: nodeMap[startNodeId],
      targetNode: nodeMap[targetNodeId],
      steps,
      timeComplexity: 'O((V + E) log V)',
      spaceComplexity: 'O(V + E)'
    };
  }

  // 5. Reconstruct shortest path from target backwards to start
  const path = [];
  const segments = [];
  let curr = targetNodeId;

  while (curr !== null) {
    path.unshift(curr);
    const prevNode = previous[curr];
    if (prevNode) {
      const edge = edgeUsed[curr];
      segments.unshift({
        from: prevNode,
        fromName: nodeMap[prevNode].name,
        to: curr,
        toName: nodeMap[curr].name,
        roadName: edge?.roadName || 'Connecting Arterial',
        roadType: edge?.roadType || 'Road',
        distance: edge?.distance || 0
      });
    }
    curr = prevNode;
  }

  const totalDistance = Number(distances[targetNodeId].toFixed(2));
  // Average EV speed ~26 km/h in city traffic + 3 min fixed dispatch buffer
  const estimatedMinutes = Math.max(5, Math.round((totalDistance / 26) * 60 + 3));

  const waypoints = path.map(nodeId => ({
    id: nodeId,
    name: nodeMap[nodeId].name,
    coords: nodeMap[nodeId].coords,
    type: nodeMap[nodeId].type
  }));

  return {
    success: true,
    reachable: true,
    source: nodeMap[startNodeId],
    destination: nodeMap[targetNodeId],
    totalDistanceKm: totalDistance,
    estimatedMinutes,
    path,
    waypoints,
    segments,
    nodesVisitedCount: visited.size,
    totalStepsCount: steps.length,
    steps: trackSteps ? steps : [],
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V + E)'
  };
}
