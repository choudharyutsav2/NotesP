import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Share2, Globe, Lock } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { noteService } from '../services/noteService';

const NoteEditor = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { createNote, updateNote } = useNotes();
  
  const [note, setNote] = useState({
    title: '',
    content: '',
    isPublic: false,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      fetchNote();
    }
  }, [isEdit, id]);

  const fetchNote = async () => {
    try {
      setLoading(true);
      const noteData = await noteService.getNoteById(id);
      setNote(noteData);
    } catch (error) {
      console.error('Error fetching note:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    try {
      setSaving(true);
      if (isEdit) {
        await updateNote(id, note);
      } else {
        await createNote(note);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Error saving note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setNote(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{height: '16rem'}}>
        <div className="loading-spinner animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="editor-container">
      <div className="editor-content">
        <div className="editor-header">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="btn btn-small text-gray-600 hover:text-gray-500"
            >
              <ArrowLeft className="icon mr-1" />
              Back to Notes
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              {isEdit ? 'Edit Note' : 'Create New Note'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleInputChange('isPublic', !note.isPublic)}
                className={`badge ${
                  note.isPublic ? 'badge-green' : 'badge-gray'
                }`}
              >
                {note.isPublic ? <Globe className="icon-sm mr-1" /> : <Lock className="icon-sm mr-1" />}
                {note.isPublic ? 'Public' : 'Private'}
              </button>
            </div>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn btn-primary"
              style={{opacity: saving ? 0.5 : 1}}
            >
              <Save className="icon mr-2" />
              {saving ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </div>

        <div className="editor-body">
          <div style={{marginBottom: '1.5rem'}}>
            <input
              type="text"
              placeholder="Enter note title..."
              value={note.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="editor-title"
            />
          </div>
          
          <div>
            <textarea
              placeholder="Start writing your note..."
              value={note.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              className="editor-textarea"
            />
          </div>
        </div>

        {isEdit && note.isPublic && note.shareToken && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  This note is public and can be shared via:
                </p>
                <p className="text-sm text-blue-600" style={{fontFamily: 'monospace'}}>
                  {window.location.origin}/shared/{note.shareToken}
                </p>
              </div>
              <button
                onClick={() => {
                  const shareUrl = `${window.location.origin}/shared/${note.shareToken}`;
                  navigator.clipboard.writeText(shareUrl);
                  alert('Share URL copied to clipboard!');
                }}
                className="btn btn-small text-blue-600 hover:text-blue-500"
              >
                <Share2 className="icon mr-1" />
                Copy Link
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteEditor;