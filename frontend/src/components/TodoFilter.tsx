'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { FilterStatus } from '../types/todo';

interface TodoFilterProps {
  status: FilterStatus;
  onStatusChange: (status: FilterStatus) => void;
  search: string;
  onSearchChange: (search: string) => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
}

export const TodoFilter: React.FC<TodoFilterProps> = ({
  status,
  onStatusChange,
  search,
  onSearchChange,
  counts,
}) => {
  const tabs: { key: FilterStatus; label: string; count: number }[] = [
    { key: 'all', label: 'Все', count: counts.all },
    { key: 'active', label: 'В работе', count: counts.active },
    { key: 'completed', label: 'Завершённые', count: counts.completed },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6 items-stretch sm:items-center justify-between">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Поиск по задачам..."
          className="w-full bg-slate-900/60 border border-slate-800 focus:border-indigo-500 rounded-xl pl-9 pr-9 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 outline-none transition"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
        {tabs.map((tab) => {
          const isActive = status === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onStatusChange(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isActive
                    ? 'bg-indigo-700/80 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
