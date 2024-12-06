import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import RichTextEditor from './RichTextEditor';

interface NoteEditorProps {
  note: Note | null;
  categories: Array<{ id: string; name: string }>;
  tags: Array<{ id: string; name: string }>;
  onSave: (note: Note) => void;
  onClose: () => void;
  t: (key: string) => string;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, categories, tags, onSave, onClose, t }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
  }, [note]);

  const handleSave = () => {
    if (note) {
      onSave({
        ...note,
        title,
        content,
        updatedAt: new Date().toISOString(),
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-light-surface dark:bg-dark-surface rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="p-4 border-b border-light-border dark:border-dark-border flex justify-between items-center">
          <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
            {t('Edit Note')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-light-accent dark:hover:bg-dark-accent text-light-text-secondary dark:text-dark-text-secondary transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('Enter title...')}
            className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg mb-4 bg-light-accent dark:bg-dark-accent text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <RichTextEditor content={content} onChange={setContent} />
        </div>
        <div className="p-4 border-t border-light-border dark:border-dark-border flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-light-accent dark:bg-dark-accent text-light-text-primary dark:text-dark-text-primary hover:bg-light-border dark:hover:bg-dark-border transition-colors"
          >
            {t('Cancel')}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg"
          >
            {t('Save')}
          </button>
        </div>
        <div className="border-t border-light-border dark:border-dark-border p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                {t('Category')}
              </label>
              <select
                value={note?.categoryId || ''}
                onChange={(e) => {
                  if (note) {
                    onSave({
                      ...note,
                      categoryId: e.target.value || null,
                    });
                  }
                }}
                className="w-full bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg p-2.5 text-light-text-primary dark:text-dark-text-primary focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="">{t('No Category')}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                {t('Tags')}
              </label>
              <div className="flex flex-wrap gap-2 p-2.5 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg min-h-[42px]">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => {
                      if (note) {
                        const currentTags = note.tags || [];
                        const newTags = currentTags.includes(tag.id)
                          ? currentTags.filter(id => id !== tag.id)
                          : [...currentTags, tag.id];
                        onSave({ ...note, tags: newTags });
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      (note?.tags || []).includes(tag.id)
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
    </div>
  );
};

export default NoteEditor;
