import axios from 'axios';

const USE_MOCK_API = true;
const BASE_URL = 'http://localhost:3000/api';
const MOCK_DELAY = 800;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const simulateDelay = () => new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

const simulateError = (errorRate = 0.05) => {
  if (Math.random() < errorRate) {
    throw new Error('Simulated API error');
  }
};

export { api, USE_MOCK_API, simulateDelay, simulateError };
