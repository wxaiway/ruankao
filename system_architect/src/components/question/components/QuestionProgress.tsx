/**
 * 题目进度组件
 * 显示答题进度和统计信息
 */

import React, { memo } from 'react';
import { Target, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QuestionProgressProps } from '../types';

// 进度条颜色配置
const getProgressColor = (accuracy: number) => {
  if (accuracy >= 80) return 'bg-green-500';
  if (accuracy >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
};

// 统计项组件
interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color?: string;
  className?: string;
}

function StatItem({ icon, label, value, color = 'text-gray-600', className }: StatItemProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("w-5 h-5", color)}>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</span>
      </div>
    </div>
  );
}

function QuestionProgressComponent({
  current,
  total,
  answered,
  correct,
  showStats = true,
  className
}: QuestionProgressProps) {
  // 计算百分比
  const progressPercent = total > 0 ? (current / total) * 100 : 0;
  const answeredPercent = total > 0 ? (answered / total) * 100 : 0;
  const accuracy = answered > 0 ? (correct / answered) * 100 : 0;
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* 主进度条 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-900 dark:text-gray-100">
            第 {current + 1} 题
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            {current + 1} / {total}
          </span>
        </div>
        
        <div className="relative">
          {/* 背景进度条 */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            {/* 当前进度 */}
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 relative"
              style={{ width: `${progressPercent}%` }}
            >
              {/* 进度指示器 */}
              <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full border-2 border-white dark:border-gray-900 shadow-sm" />
            </div>
          </div>
          
          {/* 答题进度背景条 */}
          {showStats && (
            <div 
              className="absolute top-0 bg-blue-200 dark:bg-blue-800 h-2 rounded-full opacity-50 transition-all duration-300"
              style={{ width: `${answeredPercent}%` }}
            />
          )}
        </div>
      </div>

      {/* 统计信息 */}
      {showStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <StatItem
            icon={<Target />}
            label="总题数"
            value={total}
            color="text-blue-600"
          />
          
          <StatItem
            icon={<CheckCircle />}
            label="已答题"
            value={answered}
            color="text-green-600"
          />
          
          <StatItem
            icon={<AlertCircle />}
            label="正确数"
            value={correct}
            color="text-emerald-600"
          />
          
          <StatItem
            icon={<Target />}
            label="正确率"
            value={`${Math.round(accuracy)}%`}
            color={accuracy >= 80 ? 'text-green-600' : accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'}
          />
        </div>
      )}

      {/* 简化版进度条（移动端） */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>已答 {answered}/{total}</span>
          {answered > 0 && (
            <span className={cn(
              "font-medium",
              accuracy >= 80 ? 'text-green-600' : accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
            )}>
              {Math.round(accuracy)}% 正确
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export const QuestionProgress = memo(QuestionProgressComponent, (prevProps, nextProps) => {
  return (
    prevProps.current === nextProps.current &&
    prevProps.total === nextProps.total &&
    prevProps.answered === nextProps.answered &&
    prevProps.correct === nextProps.correct &&
    prevProps.showStats === nextProps.showStats &&
    prevProps.className === nextProps.className
  );
});

QuestionProgress.displayName = 'QuestionProgress';