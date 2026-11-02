'use client';

import React, { useState } from 'react';
import {
  Check,
  Trash2,
  Edit2,
  X,
  CheckCheck,
  Calendar,
} from 'lucide-react';
import { Todo, UpdateTodoInput } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number, currentCompleted: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, input: UpdateTodoInput) => Promise<void>;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDesc, setEditDesc] = useState(todo.description || '');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleToggle = async () => {
    if (isProcessing) return;
    try {
      setIsProcessing(true);
      await onToggle(todo.id, todo.isCompleted);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (isProcessing) return;
    try {
      setIsProcessing(true);
      await onDelete(todo.id);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveEdit = async () => {
    const cleanTitle = editTitle.trim();
    if (!cleanTitle || isProcessing) return;

    try {
      setIsProcessing(true);
      await onUpdate(todo.id, {
        title: cleanTitle,
        description: editDesc.trim() || undefined,
      });
      setIsEditing(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setEditDesc(todo.description || '');
    setIsEditing(false);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return '';
    }
  };

  return (
    <li
      className={`group relative bg-slate-900/70 border rounded-2xl p-4 transition-all duration-200 backdrop-blur-sm ${
        todo.isCompleted
          ? 'border-slate-800/60 bg-slate-900/30 opacity-75'
          : 'border-slate-800 hover:border-slate-700 hover:shadow-lg hover:shadow-indigo-500/5'
      }`}
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            disabled={isProcessing}
            maxLength={255}
            className="w-full bg-slate-950/80 border border-indigo-500 rounded-xl px-3 py-2 text-sm text-slate-100 outline-none"
            autoFocus
          />
          <textarea
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            disabled={isProcessing}
            rows={2}
            placeholder="Описание..."
            className="w-full bg-slate-950/80 border border-slate-700 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none resize-none"
          />
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={handleCancelEdit}
              disabled={isProcessing}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <X className="w-3.5 h-3.5" /> Отмена
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={!editTitle.trim() || isProcessing}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" /> Сохранить
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3.5">
          {/* Custom Checkbox */}
          <button
            type="button"
            onClick={handleToggle}
            disabled={isProcessing}
            aria-label={todo.isCompleted ? 'Отметить как невыполненную' : 'Отметить как выполненную'}
            className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
              todo.isCompleted
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                : 'border-slate-700 bg-slate-950/40 text-transparent hover:border-indigo-400 hover:text-indigo-400/40'
            }`}
          >
            <CheckCheck className={`w-3.5 h-3.5 stroke-[2.5] ${todo.isCompleted ? 'text-white' : ''}`} />
          </button>

          {/* Text Info */}
          <div className="flex-1 min-w-0" onClick={handleToggle}>
            <div className="cursor-pointer select-none">
              <h3
                className={`text-sm sm:text-base font-medium break-words transition-all ${
                  todo.isCompleted
                    ? 'line-through text-slate-500'
                    : 'text-slate-100'
                }`}
              >
                {todo.title}
              </h3>
              {todo.description && (
                <p
                  className={`mt-1 text-xs break-words whitespace-pre-wrap transition-all ${
                    todo.isCompleted ? 'line-through text-slate-600' : 'text-slate-400'
                  }`}
                >
                  {todo.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(todo.createdAt)}</span>
              {todo.isCompleted && (
                <span className="text-emerald-400/90 font-medium ml-1">
                  • Выполнено
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              disabled={isProcessing}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
              title="Редактировать"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isProcessing}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
              title="Удалить задачу"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </li>
  );
};
