'use client';

import { Note } from '@/lib/api';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
}

export default function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="note-card">
      <div className="note-text">{note.text}</div>
      <div className="note-meta">
        <div>Created: {formatDate(note.date_created)}</div>
        <div>Edited: {formatDate(note.date_edited)}</div>
      </div>
      <div className="note-actions">
        <button className="btn btn-primary" onClick={() => onEdit(note)}>
          Edit
        </button>
        <button className="btn btn-danger" onClick={() => onDelete(note.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

