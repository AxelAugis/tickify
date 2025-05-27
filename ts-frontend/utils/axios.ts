import Axios from "axios";
import { apiUrl } from "./api";

const axios = Axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token && token !== null) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return error;
});

export default axios;