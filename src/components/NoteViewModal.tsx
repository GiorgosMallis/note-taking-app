import React from 'react';
import { Note } from '../types/Note';
import { Category } from '../types/Category';
import { Tag } from '../types/Tag';

interface NoteViewModalProps {
  note: Note;
  onClose: () => void;
  onEdit: (note: Note) => void;
  categories?: Category[];
  tags?: Tag[];
}

export const NoteViewModal: React.FC<NoteViewModalProps> = ({
  note,
  onClose,
  onEdit,
  categories = [],
  tags = [],
}) => {
  if (!note) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  const getTagNames = (tagIds: string[]) => {
    return tagIds.map(tagId => {
      const tag = tags.find(t => t.id === tagId);
      return tag ? tag.name : tagId;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-light-surface dark:bg-dark-surface w-full max-w-2xl rounded-xl shadow-2xl p-6 m-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary">
            {note.title}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(note)}
              className="px-3 py-1 rounded-lg bg-light-accent dark:bg-dark-accent text-light-text-primary dark:text-dark-text-primary hover:opacity-90"
            >
              Edit
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1 rounded-lg bg-light-border dark:bg-dark-border text-light-text-primary dark:text-dark-text-primary hover:opacity-90"
            >
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div 
          className="prose dark:prose-invert max-w-none mb-4"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />

        {/* Footer */}
        <div className="border-t border-light-border dark:border-dark-border pt-4 mt-4">
          <div className="flex flex-wrap gap-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">
            {note.categoryId && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Category:</span>
                <span className="bg-light-accent/20 dark:bg-dark-accent/20 px-2 py-0.5 rounded-full">
                  {getCategoryName(note.categoryId)}
                </span>
              </div>
            )}
            {note.tags && note.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {getTagNames(note.tags).map((tagName, index) => (
                    <span
                      key={index}
                      className="bg-light-accent/20 dark:bg-dark-accent/20 px-2 py-0.5 rounded-full"
                    >
                      {tagName}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <span className="font-medium">Last Updated:</span>{' '}
              {formatDate(note.updatedAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteViewModal;
