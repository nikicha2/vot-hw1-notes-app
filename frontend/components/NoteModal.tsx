'use client';

import { useState, useEffect } from 'react';
import { Note } from '@/lib/api';

interface NoteModalProps {
  note: Note | null;
  onClose: () => void;
  onSave: (text: string) => Promise<void>;
}

export default function NoteModal({ note, onSave, onClose }: NoteModalProps) {
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (note) {
      setText(note.text);
    } else {
      setText('');
    }
  }, [note]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      await onSave(text);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{note ? 'Edit Note' : 'Create Note'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="text">Text</label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : note ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

