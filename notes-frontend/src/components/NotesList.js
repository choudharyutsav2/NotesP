import React from 'react';
import { Link } from 'react-router-dom';
import { Edit3, Trash2, Share2, Globe, Lock } from 'lucide-react';
import { useNotes } from '../context/NotesContext';

const NotesList = () => {
  const { notes, deleteNote, togglePublicStatus, loading } = useNotes();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(id);
    }
  };

  const handleTogglePublic = async (id) => {
    await togglePublicStatus(id);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{height: '16rem'}}>
        <div className="loading-spinner animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
      
      {notes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No notes yet. Create your first note!</p>
          <Link to="/create" className="btn btn-primary mt-4">
            Create Note
          </Link>
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <div key={note.id} className="note-card">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {note.title}
                </h3>
                <div className="flex items-center space-x-1">
                  {note.isPublic ? (
                    <Globe className="icon text-green-600" />
                  ) : (
                    <Lock className="icon text-gray-400" />
                  )}
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {note.content.substring(0, 150)}
                {note.content.length > 150 && '...'}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>Updated: {formatDate(note.updatedAt)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Link
                    to={`/edit/${note.id}`}
                    className="btn btn-small text-blue-600 hover:text-blue-500"
                  >
                    <Edit3 className="icon-sm mr-1" />
                    Edit
                  </Link>
                  
                  <button
                    onClick={() => handleTogglePublic(note.id)}
                    className={`btn btn-small ${
                      note.isPublic ? 'text-green-600 hover:text-green-500' : 'text-gray-600 hover:text-gray-500'
                    }`}
                  >
                    <Share2 className="icon-sm mr-1" />
                    {note.isPublic ? 'Public' : 'Private'}
                  </button>
                </div>
                
                <button
                  onClick={() => handleDelete(note.id)}
                  className="btn btn-small btn-danger"
                >
                  <Trash2 className="icon-sm mr-1" />
                  Delete
                </button>
              </div>
              
              {note.isPublic && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Share URL:</span>
                    <button
                      onClick={() => {
                        const shareUrl = `${window.location.origin}/shared/${note.shareToken}`;
                        navigator.clipboard.writeText(shareUrl);
                        alert('Share URL copied to clipboard!');
                      }}
                      className="text-xs text-blue-600 hover:text-blue-500"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesList;