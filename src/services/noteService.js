import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const noteService = {
  // Get all notes
  getAllNotes: async () => {
    const response = await api.get('/notes');
    return response.data;
  },

  // Get note by ID
  getNoteById: async (id) => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  // Get note by share token
  getNoteByShareToken: async (shareToken) => {
    const response = await api.get(`/notes/share/${shareToken}`);
    return response.data;
  },

  // Create new note
  createNote: async (note) => {
    const response = await api.post('/notes', note);
    return response.data;
  },

  // Update note
  updateNote: async (id, note) => {
    const response = await api.put(`/notes/${id}`, note);
    return response.data;
  },

  // Toggle public status
  togglePublicStatus: async (id) => {
    const response = await api.put(`/notes/${id}/toggle-public`);
    return response.data;
  },

  // Delete note
  deleteNote: async (id) => {
    await api.delete(`/notes/${id}`);
  },
};