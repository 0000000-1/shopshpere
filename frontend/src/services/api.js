import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:2001/api',
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache', // 💡 Kept cache busting intact!
    'Pragma': 'no-cache',
    'Expires': '0',
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// api end points
export const fetchProducts = () => API.get('/products');
export const fetchProductById = (id) => API.get(`/products/${id}`);
export const fetchCart = () => API.get('/users/cart');
// cart updation
export const addCart = (cartData) => API.put('/users/cart/add', cartData); //this add and update together 
export const deleteCart = (id) => API.delete(`/users/cart/delete/${id}`);
export const createOrder = (orderData) => API.post('/orders', orderData);
//auth path
export const loginUser = (userData) => API.post('/users/login', userData);
export const registerUser = (userData) => API.post('/users/signup', userData);
//orders 
export const myOrders = () => API.get('/orders/my-orders')

export default API; // Default export matches dashboard requirement