'use client';

import React from 'react';
import { CheckCircle2, ListTodo } from 'lucide-react';

interface TodoHeaderProps {
  total: number;
  completed: number;
}

export const TodoHeader: React.FC<TodoHeaderProps> = ({ total, completed }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <header className="mb-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <ListTodo className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              Список задач
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                Next + Nest
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Организуйте ваши дела эффективно
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-2xl backdrop-blur-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <div className="text-right">
            <div className="text-xs text-slate-400 font-medium">Выполнено</div>
            <div className="text-sm font-semibold text-slate-200">
              {completed} из {total} ({percentage}%)
            </div>
          </div>
        </div>
      </div>

      {total > 0 && (
        <div className="mt-4 w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-1.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </header>
  );
};
