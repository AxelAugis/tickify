import { apiUrl } from "@/utils/api";

import axios from 'axios';

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export const login = async (email, password) => {
    try {
      const response = await api.post('/api/login_check', {
        email,
        password,
      });
  
      const token = response.data.token;
  
      localStorage.setItem('token', token);
  
      console.log('Login successful:', response);
  
    } catch (error) {
      if (error.response) {
        console.error('Login failed:', error.response.data);
      } else {
        console.error('An error occurred:', error.message);
      }
      throw error;
    }
};