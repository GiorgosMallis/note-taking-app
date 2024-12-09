import React from 'react';
import { Note } from '../types';
import RichTextEditor from './RichTextEditor';

interface NoteEditorProps {
  note: Note;
  categories: Array<{ id: string; name: string }>;
  tags: Array<{ id: string; name: string }>;
  onUpdateNote: (updatedNote: Note) => void;
  onUpdateTitle: (noteId: string, newTitle: string) => void;
  onSave: () => void;
  onClose: () => void;
  isGreek?: boolean;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  categories,
  tags,
  onUpdateNote,
  onUpdateTitle,
  onSave,
  onClose,
  isGreek = false,
}) => {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateTitle(note.id, e.target.value);
  };

  const handleContentChange = (newContent: string) => {
    onUpdateNote({ ...note, content: newContent });
  };

  return (
    <div className="h-full flex flex-col bg-light-surface dark:bg-dark-surface">
      <div className="flex items-center justify-between p-4 border-b border-light-border dark:border-dark-border">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-light-accent dark:bg-dark-accent text-light-text-primary dark:text-dark-text-primary hover:bg-light-border dark:hover:bg-dark-border transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <input
            type="text"
            value={note.title}
            onChange={handleTitleChange}
            placeholder="Untitled Note"
            className="w-full text-xl font-semibold bg-transparent border-none outline-none text-light-text-primary dark:text-dark-text-primary placeholder-light-text-muted dark:placeholder-dark-text-muted"
          />
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onSave}
            className="px-4 py-2 bg-light-accent dark:bg-dark-accent text-light-text-primary dark:text-dark-text-primary rounded-lg hover:opacity-90 transition-opacity"
          >
            {isGreek ? "Αποθήκευση" : "Save"}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <RichTextEditor content={note.content} onChange={handleContentChange} />
        </div>
      </div>
      <div className="border-t border-light-border dark:border-dark-border p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
              Category
            </label>
            <select
              value={note.categoryId || ''}
              onChange={(e) => onUpdateNote({ ...note, categoryId: e.target.value || null })}
              className="w-full bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg p-2.5 text-light-text-primary dark:text-dark-text-primary focus:ring-1 focus:ring-primary focus:border-primary"
            >
              <option value="">No Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 p-2.5 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg min-h-[42px]">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => {
                    const currentTags = note.tags || [];
                    const newTags = currentTags.includes(tag.id)
                      ? currentTags.filter(id => id !== tag.id)
                      : [...currentTags, tag.id];
                    onUpdateNote({ ...note, tags: newTags });
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    (note.tags || []).includes(tag.id)
                      ? 'bg-primary text-white'
                      : 'bg-light-accent dark:bg-dark-accent text-light-text-primary dark:text-dark-text-primary'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
