/**
 * 练习模式选择组件
 * 提供章节练习、历年真题等多种练习模式选择
 */

'use client';

import { useState, useEffect } from 'react';
import { questionService } from '@/lib/questions';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { BookOpen, Calendar } from 'lucide-react';
import Link from 'next/link';

interface ChapterItem {
  key: string;
  name: string;
  count: number;
}

interface YearItem {
  key: string;
  name: string;
  count: number;
}

export function PracticeSelector() {
  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [years, setYears] = useState<YearItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPracticeOptions();
  }, []);

  const loadPracticeOptions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [chapterList, yearList] = await Promise.all([
        questionService.getChapterList(),
        questionService.getYearList()
      ]);
      
      setChapters(chapterList);
      setYears(yearList);
    } catch (err) {
      console.error('Failed to load practice options:', err);
      setError('加载练习选项失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="正在加载练习选项..." />;
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <Button onClick={loadPracticeOptions}>重新加载</Button>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-8">
        {/* 练习模式概览 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">选择练习模式</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            根据你的学习需求选择合适的练习模式，系统将为你提供针对性的题目训练
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 章节练习 */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold">章节练习</h2>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              按知识点分章节进行针对性练习，巩固各个知识领域的基础
            </p>

            <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
              {chapters.map(chapter => (
                <Link
                  key={chapter.key}
                  href={`/practice/chapters/${chapter.key}`}
                  className="block p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{chapter.name}</span>
                    <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {chapter.count}题
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <Button asChild className="w-full">
              <Link href="/practice/chapters">查看所有章节</Link>
            </Button>
          </Card>

          {/* 历年真题 */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold">历年真题</h2>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              按年份进行真题练习，熟悉考试题型和难度分布
            </p>

            <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
              {years.slice(0, 6).map(year => (
                <Link
                  key={year.key}
                  href={`/practice/years/${year.key}`}
                  className="block p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{year.name}</span>
                    <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {year.count}题
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <Button asChild className="w-full" variant="outline">
              <Link href="/practice/years">查看所有年份</Link>
            </Button>
          </Card>
        </div>

        {/* 练习建议 */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <h3 className="text-lg font-semibold mb-3">💡 练习建议</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
            <div>
              <strong>基础学习期：</strong>
              <br />重点做章节练习，按照知识点体系逐步巩固基础理论
            </div>
            <div>
              <strong>强化提升期：</strong>
              <br />结合历年真题，了解考试重点和出题规律
            </div>
            <div>
              <strong>考前冲刺期：</strong>
              <br />集中做错题重做，查漏补缺，确保知识点掌握
            </div>
            <div>
              <strong>模拟实战期：</strong>
              <br />完整套题练习，熟悉考试节奏和时间分配
            </div>
          </div>
        </Card>
      </div>
    </ErrorBoundary>
  );
}