'use client';

import { useState, FormEvent, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Todo } from '@/types';

interface TodoListProps {
  todos: Todo[];
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onClearCompleted: () => void;
}

export function TodoList({
  todos,
  onAdd,
  onToggle,
  onDelete,
  onClearCompleted,
}: TodoListProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAdd(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      onAdd(inputValue);
      setInputValue('');
    }
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const pendingTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 w-full max-w-md mx-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">&#10003;</span>
        오늘 할 일
      </h2>

      {/* 입력 폼 */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="할 일을 입력하세요..."
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none transition-colors text-gray-700 placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="px-4 py-3 bg-gradient-to-r from-pink-400 to-orange-400 text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            추가
          </button>
        </div>
      </form>

      {/* TODO 리스트 */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {/* 미완료 TODO */}
          {pendingTodos.map((todo) => (
            <motion.div
              key={todo.id}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.2 }}
              className="group flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <button
                onClick={() => onToggle(todo.id)}
                className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-pink-400 flex items-center justify-center transition-colors flex-shrink-0"
              >
                {/* 빈 체크박스 */}
              </button>
              <span className="flex-1 text-gray-700 text-sm sm:text-base break-words">
                {todo.text}
              </span>
              <button
                onClick={() => onDelete(todo.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-opacity p-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </motion.div>
          ))}

          {/* 완료된 TODO */}
          {completedTodos.map((todo) => (
            <motion.div
              key={todo.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.2 }}
              className="group flex items-center gap-3 p-3 bg-green-50 rounded-xl"
            >
              <button
                onClick={() => onToggle(todo.id)}
                className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center flex-shrink-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
              <span className="flex-1 text-gray-400 line-through text-sm sm:text-base break-words">
                {todo.text}
              </span>
              <button
                onClick={() => onDelete(todo.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-opacity p-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* 빈 상태 */}
        {todos.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-4xl mb-2">&#128221;</p>
            <p>할 일을 추가해보세요!</p>
          </div>
        )}
      </div>

      {/* 하단 정보 */}
      {todos.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>
            {completedCount}/{todos.length} 완료
          </span>
          {completedCount > 0 && (
            <button
              onClick={onClearCompleted}
              className="text-pink-400 hover:text-pink-500 transition-colors"
            >
              완료 항목 삭제
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default TodoList;
