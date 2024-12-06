export interface Note {
  id: string;
  title: string;
  content: string;
  categoryId: string | null;
  tags: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  parentId: string | null;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}
