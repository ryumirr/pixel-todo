'use client';

import { motion } from 'framer-motion';
import { Stats } from '@/types';

interface StatsPanelProps {
  stats: Stats;
}

export function StatsPanel({ stats }: StatsPanelProps) {
  const statItems = [
    {
      label: '오늘 완료',
      value: stats.todayCompleted,
      icon: '&#127793;',
      color: 'from-green-400 to-emerald-400',
    },
    {
      label: '연속 달성',
      value: `${stats.currentStreak}일`,
      icon: '&#128293;',
      color: 'from-orange-400 to-red-400',
    },
    {
      label: '총 완료',
      value: stats.totalCompleted,
      icon: '&#10003;',
      color: 'from-blue-400 to-cyan-400',
    },
    {
      label: '완성 액자',
      value: stats.completedFrames,
      icon: '&#127912;',
      color: 'from-purple-400 to-pink-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl mx-auto">
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-lg"
              dangerouslySetInnerHTML={{ __html: item.icon }}
            />
            <span className="text-xs text-gray-500">{item.label}</span>
          </div>
          <div
            className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}
          >
            {item.value}
          </div>
        </motion.div>
      ))}

      {/* 최고 연속 기록 표시 */}
      {stats.longestStreak > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="col-span-2 sm:col-span-4 text-center text-sm text-gray-400 mt-1"
        >
          &#127942; 최고 연속 기록: {stats.longestStreak}일
        </motion.div>
      )}
    </div>
  );
}

export default StatsPanel;
