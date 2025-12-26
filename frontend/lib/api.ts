import axios from 'axios';

// Browser uses relative /api path, server uses cluster DNS
const API_BASE_URL = typeof window !== 'undefined'
  ? '/api'
  : (process.env.BACKEND_URL || 'http://notes-backend:8000') + '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Token handling
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token');
  if (token) api.defaults.headers.common['Authorization'] = `Token ${token}`;
}

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Token ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

export interface User { id: number; username: string; email: string; }
export interface Note {
  id: number;
  text: string;
  date_created: string;
  date_edited: string;
  user: User;
}

export const authAPI = {
  register: (username: string, email: string, password: string) =>
    api.post('/users/register/', { username, email, password }).then(res => res.data),

  login: (username: string, password: string) =>
    api.post('/users/login/', { username, password }).then(res => res.data),

  getMe: () => api.get('/users/me/').then(res => res.data),
};

export const notesAPI = {
  getAll: (): Promise<Note[]> => api.get('/notes/').then(res => res.data.results || res.data),
  getOne: (id: number): Promise<Note> => api.get(`/notes/${id}/`).then(res => res.data),
  create: (text: string): Promise<Note> => {
    const formData = new FormData();
    formData.append('text', text);
    return api.post('/notes/', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then(res => res.data);
  },
  update: (id: number, text: string): Promise<Note> => {
    const formData = new FormData();
    formData.append('text', text);
    return api.patch(`/notes/${id}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then(res => res.data);
  },
  delete: (id: number): Promise<void> => api.delete(`/notes/${id}/`).then(() => {}),
};

export default api;
