import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 second timeout
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      // Network error
      throw new Error('Network error. Please check your connection and try again.');
    }

    if (error.response.status === 503) {
      // Database unavailable
      throw new Error('Database is currently unavailable. Please try again later.');
    }

    // Other errors
    throw error.response.data?.message || 'An unexpected error occurred.';
  }
);

// Add request interceptor to check server health before making requests
api.interceptors.request.use(async config => {
  // Skip health check for health endpoint to avoid infinite loop
  if (!config.url.includes('/health')) {
    try {
      await api.get('/health');
    } catch {
      throw new Error('Server is not responding. Please try again later.');
    }
  }
  return config;
});

export const couponApi = {
  // Coupon CRUD operations
  createCoupon: async (couponData) => {
    const response = await api.post('/coupons', couponData);
    return response.data;
  },

  getAllCoupons: async () => {
    const response = await api.get('/coupons');
    return response.data;
  },

  getCouponById: async (id) => {
    const response = await api.get(`/coupons/${id}`);
    return response.data;
  },

  updateCoupon: async (id, couponData) => {
    const response = await api.put(`/coupons/${id}`, couponData);
    return response.data;
  },

  deleteCoupon: async (id) => {
    const response = await api.delete(`/coupons/${id}`);
    return response.data;
  },

  // Coupon application
  getApplicableCoupons: async (cart) => {
    const response = await api.post('/coupons/applicable-coupons', { cart });
    return response.data;
  },

  applyCoupon: async (id, cart) => {
    const response = await api.post(`/coupons/apply-coupon/${id}`, { cart });
    return response.data;
  }
};

export default api;
