/**
 * 题目导航组件
 * 提供题目间的导航控制
 */

import React, { memo } from 'react';
import { ChevronLeft, ChevronRight, SkipForward, SkipBack } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QuestionNavigationProps } from '../types';

// 导航按钮组件
interface NavButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: 'previous' | 'next' | 'jump';
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  className?: string;
}

function NavButton({ 
  onClick, 
  disabled = false, 
  variant = 'next',
  icon, 
  label, 
  shortcut,
  className 
}: NavButtonProps) {
  const baseStyles = "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantStyles = {
    previous: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
    next: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    jump: "bg-gray-50 text-gray-600 hover:bg-gray-100 focus:ring-gray-400 dark:bg-gray-800/50 dark:text-gray-400 dark:hover:bg-gray-700"
  };
  
  const disabledStyles = "opacity-50 cursor-not-allowed pointer-events-none";
  
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyles,
        variantStyles[variant],
        disabled && disabledStyles,
        className
      )}
      aria-label={label}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      {shortcut && (
        <span className="hidden md:inline text-xs opacity-75 bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded">
          {shortcut}
        </span>
      )}
    </button>
  );
}

// 圆点指示器组件
interface DotsIndicatorProps {
  currentIndex: number;
  totalQuestions: number;
  onJumpTo?: (index: number) => void;
  maxDots?: number;
}

function DotsIndicator({ 
  currentIndex, 
  totalQuestions, 
  onJumpTo,
  maxDots = 10 
}: DotsIndicatorProps) {
  // 如果题目太多，只显示当前附近的点
  const shouldShowSubset = totalQuestions > maxDots;
  
  let startIndex = 0;
  let endIndex = totalQuestions - 1;
  
  if (shouldShowSubset) {
    const halfDots = Math.floor(maxDots / 2);
    startIndex = Math.max(0, currentIndex - halfDots);
    endIndex = Math.min(totalQuestions - 1, startIndex + maxDots - 1);
    
    // 调整起始位置，确保显示足够的点
    if (endIndex - startIndex + 1 < maxDots) {
      startIndex = Math.max(0, endIndex - maxDots + 1);
    }
  }
  
  const visibleIndices = Array.from(
    { length: endIndex - startIndex + 1 }, 
    (_, i) => startIndex + i
  );
  
  return (
    <div className="flex items-center gap-1.5 px-2">
      {shouldShowSubset && startIndex > 0 && (
        <>
          <button
            onClick={() => onJumpTo?.(0)}
            className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            aria-label="跳转到第一题"
          />
          <span className="text-xs text-gray-400">...</span>
        </>
      )}
      
      {visibleIndices.map(index => (
        <button
          key={index}
          onClick={() => onJumpTo?.(index)}
          className={cn(
            "w-2.5 h-2.5 rounded-full transition-all duration-200",
            index === currentIndex
              ? "bg-blue-600 dark:bg-blue-400 scale-125"
              : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 hover:scale-110"
          )}
          aria-label={`跳转到第${index + 1}题`}
        />
      ))}
      
      {shouldShowSubset && endIndex < totalQuestions - 1 && (
        <>
          <span className="text-xs text-gray-400">...</span>
          <button
            onClick={() => onJumpTo?.(totalQuestions - 1)}
            className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            aria-label="跳转到最后一题"
          />
        </>
      )}
    </div>
  );
}

function QuestionNavigationComponent({
  currentIndex,
  totalQuestions,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  onJumpTo,
  type = 'practice',
  title,
  showSubmit = false,
  canSubmit = false,
  onSubmit,
  className
}: QuestionNavigationProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4 px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700", className)}>
      {/* 左侧：题目信息和进度指示器 */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* 根据类型显示不同的标题区域 */}
        {type === 'practice' ? (
          <>
            <div className="text-sm text-gray-600 dark:text-gray-400 flex-shrink-0">
              <span className="font-medium">{currentIndex + 1}</span>
              <span className="mx-1">/</span>
              <span>{totalQuestions}</span>
            </div>
            
            {totalQuestions <= 20 && onJumpTo && (
              <DotsIndicator
                currentIndex={currentIndex}
                totalQuestions={totalQuestions}
                onJumpTo={onJumpTo}
              />
            )}
          </>
        ) : (
          <>
            {title && (
              <h2 className="font-medium text-gray-900 dark:text-gray-100 truncate text-sm">
                {title}
              </h2>
            )}
            <div className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
              <span className="font-medium">{currentIndex + 1}</span>
              <span className="mx-1">/</span>
              <span>{totalQuestions}</span>
            </div>
          </>
        )}
      </div>

      {/* 右侧：导航按钮组 */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* 导航按钮 */}
        <div className="flex items-center gap-1">
          {/* 跳转到首题 */}
          {currentIndex > 2 && onJumpTo && (
            <NavButton
              onClick={() => onJumpTo(0)}
              variant="jump"
              icon={<SkipBack className="w-3 h-3" />}
              label="首题"
              className="px-2 py-1 text-xs"
            />
          )}
          
          {/* 上一题 */}
          <NavButton
            onClick={onPrevious}
            disabled={!canGoPrevious}
            variant="previous"
            icon={<ChevronLeft className="w-3 h-3" />}
            label="上一题"
            shortcut="←"
            className="px-2 py-1 text-xs"
          />
          
          {/* 下一题 */}
          <NavButton
            onClick={onNext}
            disabled={!canGoNext}
            variant="next"
            icon={<ChevronRight className="w-3 h-3" />}
            label="下一题"
            shortcut="→"
            className="px-2 py-1 text-xs"
          />
          
          {/* 跳转到末题 */}
          {totalQuestions - currentIndex > 3 && onJumpTo && (
            <NavButton
              onClick={() => onJumpTo(totalQuestions - 1)}
              variant="jump"
              icon={<SkipForward className="w-3 h-3" />}
              label="末题"
              className="px-2 py-1 text-xs"
            />
          )}
        </div>

        {/* 提交按钮 - 桌面端显示，仅练习题显示 */}
        {showSubmit && type === 'practice' && (
          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            className={cn(
              "px-3 py-1 rounded text-xs font-medium transition-colors ml-2",
              canSubmit
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
            )}
          >
            提交
          </button>
        )}
      </div>
    </div>
  );
}

export const QuestionNavigation = memo(QuestionNavigationComponent, (prevProps, nextProps) => {
  return (
    prevProps.currentIndex === nextProps.currentIndex &&
    prevProps.totalQuestions === nextProps.totalQuestions &&
    prevProps.canGoPrevious === nextProps.canGoPrevious &&
    prevProps.canGoNext === nextProps.canGoNext &&
    prevProps.type === nextProps.type &&
    prevProps.title === nextProps.title &&
    prevProps.showSubmit === nextProps.showSubmit &&
    prevProps.canSubmit === nextProps.canSubmit &&
    prevProps.className === nextProps.className
  );
});

QuestionNavigation.displayName = 'QuestionNavigation';