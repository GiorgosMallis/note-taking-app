export interface Category {
  id: string;
  name: string;
  color?: string;
  parentId?: string | null;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}
