/**
 * Delivery Road Network Graph represented as an Adjacency List.
 * Represents a smart city road grid with distance (km), road names, and transit attributes.
 */

export const GRAPH_NODES = {
  N1: { id: 'N1', name: 'DLF Cyber City Hub', coords: [77.088, 28.495], type: 'Tech & Commercial' },
  N2: { id: 'N2', name: 'Galleria Market & DLF 4', coords: [77.086, 28.471], type: 'Commercial Plaza' },
  N3: { id: 'N3', name: 'Golf Course Road North', coords: [77.098, 28.468], type: 'Arterial Corridor' },
  N4: { id: 'N4', name: 'Sector 29 Food Hub', coords: [77.062, 28.468], type: 'Culinary Central' },
  N5: { id: 'N5', name: 'MG Road Metro Junction', coords: [77.080, 28.482], type: 'Transit Hub' },
  N6: { id: 'N6', name: 'DLF Phase 1 Green Park', coords: [77.102, 28.483], type: 'Residential' },
  N7: { id: 'N7', name: 'Sushant Lok 1 Center', coords: [77.076, 28.460], type: 'Residential & Retail' },
  N8: { id: 'N8', name: 'Sector 43 Millennium Hub', coords: [77.068, 28.455], type: 'Metro Terminal' },
  N9: { id: 'N9', name: 'Golf Course Ext Road', coords: [77.095, 28.435], type: 'Expressway' },
  N10: { id: 'N10', name: 'Sector 54 Rapid Metro', coords: [77.112, 28.448], type: 'High Street' },
  N11: { id: 'N11', name: 'Sector 56 Terminal South', coords: [77.110, 28.428], type: 'Residential' },
  N12: { id: 'N12', name: 'Ardee City & Sector 52', coords: [77.082, 28.442], type: 'Residential' },
  N13: { id: 'N13', name: 'Sohna Road Tech Park', coords: [77.042, 28.425], type: 'IT Park' },
  N14: { id: 'N14', name: 'Sector 14 Heritage Market', coords: [77.045, 28.478], type: 'Old Market' },
  N15: { id: 'N15', name: 'Udyog Vihar Green Phase', coords: [77.078, 28.508], type: 'Industrial & EV' },
  N16: { id: 'N16', name: 'Ambience Island North', coords: [77.096, 28.505], type: 'Eco Corridor' }
};

// Raw weighted edges list: [from, to, distanceKm, roadName, roadType]
export const ROAD_EDGES = [
  // Cyber City Cluster
  ['N1', 'N15', 1.8, 'Udyog Vihar Connector', 'EV Green Lane'],
  ['N1', 'N16', 1.5, 'Cyber Link Expressway', 'Main Arterial'],
  ['N1', 'N5', 2.1, 'MG Road Northway', 'Flyover'],
  ['N15', 'N16', 1.6, 'Northern Peripheral Link', 'Ring Road'],
  ['N15', 'N14', 3.4, 'Old Delhi-Gurugram Road', 'Arterial'],

  // Central Commercial Belt
  ['N5', 'N2', 1.9, 'Galleria Boulevard', 'Sector Road'],
  ['N5', 'N6', 2.0, 'Silver Oaks Avenue', 'Tree-Lined Sector Way'],
  ['N5', 'N4', 2.3, 'Leisure Valley Road', 'Commercial Arterial'],
  ['N2', 'N3', 1.4, 'Hamilton Court Way', 'Avenue'],
  ['N2', 'N7', 1.6, 'Sushant Lok Cross Road', 'Sub-Arterial'],
  ['N4', 'N7', 1.9, 'Kessel Daak Marg', 'City Road'],
  ['N4', 'N8', 1.8, 'Appu Ghar Marg', 'Main Road'],
  ['N4', 'N14', 2.6, 'Sector 14-29 Link Road', 'Arterial'],

  // Golf Course Corridor
  ['N6', 'N3', 2.2, 'Golf Course Underpass', 'Express Corridor'],
  ['N3', 'N10', 2.6, 'Golf Course Rapid Transit Road', 'EV Priority Lane'],
  ['N3', 'N7', 2.1, 'DLF Phase 4 Inner Ring', 'Sector Road'],
  ['N7', 'N12', 2.4, 'Wazirabad Sector Road', 'Avenue'],
  ['N8', 'N12', 2.2, 'Sector 43-52 Link', 'Avenue'],
  ['N8', 'N13', 4.1, 'Subhash Chowk Connector', 'Arterial'],

  // Southern Extension
  ['N10', 'N11', 2.4, 'Sector 54-56 Metro Way', 'Green Transit Road'],
  ['N10', 'N9', 2.0, 'AIL Way South', 'Sector Road'],
  ['N12', 'N9', 1.9, 'Ardee South Extension', 'Main Road'],
  ['N9', 'N11', 2.3, 'Golf Course Ext Expressway', 'Wide Expressway'],
  ['N9', 'N13', 4.2, 'Southern Peripheral Road (SPR)', 'Highway Corridor'],
  ['N12', 'N13', 3.8, 'Vikas Marg South', 'Arterial'],

  // Isolated / Distant Edge for testing unreachable / far nodes
  ['N14', 'N13', 5.5, 'NH-48 Service Expressway', 'National Highway']
];

class RoadNetworkGraph {
  constructor() {
    this.adjacencyList = new Map();
    this.nodes = GRAPH_NODES;
    this.edges = ROAD_EDGES;
    this.init();
  }

  init() {
    // Initialize empty adjacency lists for each node
    for (const nodeId of Object.keys(this.nodes)) {
      this.adjacencyList.set(nodeId, []);
    }

    // Populate bidirectional weighted edges
    for (const [u, v, weight, roadName, roadType] of this.edges) {
      if (this.adjacencyList.has(u) && this.adjacencyList.has(v)) {
        this.adjacencyList.get(u).push({
          node: v,
          distance: weight,
          roadName,
          roadType
        });
        this.adjacencyList.get(v).push({
          node: u,
          distance: weight,
          roadName,
          roadType
        });
      }
    }
  }

  getNeighbors(nodeId) {
    return this.adjacencyList.get(nodeId) || [];
  }

  getAllNodes() {
    return Object.values(this.nodes);
  }

  getNode(nodeId) {
    return this.nodes[nodeId] || null;
  }

  /**
   * Finds the nearest node in the road network given [lng, lat] coordinates.
   */
  getNearestNode(coords) {
    if (!coords || !Array.isArray(coords) || coords.length < 2) {
      return this.nodes['N2']; // Default fallback
    }

    const [lng, lat] = coords;
    let minDistanceSq = Infinity;
    let nearest = this.nodes['N2'];

    for (const node of Object.values(this.nodes)) {
      const [nLng, nLat] = node.coords;
      const dLng = lng - nLng;
      const dLat = lat - nLat;
      const distSq = dLng * dLng + dLat * dLat;
      if (distSq < minDistanceSq) {
        minDistanceSq = distSq;
        nearest = node;
      }
    }
    return nearest;
  }
}

export const roadNetwork = new RoadNetworkGraph();
