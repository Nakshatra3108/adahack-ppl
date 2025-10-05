import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api', // Updated to match your .env PORT
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => API.post('/auth/login', { email, password }),
  signup: (name, email, password) => API.post('/auth/signup', { name, email, password }),
};

export const donationAPI = {
  create: (data) => API.post('/donations', data),
  getUserDonations: () => API.get('/donations/user'),
};

export const leaderboardAPI = {
  getUsers: () => API.get('/leaderboard/users'),
  getCharities: () => API.get('/leaderboard/charities'),
};

export default API;