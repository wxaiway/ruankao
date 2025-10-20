/**
 * 论文指导章节页面
 * 集成统一的导航组件，支持上一题/下一题功能
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AlertCircle, PenTool } from 'lucide-react';
import { QuestionNavigation } from '@/components/question';
import { ContextNavigation } from '@/components/navigation/ContextNavigation';
import { AnswerQuestionViewer } from '@/components/answer-question';
import { answerQuestionService } from '@/lib/answer-question-service';
import { EssayGuidance, AnswerDisplayMode } from '@/lib/answer-questions';

interface PageState {
  questions: EssayGuidance[];
  displayMaps: any;
  loading: boolean;
  error: string | null;
  currentIndex: number;
  navigation: {
    canGoPrevious: boolean;
    canGoNext: boolean;
    totalItems: number;
  } | null;
}

export default function EssayGuidanceChapterPage() {
  const params = useParams();
  const router = useRouter();
  const chapter = params.chapter as string;

  const [state, setState] = useState<PageState>({
    questions: [],
    displayMaps: null,
    loading: true,
    error: null,
    currentIndex: 0,
    navigation: null
  });

  const [displayMode, setDisplayMode] = useState<AnswerDisplayMode>('interactive');

  // 加载章节数据
  useEffect(() => {
    async function loadChapterData() {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const [questions, displayMaps] = await Promise.all([
          answerQuestionService.getEssayGuidanceByChapter(chapter),
          answerQuestionService.getEssayGuidanceDisplayMaps()
        ]);

        if (questions.length === 0) {
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            error: '当前章节暂无论文指导内容' 
          }));
          return;
        }

        setState(prev => ({
          ...prev,
          questions,
          displayMaps,
          loading: false,
          error: null
        }));

      } catch (error) {
        console.error('加载论文指导数据失败:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: '加载失败，请稍后重试'
        }));
      }
    }

    if (chapter) {
      loadChapterData();
    }
  }, [chapter]);

  // 更新导航状态
  useEffect(() => {
    if (state.questions.length > 0) {
      setState(prev => ({
        ...prev,
        navigation: {
          canGoPrevious: state.currentIndex > 0,
          canGoNext: state.currentIndex < state.questions.length - 1,
          totalItems: state.questions.length
        }
      }));
    }
  }, [state.currentIndex, state.questions.length]);

  // 处理退出
  const handleExit = () => {
    router.push('/essay-guidance');
  };

  // 处理导航
  const handlePrevious = () => {
    if (state.currentIndex > 0) {
      setState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex - 1
      }));
    }
  };

  const handleNext = () => {
    if (state.currentIndex < state.questions.length - 1) {
      setState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1
      }));
    }
  };

  const handleJumpTo = (index: number) => {
    if (index >= 0 && index < state.questions.length) {
      setState(prev => ({
        ...prev,
        currentIndex: index
      }));
    }
  };

  // 处理进度更新
  const handleProgress = (stats: any) => {
    // 学习进度统计，用于分析学习效果
  };

  // 加载中状态
  if (state.loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">正在加载论文指导...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (state.error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            加载失败
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {state.error}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full btn bg-green-600 hover:bg-green-700 text-white px-4 py-2"
            >
              重新加载
            </button>
            <button
              onClick={handleExit}
              className="w-full btn bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2"
            >
              返回上级
            </button>
          </div>
        </div>
      </div>
    );
  }

  const chapterTitle = state.displayMaps?.chapters[chapter] || `第${chapter}章`;
  const currentQuestion = state.questions[state.currentIndex];

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* 顶部上下文导航 */}
      <ContextNavigation
        type="essay-guidance"
        title={chapterTitle}
        icon={<PenTool className="w-5 h-5" />}
        onBack={handleExit}
        actions={
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">显示模式:</span>
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setDisplayMode('interactive')}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  displayMode === 'interactive'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                交互模式
              </button>
              <button
                onClick={() => setDisplayMode('direct')}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  displayMode === 'direct'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                直接显示
              </button>
            </div>
          </div>
        }
      />

      {/* 统一导航组件 */}
      {state.navigation && (
        <QuestionNavigation
          type="essay-guidance"
          title={currentQuestion?.title || '论文指导'}
          currentIndex={state.currentIndex}
          totalQuestions={state.navigation.totalItems}
          canGoPrevious={state.navigation.canGoPrevious}
          canGoNext={state.navigation.canGoNext}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onJumpTo={handleJumpTo}
        />
      )}

      {/* 主内容区 - 只显示当前问题 */}
      {currentQuestion && (
        <AnswerQuestionViewer
          questions={[currentQuestion]}
          initialIndex={0}
          config={{
            displayMode,
            allowModeSwitch: false, // 禁用内部模式切换，因为头部已有
            showNavigation: false,  // 禁用内部导航，使用外部统一导航
            showProgress: false,    // 禁用进度条，因为外部已有导航
            keyboardShortcuts: true,
            showKeyPoints: true,
            showGradingCriteria: true,
            showReferences: true
          }}
          onProgress={handleProgress}
          onExit={handleExit}
          className="flex-1"
        />
      )}
    </div>
  );
}