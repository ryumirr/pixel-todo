'use client';

import { motion } from 'framer-motion';
import { Frame, FillMode } from '@/types';
import { UNFILLED_COLOR, HINT_OPACITY } from '@/data/pixelArt';
import { getProgress } from '@/utils/frame';

interface PixelFrameProps {
  frame: Frame | null;
  level: number;
  fillMode: FillMode;
  onChangeFillMode: (mode: FillMode) => void;
  recentlyFilledCell: { x: number; y: number } | null;
  showCompletion: boolean;
}

export function PixelFrame({
  frame,
  level,
  fillMode,
  onChangeFillMode,
  recentlyFilledCell,
  showCompletion,
}: PixelFrameProps) {
  if (!frame) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm mx-auto">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="aspect-square bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const progress = getProgress(frame);
  const cellSize = 100 / frame.gridSize;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 w-full max-w-sm mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            Lv.{level + 1} {frame.name}
          </h2>
          <p className="text-sm text-gray-500">
            {frame.filledCount}/{frame.totalCells} 칸 완료
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
            {progress}%
          </span>
        </div>
      </div>

      {/* 진행률 바 */}
      <div className="h-2 bg-gray-100 rounded-full mb-4 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-pink-400 to-orange-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* 액자 그리드 (SVG) */}
      <motion.div
        className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden border-4 border-gray-200"
        animate={
          showCompletion
            ? {
                scale: [1, 1.05, 1],
                boxShadow: [
                  '0 0 0 rgba(255,182,193,0)',
                  '0 0 30px rgba(255,182,193,0.8)',
                  '0 0 0 rgba(255,182,193,0)',
                ],
              }
            : {}
        }
        transition={{ duration: 0.6 }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {frame.cells.map((cell) => {
            const isRecent =
              recentlyFilledCell &&
              recentlyFilledCell.x === cell.x &&
              recentlyFilledCell.y === cell.y;

            // 색칠되지 않은 셀은 힌트 색상 (살짝 보임)
            const displayColor = cell.filled
              ? cell.color
              : UNFILLED_COLOR;

            // 힌트 (완성될 색상 살짝 보여주기)
            const hintColor = cell.color;

            return (
              <g key={`${cell.x}-${cell.y}`}>
                {/* 힌트 (아직 색칠 안된 셀에 보여줌) */}
                {!cell.filled && (
                  <rect
                    x={cell.x * cellSize}
                    y={cell.y * cellSize}
                    width={cellSize}
                    height={cellSize}
                    fill={hintColor}
                    opacity={HINT_OPACITY}
                  />
                )}

                {/* 메인 셀 */}
                <motion.rect
                  x={cell.x * cellSize}
                  y={cell.y * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill={cell.filled ? displayColor : 'transparent'}
                  stroke="#e5e5e5"
                  strokeWidth={0.5}
                  initial={false}
                  animate={
                    isRecent
                      ? {
                          scale: [1, 1.2, 1],
                          opacity: [0, 1],
                        }
                      : {}
                  }
                  transition={{ duration: 0.3 }}
                  style={{
                    transformOrigin: `${cell.x * cellSize + cellSize / 2}px ${
                      cell.y * cellSize + cellSize / 2
                    }px`,
                  }}
                />

                {/* 빈 셀 테두리 */}
                {!cell.filled && (
                  <rect
                    x={cell.x * cellSize}
                    y={cell.y * cellSize}
                    width={cellSize}
                    height={cellSize}
                    fill="transparent"
                    stroke="#ddd"
                    strokeWidth={0.3}
                    strokeDasharray="2,2"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* 완성 오버레이 */}
        {showCompletion && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white rounded-full p-4 shadow-lg"
            >
              <span className="text-4xl">&#127881;</span>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* 색칠 모드 선택 */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <span className="text-sm text-gray-500">색칠 순서:</span>
        <div className="flex rounded-lg overflow-hidden border border-gray-200">
          <button
            onClick={() => onChangeFillMode('sequential')}
            className={`px-3 py-1.5 text-sm transition-colors ${
              fillMode === 'sequential'
                ? 'bg-pink-400 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            순차
          </button>
          <button
            onClick={() => onChangeFillMode('random')}
            className={`px-3 py-1.5 text-sm transition-colors ${
              fillMode === 'random'
                ? 'bg-pink-400 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            랜덤
          </button>
        </div>
      </div>

      {/* 완성 메시지 */}
      {showCompletion && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center"
        >
          <p className="text-lg font-bold text-pink-500">
            &#127881; 액자 완성! &#127881;
          </p>
          <p className="text-sm text-gray-500">다음 그림으로 이동합니다...</p>
        </motion.div>
      )}
    </div>
  );
}

export default PixelFrame;
