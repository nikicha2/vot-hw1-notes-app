'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { notesAPI, authAPI, setAuthToken, Note, User } from '@/lib/api';
import NoteCard from '@/components/NoteCard';
import NoteModal from '@/components/NoteModal';
import AuthModal from '@/components/AuthModal';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        setAuthToken(token);
        const userData = await authAPI.getMe();
        setUser(userData);
        loadNotes();
      } catch (error) {
        setAuthToken(null);
        setUser(null);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const loadNotes = async () => {
    try {
      const data = await notesAPI.getAll();
      setNotes(data);
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (username: string, password: string) => {
    try {
      const data = await authAPI.login(username, password);
      setAuthToken(data.token);
      setUser(data.user);
      setShowAuthModal(false);
      loadNotes();
    } catch (error: any) {
      throw error;
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    try {
      const data = await authAPI.register(username, email, password);
      setAuthToken(data.token);
      setUser(data.user);
      setShowAuthModal(false);
      loadNotes();
    } catch (error: any) {
      throw error;
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setUser(null);
    setNotes([]);
  };

  const handleCreateNote = () => {
    setEditingNote(null);
    setShowNoteModal(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setShowNoteModal(true);
  };

  const handleDeleteNote = async (id: number) => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await notesAPI.delete(id);
        loadNotes();
      } catch (error) {
        console.error('Failed to delete note:', error);
        alert('Failed to delete note');
      }
    }
  };

  const handleSaveNote = async (text: string) => {
    try {
      if (editingNote) {
        await notesAPI.update(editingNote.id, text);
      } else {
        await notesAPI.create(text);
      }
      setShowNoteModal(false);
      setEditingNote(null);
      loadNotes();
    } catch (error) {
      console.error('Failed to save note:', error);
      throw error;
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="container">
        <div className="header">
          <h1>Notes App</h1>
        </div>
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <button className="btn btn-primary" onClick={() => {
            setAuthMode('login');
            setShowAuthModal(true);
          }}>
            Login
          </button>
          <button className="btn btn-secondary" onClick={() => {
            setAuthMode('register');
            setShowAuthModal(true);
          }} style={{ marginLeft: '10px' }}>
            Register
          </button>
        </div>
        {showAuthModal && (
          <AuthModal
            mode={authMode}
            onClose={() => setShowAuthModal(false)}
            onLogin={handleLogin}
            onRegister={handleRegister}
          />
        )}
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Notes App</h1>
        <div className="auth-section">
          <span>Welcome, {user.username}!</span>
          <button className="btn btn-primary" onClick={handleCreateNote}>
            Create Note
          </button>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {notes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          <p>No notes yet. Create your first note!</p>
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
            />
          ))}
        </div>
      )}

      {showNoteModal && (
        <NoteModal
          note={editingNote}
          onClose={() => {
            setShowNoteModal(false);
            setEditingNote(null);
          }}
          onSave={handleSaveNote}
        />
      )}
    </div>
  );
}

