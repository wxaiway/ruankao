import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, BookOpen, Clock, Users } from 'lucide-react';
import { Category, Chapter } from '@/lib/content';
import { YearBadge } from '@/components/ui/YearSwitcher';
import { getContainerClasses, getPaddingClasses } from '@/lib/layout-config';

interface ChapterHeaderProps {
  category: Category;
  chapter: Chapter;
}

export function ChapterHeader({ category, chapter }: ChapterHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className={`${getContainerClasses('main')} ${getPaddingClasses('horizontal')} py-6`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {chapter.title}
            </h1>
            
            {chapter.description && (
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                {chapter.description}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{chapter.materials.length} 学习材料</span>
              </div>
              
              {chapter.metadata.estimatedMinutes && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>约 {chapter.metadata.estimatedMinutes} 分钟</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{category.name}</span>
              </div>
              
              {/* 年份标识 */}
              {category.year && (
                <YearBadge year={category.year} />
              )}
            </div>
          </div>
          
          {/* Chapter Stats */}
          <div className="flex-shrink-0">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {chapter.materials.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  学习材料
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {chapter.metadata.status === 'published' ? '已发布' : '制作中'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  状态
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}