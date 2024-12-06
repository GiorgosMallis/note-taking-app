export interface Tag {
  id: string;
  name: string;
  color: string;
}

export type TagCreateInput = Omit<Tag, 'id'>;
