import { Note } from '../types/Note';
import { Category, Tag } from '../types/Category';

const NOTES_KEY = 'notes';
const CATEGORIES_KEY = 'categories';
const TAGS_KEY = 'tags';

export const storageService = {
  loadNotes: (): Note[] => {
    try {
      const notesJson = localStorage.getItem(NOTES_KEY);
      if (!notesJson) return [];
      
      const notes = JSON.parse(notesJson);
      return notes.map((note: any) => ({
        ...note,
        tags: note.tags || [],
        isPinned: note.isPinned || false,
        createdAt: note.createdAt || new Date().toISOString(),
        updatedAt: note.updatedAt || new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error loading notes:', error);
      return [];
    }
  },

  saveNotes: (notes: Note[]): void => {
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  },

  loadCategories: (): Category[] => {
    try {
      const categoriesJson = localStorage.getItem(CATEGORIES_KEY);
      return categoriesJson ? JSON.parse(categoriesJson) : [];
    } catch (error) {
      console.error('Error loading categories:', error);
      return [];
    }
  },

  saveCategories: (categories: Category[]): void => {
    try {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  },

  loadTags: (): Tag[] => {
    try {
      const tagsJson = localStorage.getItem(TAGS_KEY);
      return tagsJson ? JSON.parse(tagsJson) : [];
    } catch (error) {
      console.error('Error loading tags:', error);
      return [];
    }
  },

  saveTags: (tags: Tag[]): void => {
    try {
      localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
    } catch (error) {
      console.error('Error saving tags:', error);
    }
  },
};
