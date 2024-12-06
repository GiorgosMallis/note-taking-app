export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  categoryId?: string | null;
  tags: string[];
  isPinned?: boolean;
}

export type NoteCreateInput = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;
