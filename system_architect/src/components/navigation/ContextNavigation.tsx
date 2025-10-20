/**
 * 通用上下文导航组件
 * 提供统一的页面级导航，包含返回按钮、页面标识和功能区域
 */

'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export type NavigationType = 'practice' | 'case-analysis' | 'essay-guidance';

interface ContextNavigationProps {
  // 基础信息
  type: NavigationType;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  
  // 返回功能
  onBack: () => void;
  backLabel?: string;
  
  // 右侧功能区域
  actions?: React.ReactNode;
  
  // 样式
  className?: string;
}

const typeConfig = {
  practice: {
    defaultBackLabel: '返回练习题库',
    iconColor: 'text-blue-600'
  },
  'case-analysis': {
    defaultBackLabel: '返回案例分析',
    iconColor: 'text-blue-600'
  },
  'essay-guidance': {
    defaultBackLabel: '返回论文指导',
    iconColor: 'text-green-600'
  }
};

export function ContextNavigation({
  type,
  title,
  subtitle,
  icon,
  onBack,
  backLabel,
  actions,
  className
}: ContextNavigationProps) {
  const config = typeConfig[type];
  const finalBackLabel = backLabel || config.defaultBackLabel;

  return (
    <div className={cn(
      "flex-shrink-0 px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700",
      className
    )}>
      <div className="flex items-center justify-between">
        {/* 左侧：返回按钮 + 页面标识 */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{finalBackLabel}</span>
          </button>
          
          <div className="h-4 w-px bg-gray-300 dark:border-gray-600 flex-shrink-0" />
          
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {icon && (
              <div className={cn("flex-shrink-0", config.iconColor)}>
                {icon}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 右侧：功能区域 */}
        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}