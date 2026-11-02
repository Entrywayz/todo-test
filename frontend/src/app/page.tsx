'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Todo, CreateTodoInput, UpdateTodoInput, FilterStatus } from '../types/todo';
import { todoApi } from '../lib/api';
import { TodoHeader } from '../components/TodoHeader';
import { TodoForm } from '../components/TodoForm';
import { TodoFilter } from '../components/TodoFilter';
import { TodoItem } from '../components/TodoItem';
import { CheckCircle, AlertCircle, RefreshCw, Sparkles, Inbox } from 'lucide-react';

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await todoApi.getTodos();
      setTodos(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Не удалось загрузить задачи';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAddTodo = async (input: CreateTodoInput) => {
    try {
      setError(null);
      const newTodo = await todoApi.createTodo(input);
      setTodos((prev) => [newTodo, ...prev]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка при создании задачи';
      setError(msg);
      throw err;
    }
  };

  const handleToggleTodo = async (id: number, currentCompleted: boolean) => {
    // Optimistic UI update
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: !currentCompleted } : t)),
    );

    try {
      const updated = await todoApi.updateTodo(id, { isCompleted: !currentCompleted });
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err: unknown) {
      // Revert on error
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isCompleted: currentCompleted } : t)),
      );
      const msg = err instanceof Error ? err.message : 'Ошибка при обновлении статуса задачи';
      setError(msg);
    }
  };

  const handleUpdateTodo = async (id: number, input: UpdateTodoInput) => {
    try {
      const updated = await todoApi.updateTodo(id, input);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка при редактировании задачи';
      setError(msg);
      throw err;
    }
  };

  const handleDeleteTodo = async (id: number) => {
    const backup = todos;
    setTodos((prev) => prev.filter((t) => t.id !== id));

    try {
      await todoApi.deleteTodo(id);
    } catch (err: unknown) {
      setTodos(backup);
      const msg = err instanceof Error ? err.message : 'Ошибка при удалении задачи';
      setError(msg);
    }
  };

  const counts = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.isCompleted).length;
    const active = total - completed;
    return {
      all: total,
      active,
      completed,
    };
  }, [todos]);

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      // Filter status
      if (filterStatus === 'active' && todo.isCompleted) return false;
      if (filterStatus === 'completed' && !todo.isCompleted) return false;

      // Filter search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = todo.title.toLowerCase().includes(query);
        const matchDesc = todo.description?.toLowerCase().includes(query) ?? false;
        return matchTitle || matchDesc;
      }

      return true;
    });
  }, [todos, filterStatus, searchQuery]);

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto flex flex-col justify-between">
      <div>
        {/* Header with stats */}
        <TodoHeader total={counts.all} completed={counts.completed} />

        {/* Error notification banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-start justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
              <span className="text-sm">{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs text-rose-400 hover:text-rose-200 underline"
            >
              Закрыть
            </button>
          </div>
        )}

        {/* Create Todo Form */}
        <TodoForm onAdd={handleAddTodo} disabled={loading} />

        {/* Filters and Search */}
        <TodoFilter
          status={filterStatus}
          onStatusChange={setFilterStatus}
          search={searchQuery}
          onSearchChange={setSearchQuery}
          counts={counts}
        />

        {/* Todo List / States */}
        {loading && todos.length === 0 ? (
          <div className="space-y-3 py-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 rounded-2xl bg-slate-900/50 border border-slate-800/80 animate-pulse"
              />
            ))}
          </div>
        ) : filteredTodos.length > 0 ? (
          <ul className="space-y-3">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
                onUpdate={handleUpdateTodo}
              />
            ))}
          </ul>
        ) : (
          <div className="text-center py-16 px-4 bg-slate-900/40 rounded-2xl border border-slate-800/60">
            {searchQuery ? (
              <>
                <Inbox className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-medium text-slate-300">Ничего не найдено</h3>
                <p className="text-xs text-slate-500 mt-1">
                  По запросу «{searchQuery}» задачи отсутствуют.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-xs font-medium text-indigo-400 hover:text-indigo-300"
                >
                  Сбросить поиск
                </button>
              </>
            ) : filterStatus === 'completed' ? (
              <>
                <CheckCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-medium text-slate-300">
                  Нет завершённых задач
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Выполните одну из ваших текущих задач!
                </p>
              </>
            ) : todos.length === 0 ? (
              <>
                <Sparkles className="w-12 h-12 text-indigo-500/50 mx-auto mb-3" />
                <h3 className="text-base font-medium text-slate-200">
                  Список задач пуст
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Добавьте новую задачу с помощью поля выше, чтобы начать планирование.
                </p>
              </>
            ) : (
              <>
                <CheckCircle className="w-12 h-12 text-emerald-500/50 mx-auto mb-3" />
                <h3 className="text-base font-medium text-slate-200">
                  Все текущие задачи выполнены!
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Отличная работа! Можете отдохнуть или добавить новые задачи.
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span>To-Do List • Next.js & NestJS & PostgreSQL & Nginx</span>
        <button
          onClick={fetchTodos}
          disabled={loading}
          className="inline-flex items-center gap-1.5 hover:text-slate-300 transition"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          <span>Синхронизировать</span>
        </button>
      </footer>
    </main>
  );
}
