/**
 * 案例分析主页面
 * 显示所有可用章节和统计信息
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, BarChart3, Clock, Users } from 'lucide-react';
import { answerQuestionService } from '@/lib/answer-question-service';

interface ChapterInfo {
  key: string;
  name: string;
  count: number;
}

interface PageState {
  chapters: ChapterInfo[];
  statistics: any;
  loading: boolean;
  error: string | null;
}

export default function CaseAnalysisIndexPage() {
  const router = useRouter();
  
  const [state, setState] = useState<PageState>({
    chapters: [],
    statistics: null,
    loading: true,
    error: null
  });

  // 加载数据
  useEffect(() => {
    async function loadData() {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const [chapters, statistics] = await Promise.all([
          answerQuestionService.getAvailableChapters('case-analysis'),
          answerQuestionService.getStatistics()
        ]);

        setState(prev => ({
          ...prev,
          chapters,
          statistics,
          loading: false,
          error: null
        }));

      } catch (error) {
        console.error('加载案例分析数据失败:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: '暂未找到案例分析内容，请检查内容目录是否正确配置'
        }));
      }
    }

    loadData();
  }, []);

  // 直接显示所有章节
  const filteredChapters = state.chapters;

  // 处理章节点击
  const handleChapterClick = (chapterKey: string) => {
    router.push(`/case-analysis/${chapterKey}`);
  };

  if (state.loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">正在加载案例分析...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto p-6">
          <BookOpen className="w-16 h-16 text-blue-500 mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            暂无案例分析内容
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {state.error}
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-left">
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">如何添加案例分析内容：</h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>1. 在 <code>content/2025/02-案例分析/</code> 目录下创建章节文件夹</li>
              <li>2. 在各章节文件夹中添加 markdown 格式的案例文件</li>
              <li>3. 运行构建命令更新内容索引</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 头部 */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">案例分析</h1>
              <p className="text-gray-600 dark:text-gray-400">深入理解实际应用场景</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* 统计卡片 */}
        {state.statistics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">总案例数</p>
                  <p className="text-2xl font-bold text-blue-600">{state.statistics.caseAnalysis.total}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-500 opacity-75" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">章节数</p>
                  <p className="text-2xl font-bold text-green-600">{state.chapters.length}</p>
                </div>
                <Users className="w-8 h-8 text-green-500 opacity-75" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">平均每章</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {state.chapters.length > 0 ? Math.round(state.statistics.caseAnalysis.total / state.chapters.length) : 0}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-purple-500 opacity-75" />
              </div>
            </div>
          </div>
        )}


        {/* 章节列表 */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">选择章节</h2>
          
          {filteredChapters.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                暂无可用章节
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredChapters.map((chapter) => (
                <button
                  key={chapter.key}
                  onClick={() => handleChapterClick(chapter.key)}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                           rounded-xl p-6 text-left hover:border-blue-300 hover:bg-blue-50 
                           dark:hover:border-blue-600 dark:hover:bg-blue-900/10 
                           transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {chapter.name}
                    </h3>
                    <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                      {chapter.count} 个案例
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    点击开始学习该章节的案例分析
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}