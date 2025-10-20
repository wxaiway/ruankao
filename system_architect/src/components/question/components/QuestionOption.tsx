/**
 * 题目选项组件
 * 独立的选项展示和交互组件
 */

import React, { memo } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QuestionOptionProps } from '../types';

// 选项状态样式映射
const getOptionStyles = (
  selected: boolean,
  disabled: boolean,
  showResult: boolean,
  isCorrect?: boolean
) => {
  const baseStyles = "group w-full p-4 border-2 rounded-xl transition-all duration-200 touch-manipulation min-h-[56px] flex items-center gap-4 text-left";
  
  // 禁用状态
  if (disabled && !showResult) {
    return cn(baseStyles, "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed opacity-60");
  }
  
  // 显示结果状态
  if (showResult) {
    if (isCorrect === true) {
      // 正确答案
      return cn(baseStyles, "border-green-500 bg-green-50 dark:bg-green-900/20 cursor-default shadow-sm ring-1 ring-green-500/20");
    } else if (selected && isCorrect === false) {
      // 选择的错误答案
      return cn(baseStyles, "border-red-500 bg-red-50 dark:bg-red-900/20 cursor-default shadow-sm ring-1 ring-red-500/20");
    } else {
      // 其他选项（灰化）
      return cn(baseStyles, "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 cursor-default opacity-40");
    }
  }
  
  // 正常交互状态
  if (selected) {
    return cn(
      baseStyles,
      "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md scale-[0.98] ring-2 ring-blue-500/20",
      "hover:scale-[0.97] hover:shadow-lg"
    );
  }
  
  return cn(
    baseStyles,
    "border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/10",
    "hover:shadow-sm hover:scale-[0.99] active:scale-[0.97]",
    "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
  );
};

// 选项标识符样式
const getLabelStyles = (
  selected: boolean,
  showResult: boolean,
  isCorrect?: boolean
) => {
  const baseStyles = "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-200";
  
  if (showResult) {
    if (isCorrect === true) {
      return cn(baseStyles, "border-green-500 bg-green-500 text-white");
    } else if (selected && isCorrect === false) {
      return cn(baseStyles, "border-red-500 bg-red-500 text-white");
    } else {
      return cn(baseStyles, "border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500");
    }
  }
  
  if (selected) {
    return cn(baseStyles, "border-blue-500 bg-blue-500 text-white shadow-sm");
  }
  
  return cn(baseStyles, "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 group-hover:border-blue-400 group-hover:text-blue-600");
};

function QuestionOptionComponent({
  option,
  selected,
  disabled,
  showResult,
  isCorrect,
  onClick,
  className
}: QuestionOptionProps) {
  const handleClick = () => {
    if (!disabled && !showResult) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled && !showResult}
      className={cn(
        getOptionStyles(selected, disabled, showResult, isCorrect),
        className
      )}
      aria-pressed={selected}
      aria-disabled={disabled}
      role="radio"
      tabIndex={disabled ? -1 : 0}
    >
      {/* 选项标识符 */}
      <div className={getLabelStyles(selected, showResult, isCorrect)}>
        {option.key}
      </div>
      
      {/* 选项内容 */}
      <div className="flex-1 text-base leading-relaxed">
        {option.text}
      </div>
      
      {/* 结果指示器 */}
      {showResult && (
        <div className="flex-shrink-0">
          {isCorrect === true ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : selected && isCorrect === false ? (
            <XCircle className="w-6 h-6 text-red-600" />
          ) : null}
        </div>
      )}
      
      {/* 键盘提示 */}
      {!disabled && !showResult && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-60 transition-opacity">
          <div className="text-xs text-gray-400 bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded border">
            {option.key}
          </div>
        </div>
      )}
    </button>
  );
}

// 使用memo优化重渲染
export const QuestionOption = memo(QuestionOptionComponent, (prevProps, nextProps) => {
  return (
    prevProps.option.key === nextProps.option.key &&
    prevProps.selected === nextProps.selected &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.showResult === nextProps.showResult &&
    prevProps.isCorrect === nextProps.isCorrect &&
    prevProps.className === nextProps.className
  );
});

QuestionOption.displayName = 'QuestionOption';