export interface Category {
  id: string;
  name: string;
}

export interface Tool {
  id: string;
  name: string;
  url: string;
  description: string;
  categoryIds: string[];
  personal_rating: number;
  tags: string[];
}

export interface Prompt {
  id: string;
  toolId: string;
  title: string;
  promptText: string;
  description: string;
  categoryId: string;
  personal_rating: number;
}
