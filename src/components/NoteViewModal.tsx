import React, { useEffect } from 'react';
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
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-light-surface dark:bg-dark-surface w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg">
        <div className="sticky top-0 bg-light-surface dark:bg-dark-surface border-b border-light-border dark:border-dark-border px-4 py-3 flex justify-between items-center">
          <h2 className="text-xl font-semibold truncate max-w-[80%] text-light-text-primary dark:text-dark-text-primary">{note.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5 text-light-text-primary dark:text-dark-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <div className="space-y-4">
            <div className="prose prose-sm sm:prose max-w-none dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: note.content }} />
            </div>

            <div className="border-t border-light-border dark:border-dark-border pt-4 mt-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                <div className="flex items-center gap-2">
                  <span>Created: {formatDate(note.createdAt)}</span>
                  {note.updatedAt && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <span>Updated: {formatDate(note.updatedAt)}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {note.categoryId && (
                  <div className="flex items-center text-sm">
                    <span className="mr-2 text-light-text-secondary dark:text-dark-text-secondary">Category:</span>
                    <span
                      className="px-2 py-1 rounded-full text-white text-xs"
                      style={{ backgroundColor: categories.find(c => c.id === note.categoryId)?.color || '#3b82f6' }}
                    >
                      {getCategoryName(note.categoryId)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-light-text-secondary dark:text-dark-text-secondary">Tags:</span>
                    {note.tags.map(tagId => {
                      const tag = tags.find(t => t.id === tagId);
                      return tag ? (
                        <span
                          key={tagId}
                          className="px-2 py-1 rounded-full text-white text-xs"
                          style={{ backgroundColor: tag.color }}
                        >
                          {tag.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteViewModal;
