'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryItem } from '@/types';

interface GalleryProps {
  items: GalleryItem[];
}

export function Gallery({ items }: GalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      {/* 갤러리 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-gradient-to-r from-purple-400 to-pink-400 text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow z-40"
      >
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-400 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {items.length}
            </span>
          )}
        </div>
      </button>

      {/* 갤러리 모달 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 모달 헤더 */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <span>&#128444;</span>
                  완성한 액자 갤러리
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
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
              </div>

              {/* 갤러리 그리드 */}
              <div className="p-4 overflow-y-auto max-h-[60vh]">
                {items.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <p className="text-5xl mb-4">&#128247;</p>
                    <p>아직 완성한 액자가 없어요</p>
                    <p className="text-sm mt-2">TODO를 완료해서 액자를 채워보세요!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="cursor-pointer"
                        onClick={() => setSelectedItem(item)}
                      >
                        <div className="bg-gray-50 rounded-xl p-2 hover:bg-gray-100 transition-colors border-2 border-transparent hover:border-pink-200">
                          {/* 미니 픽셀 아트 */}
                          <svg
                            viewBox="0 0 100 100"
                            className="w-full aspect-square rounded-lg overflow-hidden"
                          >
                            {item.imageData.map((row, y) =>
                              row.map((color, x) => (
                                <rect
                                  key={`${x}-${y}`}
                                  x={x * 20}
                                  y={y * 20}
                                  width={20}
                                  height={20}
                                  fill={color}
                                />
                              ))
                            )}
                          </svg>
                          <p className="text-xs text-center text-gray-600 mt-2 font-medium truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-center text-gray-400">
                            {formatDate(item.completedAt)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 선택된 아이템 상세 모달 */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 max-w-xs w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full aspect-square rounded-xl overflow-hidden border-4 border-gray-200"
                >
                  {selectedItem.imageData.map((row, y) =>
                    row.map((color, x) => (
                      <rect
                        key={`${x}-${y}`}
                        x={x * 20}
                        y={y * 20}
                        width={20}
                        height={20}
                        fill={color}
                      />
                    ))
                  )}
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 text-center">
                {selectedItem.name}
              </h3>
              <p className="text-sm text-gray-500 text-center mt-1">
                {formatDate(selectedItem.completedAt)} 완성
              </p>
              <button
                onClick={() => setSelectedItem(null)}
                className="mt-4 w-full py-2 bg-gradient-to-r from-pink-400 to-orange-400 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                닫기
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Gallery;
