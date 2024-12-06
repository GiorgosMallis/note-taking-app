import { Note, Category, Tag } from '../types';

class StorageService {
  private readonly NOTES_KEY = 'notes';
  private readonly CATEGORIES_KEY = 'categories';
  private readonly TAGS_KEY = 'tags';

  loadNotes(): Note[] {
    const notes = localStorage.getItem(this.NOTES_KEY);
    return notes ? JSON.parse(notes) : [];
  }

  saveNotes(notes: Note[]): void {
    localStorage.setItem(this.NOTES_KEY, JSON.stringify(notes));
  }

  loadCategories(): Category[] {
    const categories = localStorage.getItem(this.CATEGORIES_KEY);
    return categories ? JSON.parse(categories) : [];
  }

  saveCategories(categories: Category[]): void {
    localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
  }

  loadTags(): Tag[] {
    const tags = localStorage.getItem(this.TAGS_KEY);
    return tags ? JSON.parse(tags) : [];
  }

  saveTags(tags: Tag[]): void {
    localStorage.setItem(this.TAGS_KEY, JSON.stringify(tags));
  }
}

export const storageService = new StorageService();
