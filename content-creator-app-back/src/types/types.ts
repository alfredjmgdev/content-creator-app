export interface Content {
  id: string;
  title: string;
  themesIds: string[];
  values: {
    categoryId: string;
    value: string;
  }[];
  userId: string;
  createdAt: string;
  updatedAt?: string;
  deleteddAt?: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  categoriesIds: string[];
  coverImage: string;
  createdAt: string;
  updatedAt?: string;
  deleteddAt?: string;
}

export interface Category {
  id: string;
  type: string;
  label: string;
  createdAt: string;
  updatedAt?: string;
  deleteddAt?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt?: string;
  deleteddAt?: string;
}

export interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}