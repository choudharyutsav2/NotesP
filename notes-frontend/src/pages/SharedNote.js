import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Globe } from 'lucide-react';
import { noteService } from '../services/noteService';

const SharedNote = () => {
  const { shareToken } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSharedNote();
  }, [shareToken]);

  const fetchSharedNote = async () => {
    try {
      setLoading(true);
      const noteData = await noteService.getNoteByShareToken(shareToken);
      setNote(noteData);
    } catch (error) {
      console.error('Error fetching shared note:', error);
      setError('Note not found or not publicly shared');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Note Not Found</h1>
          <p className="text-gray-600 mb-8">
            This note doesn't exist or is not publicly shared.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go to Notes App
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-green-500" />
                <span className="text-sm text-green-600 font-medium">Shared Note</span>
              </div>
              <Link
                to="/"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-500"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Create Your Own Notes
              </Link>
            </div>
          </div>

          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {note.title}
            </h1>
            
            <div className="text-sm text-gray-500 mb-6">
              Created: {formatDate(note.createdAt)}
              {note.updatedAt !== note.createdAt && (
                <span> • Updated: {formatDate(note.updatedAt)}</span>
              )}
            </div>

            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {note.content}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600 text-center">
              Powered by Notes App • 
              <Link to="/" className="text-blue-600 hover:text-blue-500 ml-1">
                Create your own notes
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedNote;