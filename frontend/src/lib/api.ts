import { Todo, CreateTodoInput, UpdateTodoInput, FilterStatus } from '../types/todo';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const data = await response.json();
      if (Array.isArray(data.message)) {
        errorMsg = data.message.join(', ');
      } else if (data.message) {
        errorMsg = data.message;
      }
    } catch {
      // ignore json parse error
    }
    throw new ApiError(response.status, errorMsg);
  }

  return response.json() as Promise<T>;
}

export const todoApi = {
  async getTodos(params?: { search?: string; status?: FilterStatus }): Promise<Todo[]> {
    const query = new URLSearchParams();
    if (params?.search) {
      query.append('search', params.search);
    }
    if (params?.status === 'active') {
      query.append('completed', 'false');
    } else if (params?.status === 'completed') {
      query.append('completed', 'true');
    }

    const qs = query.toString();
    return request<Todo[]>(`/todos${qs ? `?${qs}` : ''}`);
  },

  async getTodo(id: number): Promise<Todo> {
    return request<Todo>(`/todos/${id}`);
  },

  async createTodo(input: CreateTodoInput): Promise<Todo> {
    return request<Todo>('/todos', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async updateTodo(id: number, input: UpdateTodoInput): Promise<Todo> {
    return request<Todo>(`/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  },

  async deleteTodo(id: number): Promise<{ success: boolean; id: number }> {
    return request<{ success: boolean; id: number }>(`/todos/${id}`, {
      method: 'DELETE',
    });
  },
};
