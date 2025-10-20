'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { 
  ArrowLeft, 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown,
  Home,
  BookOpen,
  List
} from 'lucide-react';
import { Category, Chapter } from '@/lib/content';
import { getContainerClasses, getPaddingClasses } from '@/lib/layout-config';

interface EnhancedBreadcrumbProps {
  category: Category;
  chapter: Chapter;
}

export function EnhancedBreadcrumb({ category, chapter }: EnhancedBreadcrumbProps) {
  const [showChapterNav, setShowChapterNav] = useState(false);
  
  // 获取当前章节在分类中的位置
  const currentChapterIndex = category.chapters.findIndex(ch => ch.id === chapter.id);
  const prevChapter = currentChapterIndex > 0 ? category.chapters[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex < category.chapters.length - 1 
    ? category.chapters[currentChapterIndex + 1] 
    : null;

  // 点击外部区域关闭章节导航下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.chapter-nav-dropdown')) {
        setShowChapterNav(false);
      }
    };

    if (showChapterNav) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showChapterNav]);

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className={`${getContainerClasses('main')} ${getPaddingClasses('horizontal')} py-4`}>
        
        {/* 面包屑导航 */}
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="sm" asChild className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <Link href="/" className="flex items-center gap-1">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">首页</span>
            </Link>
          </Button>
          
          <ChevronRight className="w-4 h-4 text-gray-400" />
          
          <Button variant="ghost" size="sm" asChild className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <Link href={category.path} className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {category.name}
            </Link>
          </Button>
          
          <ChevronRight className="w-4 h-4 text-gray-400" />
          
          <span className="text-gray-900 dark:text-gray-100 font-medium">
            {chapter.title}
          </span>
        </div>

        {/* 章节导航栏 */}
        <div className="flex items-center justify-between gap-4">
          
          {/* 左侧：上一章/下一章 */}
          <div className="flex items-center gap-2">
            {prevChapter ? (
              <Button variant="outline" size="sm" asChild>
                <Link href={prevChapter.path} className="flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">上一章</span>
                  <span className="sm:hidden">上一章</span>
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled className="flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">上一章</span>
                <span className="sm:hidden">上一章</span>
              </Button>
            )}
            
            {nextChapter ? (
              <Button variant="outline" size="sm" asChild>
                <Link href={nextChapter.path} className="flex items-center gap-2">
                  <span className="hidden sm:inline">下一章</span>
                  <span className="sm:hidden">下一章</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled className="flex items-center gap-2">
                <span className="hidden sm:inline">下一章</span>
                <span className="sm:hidden">下一章</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* 中间：当前位置指示 */}
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>第 {currentChapterIndex + 1} 章</span>
            <span>/</span>
            <span>共 {category.chapters.length} 章</span>
          </div>

          {/* 右侧：章节列表下拉菜单 */}
          <div className="relative chapter-nav-dropdown">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowChapterNav(!showChapterNav)}
              className="flex items-center gap-2"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">章节列表</span>
              <span className="sm:hidden">列表</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showChapterNav ? 'rotate-180' : ''}`} />
            </Button>

            {/* 下拉菜单 */}
            {showChapterNav && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                <div className="p-2">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 px-2">
                    {category.name} - 章节目录
                  </div>
                  {category.chapters.map((ch, index) => (
                    <Link
                      key={ch.id}
                      href={ch.path}
                      className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                        ch.id === chapter.id
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => setShowChapterNav(false)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{ch.title}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                          {ch.materials.length} 材料
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* 移动端进度指示 */}
        <div className="md:hidden mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>第 {currentChapterIndex + 1} / {category.chapters.length} 章</span>
          <div className="flex-1 mx-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
              <div 
                className="bg-blue-600 dark:bg-blue-400 h-1 rounded-full transition-all duration-300"
                style={{ width: `${((currentChapterIndex + 1) / category.chapters.length) * 100}%` }}
              />
            </div>
          </div>
          <span>{Math.round(((currentChapterIndex + 1) / category.chapters.length) * 100)}%</span>
        </div>
      </div>
    </div>
  );
}