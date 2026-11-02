'use client';

import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { CreateTodoInput } from '../types/todo';

interface TodoFormProps {
  onAdd: (input: CreateTodoInput) => Promise<void>;
  disabled?: boolean;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onAdd, disabled }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onAdd({
        title: cleanTitle,
        description: description.trim() || undefined,
      });
      setTitle('');
      setDescription('');
      setShowDescription(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md mb-6 transition-all duration-200 hover:border-slate-700"
    >
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Что необходимо сделать?..."
          disabled={disabled || isSubmitting}
          maxLength={255}
          className="flex-1 bg-slate-950/60 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition"
        />

        <button
          type="button"
          onClick={() => setShowDescription(!showDescription)}
          className="p-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-xl transition border border-transparent hover:border-slate-700"
          title={showDescription ? 'Скрыть описание' : 'Добавить описание'}
        >
          {showDescription ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>

        <button
          type="submit"
          disabled={!title.trim() || disabled || isSubmitting}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium px-4 py-3 rounded-xl text-sm transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
        >
          {isSubmitting ? (
            <Sparkles className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">Добавить</span>
        </button>
      </div>

      {showDescription && (
        <div className="mt-3 animate-in fade-in duration-200">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Добавьте дополнительное описание или заметки (необязательно)..."
            disabled={disabled || isSubmitting}
            rows={2}
            className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition resize-none"
          />
        </div>
      )}
    </form>
  );
};
