'use client';

import { motion } from 'framer-motion';
import { usePixelTodo } from '@/hooks/usePixelTodo';
import { TodoList } from '@/components/TodoList';
import { PixelFrame } from '@/components/PixelFrame';
import { Gallery } from '@/components/Gallery';
import { StatsPanel } from '@/components/StatsPanel';

export default function Home() {
  const {
    todos,
    currentFrame,
    currentLevel,
    gallery,
    stats,
    fillMode,
    isLoaded,
    recentlyFilledCell,
    showCompletion,
    addTodo,
    deleteTodo,
    toggleTodo,
    changeFillMode,
    clearCompletedTodos,
  } = usePixelTodo();

  // 로딩 상태
  if (!isLoaded) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-orange-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-5xl mb-4 animate-float">&#127912;</div>
          <p className="text-gray-500">불러오는 중...</p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 pb-20">
      {/* 헤더 */}
      <header className="pt-6 pb-4 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
            Pixel TODO
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            할 일을 완료하고 그림을 완성하세요!
          </p>
        </motion.div>
      </header>

      {/* 통계 */}
      <section className="px-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatsPanel stats={stats} />
        </motion.div>
      </section>

      {/* 메인 컨텐츠 */}
      <div className="px-4 flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto">
        {/* 액자 */}
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:order-2 lg:flex-1"
        >
          <PixelFrame
            frame={currentFrame}
            level={currentLevel}
            fillMode={fillMode}
            onChangeFillMode={changeFillMode}
            recentlyFilledCell={recentlyFilledCell}
            showCompletion={showCompletion}
          />
        </motion.section>

        {/* TODO 리스트 */}
        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:order-1 lg:flex-1"
        >
          <TodoList
            todos={todos}
            onAdd={addTodo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onClearCompleted={clearCompletedTodos}
          />
        </motion.section>
      </div>

      {/* 설명 */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 px-4 text-center"
      >
        <div className="bg-white/50 rounded-xl p-4 max-w-md mx-auto">
          <p className="text-sm text-gray-500">
            <span className="font-medium text-pink-500">Tip:</span> TODO를 완료할 때마다 액자의 칸이 하나씩 색칠됩니다.
            <br />
            25개를 완료하면 액자가 완성되고 다음 그림으로 넘어가요!
          </p>
        </div>
      </motion.section>

      {/* 갤러리 버튼 */}
      <Gallery items={gallery} />
    </main>
  );
}
