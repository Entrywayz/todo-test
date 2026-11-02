export interface Todo {
  id: number;
  title: string;
  description?: string | null;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  isCompleted?: boolean;
}

export type FilterStatus = 'all' | 'active' | 'completed';
