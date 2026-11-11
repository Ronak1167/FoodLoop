const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('foodloop_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || `API Error: ${res.statusText}`);
    }

    return data;
  } catch (err) {
    console.error(`Error requesting ${endpoint}:`, err.message);
    throw err;
  }
}

export const api = {
  // Auth
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => apiRequest('/auth/me'),
  updateProfile: (data) => apiRequest('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Restaurants
  getRestaurants: (params = '') => apiRequest(`/restaurants${params ? `?${params}` : ''}`),
  getRestaurantById: (id) => apiRequest(`/restaurants/${id}`),
  getMyRestaurant: () => apiRequest('/restaurants/my/profile'),
  updateMyRestaurant: (data) => apiRequest('/restaurants/my/profile', { method: 'PUT', body: JSON.stringify(data) }),
  getMyAnalytics: () => apiRequest('/restaurants/my/analytics'),
  createMenuItem: (data) => apiRequest('/restaurants/menu-items', { method: 'POST', body: JSON.stringify(data) }),
  updateMenuItem: (id, data) => apiRequest(`/restaurants/menu-items/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMenuItem: (id) => apiRequest(`/restaurants/menu-items/${id}`, { method: 'DELETE' }),

  // Food Rescue Deals
  getSurplusDeals: (params = '') => apiRequest(`/rescue/deals${params ? `?${params}` : ''}`),
  getRescueStats: () => apiRequest('/rescue/stats'),

  // Smart Recommendations
  getRecommendations: (params = '') => apiRequest(`/recommendations${params ? `?${params}` : ''}`),

  // Orders
  createOrder: (orderData) => apiRequest('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  getMyOrders: () => apiRequest('/orders/my'),
  getRestaurantOrders: () => apiRequest('/orders/restaurant'),
  getOrderById: (id) => apiRequest(`/orders/${id}`),
  updateOrderStatus: (id, status, note) => apiRequest(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, note }) }),
  addReview: (orderId, reviewData) => apiRequest(`/orders/${orderId}/review`, { method: 'POST', body: JSON.stringify(reviewData) }),

  // Group Ordering
  createGroupOrder: (data) => apiRequest('/group-orders/create', { method: 'POST', body: JSON.stringify(data) }),
  getGroupByCode: (code) => apiRequest(`/group-orders/${code}`),
  joinGroupOrder: (code, data) => apiRequest(`/group-orders/${code}/join`, { method: 'POST', body: JSON.stringify(data) }),
  addItemToGroup: (code, data) => apiRequest(`/group-orders/${code}/items`, { method: 'POST', body: JSON.stringify(data) }),
  removeItemFromGroup: (code, data) => apiRequest(`/group-orders/${code}/items`, { method: 'DELETE', body: JSON.stringify(data) }),
  toggleSplitMethod: (code, splitMethod) => apiRequest(`/group-orders/${code}/split-method`, { method: 'POST', body: JSON.stringify({ splitMethod }) }),
  checkoutGroupOrder: (code, data) => apiRequest(`/group-orders/${code}/checkout`, { method: 'POST', body: JSON.stringify(data) }),

  // Delivery
  getAvailableDeliveries: () => apiRequest('/delivery/available'),
  getMyDeliveries: () => apiRequest('/delivery/my'),
  acceptDelivery: (orderId) => apiRequest(`/delivery/orders/${orderId}/accept`, { method: 'POST' }),
  updatePartnerLocation: (orderId, coords) => apiRequest(`/delivery/orders/${orderId}/location`, { method: 'POST', body: JSON.stringify(coords) }),

  // Admin
  getAdminAnalytics: () => apiRequest('/admin/analytics'),
  getAdminUsers: () => apiRequest('/admin/users'),
  getAdminRestaurants: () => apiRequest('/admin/restaurants'),
  toggleRestaurantStatus: (id, status) => apiRequest(`/admin/restaurants/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  getAdminOrders: () => apiRequest('/admin/orders'),
  getCategories: () => apiRequest('/admin/categories'),
  addCategory: (data) => apiRequest('/admin/categories', { method: 'POST', body: JSON.stringify(data) }),

  // ==========================================
  // DSA LAB & ALGORITHMS EVALUATION APIS
  // ==========================================
  getDsaSummary: () => apiRequest('/dsa/summary'),
  getRoadGraph: () => apiRequest('/dsa/graph'),
  runDijkstra: (data) => apiRequest('/dsa/dijkstra', { method: 'POST', body: JSON.stringify(data) }),
  runPartnerAllocation: (data) => apiRequest('/dsa/partner-allocation', { method: 'POST', body: JSON.stringify(data) }),
  runMergeSort: (data) => apiRequest('/dsa/sort', { method: 'POST', body: JSON.stringify(data) }),
  runSearchBenchmark: (data) => apiRequest('/dsa/search', { method: 'POST', body: JSON.stringify(data) }),
  getOrderQueueState: () => apiRequest('/dsa/order-queue'),
  getSurplusHeapState: () => apiRequest('/dsa/surplus-heap'),
  getRecommendationHash: (data) => apiRequest('/dsa/recommendations', { method: 'POST', body: JSON.stringify(data) }),
  getLinkedListState: () => apiRequest('/dsa/linked-list'),
  advanceLinkedList: () => apiRequest('/dsa/linked-list/advance', { method: 'POST' }),
  revertLinkedList: () => apiRequest('/dsa/linked-list/revert', { method: 'POST' }),
  getStackState: () => apiRequest('/dsa/stack'),
  recordStackAction: (data) => apiRequest('/dsa/stack/record', { method: 'POST', body: JSON.stringify(data) }),
  undoStackAction: () => apiRequest('/dsa/stack/undo', { method: 'POST' }),
  redoStackAction: () => apiRequest('/dsa/stack/redo', { method: 'POST' }),
  getBstState: () => apiRequest('/dsa/bst'),
  runBstRangeQuery: (data) => apiRequest('/dsa/bst/range', { method: 'POST', body: JSON.stringify(data) }),
  runBstSearch: (data) => apiRequest('/dsa/bst/search', { method: 'POST', body: JSON.stringify(data) }),
  getOopModels: () => apiRequest('/dsa/oop-models'),
  getFreshnessSimulation: (data) => apiRequest('/dsa/freshness-decay', { method: 'POST', body: JSON.stringify(data) }),
  runZeroHungerDispatch: (data = {}) => apiRequest('/dsa/zero-hunger-dispatch', { method: 'POST', body: JSON.stringify(data) }),
  calculateMultimodalRelay: (data) => apiRequest('/dsa/multimodal-relay', { method: 'POST', body: JSON.stringify(data) }),
  solveEcoKnapsack: (data) => apiRequest('/dsa/eco-knapsack', { method: 'POST', body: JSON.stringify(data) })
};
