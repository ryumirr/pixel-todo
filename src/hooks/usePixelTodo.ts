'use client';

import { useState, useEffect, useCallback } from 'react';
import { Todo, Frame, GalleryItem, Stats, FillMode, STORAGE_KEYS } from '@/types';
import { useLocalStorage } from './useLocalStorage';
import {
  createFrame,
  shuffleFillOrder,
  fillNextCell,
  generateId,
  getTodayString,
  getYesterdayString,
} from '@/utils/frame';

const initialStats: Stats = {
  todayCompleted: 0,
  totalCompleted: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: null,
  completedFrames: 0,
};

export function usePixelTodo() {
  // 로컬 저장소 상태
  const [todos, setTodos, todosLoaded] = useLocalStorage<Todo[]>(
    STORAGE_KEYS.TODOS,
    []
  );
  const [currentLevel, setCurrentLevel, levelLoaded] = useLocalStorage<number>(
    STORAGE_KEYS.CURRENT_LEVEL,
    0
  );
  const [gallery, setGallery, galleryLoaded] = useLocalStorage<GalleryItem[]>(
    STORAGE_KEYS.GALLERY,
    []
  );
  const [stats, setStats, statsLoaded] = useLocalStorage<Stats>(
    STORAGE_KEYS.STATS,
    initialStats
  );
  const [fillMode, setFillMode, fillModeLoaded] = useLocalStorage<FillMode>(
    STORAGE_KEYS.FILL_MODE,
    'sequential'
  );
  const [savedFrame, setSavedFrame, frameLoaded] = useLocalStorage<Frame | null>(
    STORAGE_KEYS.CURRENT_FRAME,
    null
  );

  // 현재 액자 상태
  const [currentFrame, setCurrentFrame] = useState<Frame | null>(null);

  // 최근 색칠된 셀 (애니메이션용)
  const [recentlyFilledCell, setRecentlyFilledCell] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // 완성 애니메이션 트리거
  const [showCompletion, setShowCompletion] = useState(false);

  // 모든 데이터 로드 완료 여부
  const isLoaded =
    todosLoaded &&
    levelLoaded &&
    galleryLoaded &&
    statsLoaded &&
    fillModeLoaded &&
    frameLoaded;

  // 초기 액자 설정
  useEffect(() => {
    if (!isLoaded) return;

    if (savedFrame && !savedFrame.completed) {
      setCurrentFrame(savedFrame);
    } else {
      const newFrame = createFrame(currentLevel);
      const preparedFrame =
        fillMode === 'random' ? shuffleFillOrder(newFrame) : newFrame;
      setCurrentFrame(preparedFrame);
    }
  }, [isLoaded, savedFrame, currentLevel, fillMode]);

  // 액자 변경 시 저장
  useEffect(() => {
    if (currentFrame && isLoaded) {
      setSavedFrame(currentFrame);
    }
  }, [currentFrame, isLoaded, setSavedFrame]);

  // 오늘 날짜 체크 및 streak 업데이트
  useEffect(() => {
    if (!isLoaded) return;

    const today = getTodayString();
    const yesterday = getYesterdayString();

    // 오늘 처음 접속한 경우
    if (stats.lastCompletedDate !== today) {
      // 연속 달성 체크
      if (stats.lastCompletedDate === yesterday) {
        // 어제 완료했으면 streak 유지
      } else if (stats.lastCompletedDate !== today) {
        // streak 리셋 (오늘 완료 시 1로 시작)
        setStats((prev) => ({
          ...prev,
          todayCompleted: 0,
        }));
      }
    }
  }, [isLoaded, stats.lastCompletedDate, setStats]);

  // TODO 추가
  const addTodo = useCallback(
    (text: string) => {
      const newTodo: Todo = {
        id: generateId(),
        text: text.trim(),
        completed: false,
        createdAt: Date.now(),
      };
      setTodos((prev) => [newTodo, ...prev]);
    },
    [setTodos]
  );

  // TODO 삭제
  const deleteTodo = useCallback(
    (id: string) => {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    },
    [setTodos]
  );

  // TODO 완료 토글
  const toggleTodo = useCallback(
    (id: string) => {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      // 이미 완료된 TODO를 다시 미완료로 바꾸는 경우
      if (todo.completed) {
        setTodos((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, completed: false, completedAt: undefined } : t
          )
        );
        return;
      }

      // TODO 완료 처리
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, completed: true, completedAt: Date.now() } : t
        )
      );

      // 액자 칸 색칠
      if (currentFrame && !currentFrame.completed) {
        const { frame: updatedFrame, filledCell } = fillNextCell(
          currentFrame,
          fillMode
        );

        if (filledCell) {
          setRecentlyFilledCell({ x: filledCell.x, y: filledCell.y });
          setTimeout(() => setRecentlyFilledCell(null), 500);
        }

        setCurrentFrame(updatedFrame);

        // 통계 업데이트
        const today = getTodayString();
        const yesterday = getYesterdayString();

        setStats((prev) => {
          let newStreak = prev.currentStreak;

          // streak 계산
          if (prev.lastCompletedDate === today) {
            // 오늘 이미 완료한 적 있음 - streak 유지
          } else if (prev.lastCompletedDate === yesterday) {
            // 어제 완료 - streak 증가
            newStreak += 1;
          } else {
            // streak 리셋하고 1로 시작
            newStreak = 1;
          }

          return {
            ...prev,
            todayCompleted: prev.lastCompletedDate === today
              ? prev.todayCompleted + 1
              : 1,
            totalCompleted: prev.totalCompleted + 1,
            currentStreak: newStreak,
            longestStreak: Math.max(prev.longestStreak, newStreak),
            lastCompletedDate: today,
          };
        });

        // 액자 완성 체크
        if (updatedFrame.completed) {
          setShowCompletion(true);

          // 갤러리에 추가
          const galleryItem: GalleryItem = {
            id: generateId(),
            frameId: updatedFrame.id,
            name: updatedFrame.name,
            theme: updatedFrame.theme,
            completedAt: Date.now(),
            imageData: updatedFrame.imageData,
          };
          setGallery((prev) => [galleryItem, ...prev]);

          // 통계 업데이트
          setStats((prev) => ({
            ...prev,
            completedFrames: prev.completedFrames + 1,
          }));

          // 다음 레벨로 이동 (약간의 딜레이 후)
          setTimeout(() => {
            const nextLevel = currentLevel + 1;
            setCurrentLevel(nextLevel);
            const newFrame = createFrame(nextLevel);
            const preparedFrame =
              fillMode === 'random' ? shuffleFillOrder(newFrame) : newFrame;
            setCurrentFrame(preparedFrame);
            setShowCompletion(false);
          }, 2000);
        }
      }
    },
    [
      todos,
      setTodos,
      currentFrame,
      fillMode,
      setStats,
      setGallery,
      currentLevel,
      setCurrentLevel,
    ]
  );

  // 색칠 모드 변경
  const changeFillMode = useCallback(
    (mode: FillMode) => {
      setFillMode(mode);

      // 현재 액자가 있고 시작 전이면 순서 재설정
      if (currentFrame && currentFrame.filledCount === 0) {
        if (mode === 'random') {
          setCurrentFrame(shuffleFillOrder(currentFrame));
        } else {
          // 순차로 복원
          const newFrame = createFrame(currentLevel);
          setCurrentFrame(newFrame);
        }
      }
    },
    [setFillMode, currentFrame, currentLevel]
  );

  // TODO 전체 삭제 (완료된 것만)
  const clearCompletedTodos = useCallback(() => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }, [setTodos]);

  return {
    // 상태
    todos,
    currentFrame,
    currentLevel,
    gallery,
    stats,
    fillMode,
    isLoaded,
    recentlyFilledCell,
    showCompletion,

    // 액션
    addTodo,
    deleteTodo,
    toggleTodo,
    changeFillMode,
    clearCompletedTodos,
  };
}

export default usePixelTodo;
