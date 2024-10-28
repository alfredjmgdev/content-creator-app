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
  contents: ContentItemResponse[];
  themes: ThemeContentResponse[];
  categories: CategoryResponse[];
}

export interface ContentItemResponse {
  _id: string;
  title: string;
  themesIds: ThemeContentResponse[];
  values: ValueResponse[];
  userId: UserResponse;
  createdAt: string;
}

export interface ThemeContentResponse {
  _id: string;
  name: string;
  description: string;
  coverImage: string;
  categoriesIds: CategoryResponse[];
}

export interface ThemeResponse {
  _id: string;
  name: string;
  description: string;
  coverImage: string;
  categoriesIds: CategoryResponse[]; // Add this line
}

export interface ValueResponse {
  categoryId: CategoryResponse;
  value: string;
  _id: string;
}

export interface CategoryResponse {
  _id: string;
  type: string;
  label: string;
}

export interface UserResponse {
  _id: string;
  username: string;
  email: string;
}
