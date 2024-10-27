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
  id: string;
  name: string;
  description: string;
  categoriesIds: string[];
  coverImage: string;
}

export interface Category {
  id: string;
  type: string;
  label: string;
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
