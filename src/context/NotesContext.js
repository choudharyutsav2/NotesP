import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { noteService } from '../services/noteService';

const NotesContext = createContext();

const notesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTES':
      return { ...state, notes: action.payload, loading: false };
    case 'ADD_NOTE':
      return { ...state, notes: [action.payload, ...state.notes] };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload.id ? action.payload : note
        ),
      };
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const NotesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, {
    notes: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const notes = await noteService.getAllNotes();
      dispatch({ type: 'SET_NOTES', payload: notes });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const createNote = async (noteData) => {
    try {
      const newNote = await noteService.createNote(noteData);
      dispatch({ type: 'ADD_NOTE', payload: newNote });
      return newNote;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const updateNote = async (id, noteData) => {
    try {
      const updatedNote = await noteService.updateNote(id, noteData);
      dispatch({ type: 'UPDATE_NOTE', payload: updatedNote });
      return updatedNote;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const deleteNote = async (id) => {
    try {
      await noteService.deleteNote(id);
      dispatch({ type: 'DELETE_NOTE', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const togglePublicStatus = async (id) => {
    try {
      const updatedNote = await noteService.togglePublicStatus(id);
      dispatch({ type: 'UPDATE_NOTE', payload: updatedNote });
      return updatedNote;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const value = {
    ...state,
    createNote,
    updateNote,
    deleteNote,
    togglePublicStatus,
    fetchNotes,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};