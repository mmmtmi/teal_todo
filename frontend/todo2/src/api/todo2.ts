import axios from 'axios';
import type { Todo2 } from './types';

const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiUrl
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default {
    getAll: async():Promise<Todo2[]> => {
        const response = await api.get('/todo2');
        return response.data;
    },
    create: (data: Todo2): Promise<Todo2> => api.post('/todo2', data),
    update: (id: number, data: Todo2): Promise<Todo2> => api.patch(`/todo2/${id}`, data),
    delete: (id: number): Promise<void> => api.delete(`/todo2/${id}`),
  };
