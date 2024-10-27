export interface ContentItem {
  id: string;
  title: string;
  themesIds: string[];
  values: {
    categoryId: string;
    value: string;
  }[];
  createdAt: string;
  userId: string;
}

export interface ContentTheme {
  _id: string;
  name: string;
  description: string;
  categoriesIds: Category[];
  coverImage: string;
  createdAt: string;
}

export interface Category {
  _id: string;
  type: string;
  label: string;
  createdAt: string;
}

export type UserType = 'admin' | 'creator' | 'reader';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
  type: UserType;
}

export interface ExplorerData {
  contents: ContentItem[];
  themes: ContentTheme[];
  categories: Category[];
}
