import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { Note } from '../types/Note';
import { Category } from '../types/Category';
import { Tag } from '../types/Tag';
import SortableNote from './SortableNote';
import NoteViewModal from './NoteViewModal';

interface NotesPreviewProps {
  notes: Note[];
  categories?: Category[];
  tags?: Tag[];
  onNoteSelect: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  onTogglePin: (noteId: string) => void;
  onCategorySelect?: (categoryId: string) => void;
  onTagSelect?: (tagId: string) => void;
  onReorder: (notes: Note[]) => void;
}

export const NotesPreview: React.FC<NotesPreviewProps> = ({
  notes,
  categories,
  tags,
  onNoteSelect,
  onDeleteNote,
  onTogglePin,
  onCategorySelect,
  onTagSelect,
  onReorder,
}) => {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = notes.findIndex((note) => note.id === active.id);
      const newIndex = notes.findIndex((note) => note.id === over.id);
      
      // Create a new array with the reordered notes
      const reorderedNotes = [...notes];
      const [movedNote] = reorderedNotes.splice(oldIndex, 1);
      reorderedNotes.splice(newIndex, 0, movedNote);
      
      onReorder(reorderedNotes);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

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
    const category = categories?.find((c: Category) => c.id === categoryId);
    return category ? category.name : '';
  };

  const getCategoryColor = (categoryId: string | null) => {
    if (!categoryId) return '';
    const category = categories?.find((c: Category) => c.id === categoryId);
    return category ? category.color : '';
  };

  const getNoteTags = (note: Note): Tag[] => {
    if (!note.tags || !Array.isArray(note.tags)) return [];
    return note.tags
      .map(tagId => tags?.find((t: Tag) => t.id === tagId))
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

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setIsViewMode(true);
  };

  const handleCloseView = () => {
    setIsViewMode(false);
    setSelectedNote(null);
  };

  const handleEditFromView = (note: Note) => {
    setIsViewMode(false);
    onNoteSelect(note);
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

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="w-full">
        {notes.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-xl">No notes yet</p>
            <p className="text-sm mt-2">Create your first note to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4 p-4">
            <SortableContext
              items={notes.map((note) => note.id)}
              strategy={rectSortingStrategy}
            >
              {notes.map((note) => (
                <SortableNote
                  key={note.id}
                  note={note}
                  onNoteClick={handleNoteClick}
                  onTogglePin={onTogglePin}
                  onEdit={onNoteSelect}
                  onDelete={onDeleteNote}
                  onCategoryClick={handleCategoryClick}
                  onTagClick={handleTagClick}
                  categories={categories || []}
                  tags={tags || []}
                />
              ))}
            </SortableContext>
          </div>
        )}
        <DragOverlay dropAnimation={dropAnimation}>
          {activeId ? (
            <SortableNote
              note={notes.find((note) => note.id === activeId)!}
              onNoteClick={handleNoteClick}
              onTogglePin={onTogglePin}
              onEdit={onNoteSelect}
              onDelete={onDeleteNote}
              onCategoryClick={handleCategoryClick}
              onTagClick={handleTagClick}
              categories={categories || []}
              tags={tags || []}
              isDragging
            />
          ) : null}
        </DragOverlay>
        {isViewMode && selectedNote && (
          <NoteViewModal
            note={selectedNote}
            onClose={handleCloseView}
            onEdit={handleEditFromView}
            categories={categories || []}
            tags={tags || []}
          />
        )}
      </div>
    </DndContext>
  );
};
