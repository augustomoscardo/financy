export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UpdateProfileInput {
  name: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  countTransactions: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  icon: string;
  color: string;
}

export enum TransactionType {
  income = 'income',
  outcome = 'outcome'
}

export interface Transaction {
  id: string;
  title: string;
  description?: string;
  amount: number;
  type: TransactionType;
  date: string;
  categoryId: string;
  category: Category;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTransactionInput {
  title: string;
  description?: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date?: string;
}

export interface UpdateTransactionInput {
  title?: string;
  description?: string;
  amount?: number;
  type?: TransactionType;
  categoryId?: string;
  date?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface TransactionConnection {
  transactions: Transaction[];
  pagination: PaginationInfo;
}

export interface TransactionFilters {
  title?: string;
  type?: TransactionType;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
}