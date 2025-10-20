'use client';

import { useRouter, usePathname } from 'next/navigation';
import { getAvailableYears, getCurrentYear, getYearConfig, generateYearPath, parseYearFromPath } from '@/config/years';
import { Button } from './Button';
import { Calendar } from 'lucide-react';

interface YearSwitcherProps {
  currentYear?: number;
  className?: string;
}

export function YearSwitcher({ currentYear = getCurrentYear(), className = '' }: YearSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const availableYears = getAvailableYears();

  const handleYearChange = (year: number) => {
    if (year === currentYear) return;
    
    // 解析当前路径，获取清理后的路径
    const { cleanPath } = parseYearFromPath(pathname);
    
    // 使用清理后的路径生成新的年份路径
    const newPath = generateYearPath(year, cleanPath);
    router.push(newPath);
  };

  // Don't render if only one year available
  if (availableYears.length <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Calendar className="w-4 h-4 text-gray-500" />
      <span className="text-sm text-gray-600 dark:text-gray-400">版本:</span>
      <div className="flex gap-1">
        {availableYears.map(year => {
          const config = getYearConfig(year);
          if (!config) return null;
          
          const isActive = year === currentYear;
          const isArchived = config.isArchived;
          
          return (
            <Button
              key={year}
              variant={isActive ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleYearChange(year)}
              className={`min-w-[4rem] ${
                isArchived 
                  ? 'opacity-75 hover:opacity-100' 
                  : ''
              }`}
              title={`${config.name} - ${config.description}`}
            >
              {year}
              {isActive && !isArchived && (
                <span className="ml-1 text-xs">✨</span>
              )}
              {isArchived && (
                <span className="ml-1 text-xs opacity-60">📁</span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

interface YearBadgeProps {
  year: number;
  className?: string;
}

export function YearBadge({ year, className = '' }: YearBadgeProps) {
  const config = getYearConfig(year);
  if (!config) return null;

  const isDefault = config.isDefault;
  const isArchived = config.isArchived;

  return (
    <span 
      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
        isDefault 
          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
          : isArchived
          ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      } ${className}`}
      title={config.description}
    >
      {year}年版
      {isDefault && <span className="ml-1">✨</span>}
      {isArchived && <span className="ml-1">📁</span>}
    </span>
  );
}

export default YearSwitcher;