import React from 'react';
import { Note } from '../types';

interface NotesPreviewProps {
  notes: Note[];
  onNoteSelect: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  onTogglePin: (noteId: string) => void;
}

const NotesPreview: React.FC<NotesPreviewProps> = ({
  notes,
  onNoteSelect,
  onDeleteNote,
  onTogglePin,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {notes.map((note) => (
        <div
          key={note.id}
          className={`group relative bg-light-surface dark:bg-dark-surface rounded-xl overflow-hidden ${
            note.isPinned
              ? 'ring-2 ring-primary shadow-lg transform hover:-translate-y-1'
              : 'hover:shadow-md border border-light-border dark:border-dark-border'
          } transition-all duration-200`}
        >
          {/* Note Header */}
          <div className="p-4 pb-2">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary line-clamp-2 flex-1 mr-2">
                {note.title || 'Untitled Note'}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(note.id);
                }}
                className={`p-1.5 rounded-lg ${
                  note.isPinned
                    ? 'text-primary bg-primary/10'
                    : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-primary-light bg-transparent hover:bg-light-accent dark:hover:bg-dark-accent'
                } transition-colors`}
                title={note.isPinned ? "Unpin" : "Pin"}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      note.isPinned
                        ? "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        : "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Note Content */}
          <div 
            onClick={() => onNoteSelect(note)}
            className="cursor-pointer p-4 pt-0"
          >
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary line-clamp-3 mb-3">
              {note.content || 'No content'}
            </p>
            
            {/* Note Footer */}
            <div className="flex items-center justify-between text-xs text-light-text-muted dark:text-dark-text-muted mt-auto">
              <span>
                {new Date(note.updatedAt).toLocaleString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              
              {/* Action Buttons */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNoteSelect(note);
                  }}
                  className="p-1.5 rounded-lg text-light-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-primary-light hover:bg-light-accent dark:hover:bg-dark-accent transition-colors"
                  title="Edit"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteNote(note.id);
                  }}
                  className="p-1.5 rounded-lg text-light-text-secondary dark:text-dark-text-secondary hover:text-red-500 hover:bg-light-accent dark:hover:bg-dark-accent transition-colors"
                  title="Delete"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotesPreview;
