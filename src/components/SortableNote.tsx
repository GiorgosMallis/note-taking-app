import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Note } from '../types/Note';
import { Category } from '../types/Category';
import { Tag } from '../types/Tag';

interface SortableNoteProps {
  note: Note;
  onNoteClick: (note: Note) => void;
  onTogglePin: (noteId: string) => void;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onCategoryClick?: (categoryId: string) => void;
  onTagClick?: (tagId: string) => void;
  categories?: Category[];
  tags?: Tag[];
  isDragging?: boolean;
}

const SortableNote: React.FC<SortableNoteProps> = ({
  note,
  onNoteClick,
  onTogglePin,
  onEdit,
  onDelete,
  onCategoryClick,
  onTagClick,
  categories,
  tags,
  isDragging = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
    cursor: 'auto',
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return '';
    const category = categories?.find((c) => c.id === categoryId);
    return category ? category.name : '';
  };

  const getNoteTags = (note: Note): Tag[] => {
    if (!note.tags || !Array.isArray(note.tags)) return [];
    return note.tags
      .map((tagId) => tags?.find((t) => t.id === tagId))
      .filter((tag): tag is Tag => tag !== undefined);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`group relative p-5 rounded-xl border backdrop-blur-sm transition-all duration-200 ${
        note.isPinned
          ? 'border-light-accent dark:border-dark-accent shadow-lg hover:shadow-xl transform scale-[1.02] bg-light-surface/90 dark:bg-dark-surface/90'
          : 'border-light-border dark:border-dark-border hover:border-light-accent dark:hover:border-dark-accent bg-light-surface/80 dark:bg-dark-surface/80'
      }`}
      onClick={() => onNoteClick(note)}
    >
      {/* Drag Handle */}
      <div
        {...listeners}
        className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
      >
        <svg
          className="w-5 h-5 text-light-text-muted dark:text-dark-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8h16M4 16h16"
          />
        </svg>
      </div>

      {/* Corner Ribbon for Pinned Notes */}
      {note.isPinned && (
        <div className="absolute -top-1 -right-1">
          <div className="bg-light-accent dark:bg-dark-accent text-light-text-primary dark:text-dark-text-primary text-xs font-medium py-1 px-3 rounded-tr-lg rounded-bl-lg shadow-md">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12Z" />
            </svg>
          </div>
        </div>
      )}

      <div className="flex flex-col h-full">
        <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary break-words pr-32">
          {note.title || 'Untitled'}
        </h3>
        <hr className="border-t border-light-border dark:border-dark-border my-2" />
        <div
          className="text-sm text-light-text-muted dark:text-dark-text-muted line-clamp-3 mb-4 flex-grow prose dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />

        <div className="mt-auto space-y-2 pt-3 border-t border-light-border dark:border-dark-border">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              {note.categoryId && onCategoryClick && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onCategoryClick(note.categoryId!);
                  }}
                  className="inline-flex items-center px-2 py-0.5 rounded-full bg-light-accent/70 dark:bg-dark-accent/70 text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-accent/80 dark:hover:bg-dark-accent/80 transition-colors cursor-pointer"
                >
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v11a2 2 0 00-2 2H2a2 2 0 00-2-2V6z" />
                    <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
                  </svg>
                  {getCategoryName(note.categoryId)}
                </span>
              )}

              {getNoteTags(note).length > 0 && onTagClick && (
                <div className="flex flex-wrap gap-1.5">
                  {getNoteTags(note).map((tag) => (
                    <span
                      key={tag.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTagClick(tag.id);
                      }}
                      className="inline-flex items-center px-2 py-0.5 rounded-full bg-light-accent/70 dark:bg-dark-accent/70 text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-accent/80 dark:hover:bg-dark-accent/80 transition-colors cursor-pointer"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <time className="text-light-text-muted dark:text-dark-text-muted flex items-center ml-auto">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {formatDate(note.updatedAt)}
            </time>
          </div>
        </div>

        {/* Actions Menu */}
        <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(note.id);
            }}
            className={`p-2 rounded-lg transition-colors ${
              note.isPinned
                ? 'text-light-accent dark:text-dark-accent'
                : 'text-light-text-muted dark:text-dark-text-muted hover:text-light-accent dark:hover:text-dark-accent'
            }`}
            title={note.isPinned ? 'Unpin note' : 'Pin note'}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"
              />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(note);
            }}
            className="p-2 rounded-lg text-light-text-muted dark:text-dark-text-muted hover:bg-light-accent dark:hover:bg-dark-accent transition-colors"
            title="Edit note"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className="p-2 rounded-lg text-light-text-muted dark:text-dark-text-muted hover:bg-light-accent dark:hover:bg-dark-accent transition-colors"
            title="Delete note"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortableNote;
