import { Note } from '../types/Note';
import { Category } from '../types/Category';
import { Tag } from '../types/Tag';

const NOTES_KEY = 'notes';
const CATEGORIES_KEY = 'categories';
const TAGS_KEY = 'tags';

export const storageService = {
  saveNotes: (notes: Note[]) => {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  },

  getNotes: (): Note[] => {
    const notes = localStorage.getItem(NOTES_KEY);
    return notes ? JSON.parse(notes) : [];
  },

  saveCategories: (categories: Category[]) => {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  },

  getCategories: (): Category[] => {
    const categories = localStorage.getItem(CATEGORIES_KEY);
    return categories ? JSON.parse(categories) : [];
  },

  saveTags: (tags: Tag[]) => {
    localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
  },

  getTags: (): Tag[] => {
    const tags = localStorage.getItem(TAGS_KEY);
    return tags ? JSON.parse(tags) : [];
  }
};
