import React, { useEffect, useRef } from 'react';
import { Note } from '../types/Note';
import { Category } from '../types/Category';
import { Tag } from '../types/Tag';
import { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Mention from '@tiptap/extension-mention';

interface NotesPreviewProps {
  notes: Note[];
  categories: Category[];
  tags: Tag[];
  onNoteSelect: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  onTogglePin: (noteId: string) => void;
  onCategorySelect?: (categoryId: string) => void;
  onTagSelect?: (tagId: string) => void;
}

const NotesPreview: React.FC<NotesPreviewProps> = ({
  notes,
  categories,
  tags,
  onNoteSelect,
  onDeleteNote,
  onTogglePin,
  onCategorySelect,
  onTagSelect,
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return '';
    const category = categories.find((c: Category) => c.id === categoryId);
    return category ? category.name : '';
  };

  const getCategoryColor = (categoryId: string | null) => {
    if (!categoryId) return '';
    const category = categories.find((c: Category) => c.id === categoryId);
    return category ? category.color : '';
  };

  const getNoteTags = (note: Note): Tag[] => {
    if (!note.tags || !Array.isArray(note.tags)) return [];
    return note.tags
      .map(tagId => tags.find((t: Tag) => t.id === tagId))
      .filter((tag): tag is Tag => tag !== undefined);
  };

  const getContentPreview = (content: string) => {
    try {
      // Try to parse as JSON first (Tiptap format)
      const jsonContent = JSON.parse(content);
      // Return the raw content as is - it will be rendered as HTML
      return jsonContent.content?.slice(0, 2)?.map((block: any) => {
        if (block.type === 'paragraph' || block.type === 'heading') {
          return block.content?.map((node: any) => node.text || '').join(' ') || '';
        }
        return '';
      }).join(' ') || '';
    } catch (error) {
      // If not valid JSON, return as is
      return content;
    }
  };

  const handleNoteClick = (note: Note, action: 'edit' | 'delete' | 'pin' | 'view', event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    switch (action) {
      case 'edit':
        onNoteSelect(note);
        break;
      case 'delete':
        onDeleteNote(note.id);
        break;
      case 'pin':
        onTogglePin(note.id);
        break;
      case 'view':
        onNoteSelect(note);
        break;
    }
  };

  const handleCategoryClick = (categoryId: string | null) => {
    if (categoryId && onCategorySelect) {
      onCategorySelect(categoryId);
    }
  };

  const handleTagClick = (tagId: string) => {
    if (onTagSelect) {
      onTagSelect(tagId);
    }
  };

  return (
    <div className="w-full">
      {notes.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          <p className="text-xl">No notes yet</p>
          <p className="text-sm mt-2">Create your first note to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`group relative p-5 rounded-xl border backdrop-blur-sm transition-all duration-200 cursor-pointer ${
                note.isPinned 
                  ? 'border-light-accent dark:border-dark-accent shadow-lg hover:shadow-xl transform scale-[1.02] bg-light-surface/90 dark:bg-dark-surface/90' 
                  : 'border-light-border dark:border-dark-border hover:border-light-accent dark:hover:border-dark-accent bg-light-surface/80 dark:bg-dark-surface/80'
              }`}
              onClick={() => handleNoteClick(note, 'view')}
            >
              {/* Actions Menu */}
              <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNoteClick(note, 'pin', e);
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    note.isPinned
                      ? 'text-light-text-primary dark:text-dark-text-primary bg-light-accent dark:bg-dark-accent'
                      : 'text-light-text-muted dark:text-dark-text-muted hover:bg-light-accent dark:hover:bg-dark-accent'
                  }`}
                  title={note.isPinned ? 'Unpin note' : 'Pin note'}
                >
                  <svg className="w-4 h-4" fill={note.isPinned ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNoteClick(note, 'edit', e);
                  }}
                  className="p-2 rounded-lg text-light-text-muted dark:text-dark-text-muted hover:bg-light-accent dark:hover:bg-dark-accent transition-colors"
                  title="Edit note"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNoteClick(note, 'delete', e);
                  }}
                  className="p-2 rounded-lg text-light-text-muted dark:text-dark-text-muted hover:bg-light-accent dark:hover:bg-dark-accent transition-colors"
                  title="Delete note"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col h-full">
                <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary line-clamp-1 mb-3 pr-24">
                  {note.title || 'Untitled'}
                </h3>

                <div 
                  className="text-sm text-light-text-muted dark:text-dark-text-muted line-clamp-3 mb-4 flex-grow prose dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: getContentPreview(note.content) }}
                />

                <div className="mt-auto space-y-2 pt-3 border-t border-light-border dark:border-dark-border">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      {note.categoryId && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            if (note.categoryId) {
                              handleCategoryClick(note.categoryId);
                            }
                          }}
                          className="inline-flex items-center px-2 py-0.5 rounded-full bg-light-accent/70 dark:bg-dark-accent/70 text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-accent/80 dark:hover:bg-dark-accent/80 transition-colors cursor-pointer"
                        >
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v11a2 2 0 00-2 2H2a2 2 0 00-2-2V6z" />
                            <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
                          </svg>
                          {getCategoryName(note.categoryId)}
                        </span>
                      )}

                      {getNoteTags(note).length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {getNoteTags(note).map((tag) => (
                            <span
                              key={tag.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTagClick(tag.id);
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
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatDate(note.updatedAt)}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesPreview;
