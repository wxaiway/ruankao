/**
 * 通用问答题查看器
 * 支持案例分析和论文指导，复用现有question组件的导航等功能
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { BookOpen, Eye, EyeOff, List, Grid3X3, Maximize2, Minimize2, RotateCcw, X, Bookmark, BookmarkCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  AnswerQuestionViewerProps, 
  AnswerQuestionSession, 
  AnswerQuestionConfig,
  AnswerDisplayMode,
  DEFAULT_ANSWER_QUESTION_CONFIG,
  AnswerQuestionStats,
  AnswerQuestion
} from '@/lib/answer-questions';
import { AnswerDisplay } from './AnswerDisplay';

// 复用现有的导航和进度组件
import { QuestionNavigation } from '@/components/question/components/QuestionNavigation';
import { QuestionProgress } from '@/components/question/components/QuestionProgress';

interface AnswerQuestionUIState {
  showSidebar: boolean;
  isFullscreen: boolean;
}

export function AnswerQuestionViewer({
  questions,
  config = {},
  initialIndex = 0,
  onProgress,
  onExit,
  className
}: AnswerQuestionViewerProps) {
  // 配置合并
  const finalConfig: AnswerQuestionConfig = { ...DEFAULT_ANSWER_QUESTION_CONFIG, ...config };
  
  // UI状态
  const [uiState, setUIState] = useState<AnswerQuestionUIState>({
    showSidebar: false,
    isFullscreen: false
  });

  // 会话状态
  const [session, setSession] = useState<AnswerQuestionSession>({
    questions,
    currentIndex: Math.max(0, Math.min(initialIndex, questions.length - 1)),
    answerVisibility: {},
    bookmarks: [],
    viewHistory: [],
    startTime: Date.now(),
    currentDisplayMode: finalConfig.displayMode
  });

  // 响应外部 props 变化
  useEffect(() => {
    setSession(prev => ({
      ...prev,
      questions,
      currentIndex: Math.max(0, Math.min(initialIndex, questions.length - 1))
    }));
  }, [questions, initialIndex]);

  // 响应显示模式变化
  useEffect(() => {
    if (finalConfig.displayMode === 'direct') {
      // 直接模式：显示所有答案
      const allVisible = session.questions.reduce((acc, q) => {
        acc[q.id] = true;
        return acc;
      }, {} as Record<string, boolean>);
      
      setSession(prev => ({
        ...prev,
        currentDisplayMode: finalConfig.displayMode,
        answerVisibility: allVisible
      }));
    } else if (finalConfig.displayMode === 'interactive') {
      // 交互模式：隐藏所有答案
      setSession(prev => ({
        ...prev,
        currentDisplayMode: finalConfig.displayMode,
        answerVisibility: {}
      }));
    } else {
      // 其他模式
      setSession(prev => ({
        ...prev,
        currentDisplayMode: finalConfig.displayMode
      }));
    }
  }, [finalConfig.displayMode, session.questions]);

  // 当前题目
  const currentQuestion = session.questions[session.currentIndex];

  // 导航控制
  const canGoPrevious = session.currentIndex > 0;
  const canGoNext = session.currentIndex < session.questions.length - 1;

  const goToQuestion = useCallback((index: number) => {
    const newIndex = Math.max(0, Math.min(index, session.questions.length - 1));
    setSession(prev => ({
      ...prev,
      currentIndex: newIndex,
      viewHistory: [
        ...prev.viewHistory,
        {
          questionId: currentQuestion?.id || '',
          viewedAt: Date.now(),
          timeSpent: Date.now() - prev.startTime
        }
      ]
    }));
  }, [currentQuestion?.id]);

  const goNext = useCallback(() => {
    if (canGoNext) {
      goToQuestion(session.currentIndex + 1);
    }
  }, [canGoNext, session.currentIndex, goToQuestion]);

  const goPrevious = useCallback(() => {
    if (canGoPrevious) {
      goToQuestion(session.currentIndex - 1);
    }
  }, [canGoPrevious, session.currentIndex, goToQuestion]);

  // 答案显示控制
  const toggleAnswerVisibility = useCallback((questionId: string) => {
    setSession(prev => ({
      ...prev,
      answerVisibility: {
        ...prev.answerVisibility,
        [questionId]: !prev.answerVisibility[questionId]
      }
    }));
  }, []);

  // 书签控制
  const toggleBookmark = useCallback((questionId: string) => {
    setSession(prev => ({
      ...prev,
      bookmarks: prev.bookmarks.includes(questionId)
        ? prev.bookmarks.filter(id => id !== questionId)
        : [...prev.bookmarks, questionId]
    }));
  }, []);

  // 显示模式切换
  const changeDisplayMode = useCallback((mode: AnswerDisplayMode) => {
    if (mode === 'direct') {
      // 直接模式：显示所有答案
      const allVisible = session.questions.reduce((acc, q) => {
        acc[q.id] = true;
        return acc;
      }, {} as Record<string, boolean>);
      
      setSession(prev => ({
        ...prev,
        currentDisplayMode: mode,
        answerVisibility: allVisible
      }));
    } else if (mode === 'interactive') {
      // 交互模式：隐藏所有答案
      setSession(prev => ({
        ...prev,
        currentDisplayMode: mode,
        answerVisibility: {}
      }));
    }
  }, [session.questions]);

  // UI控制
  const toggleSidebar = useCallback(() => {
    setUIState(prev => ({ ...prev, showSidebar: !prev.showSidebar }));
  }, []);

  const toggleFullscreen = useCallback(() => {
    setUIState(prev => ({ ...prev, isFullscreen: !prev.isFullscreen }));
  }, []);

  // 重置会话
  const resetSession = useCallback(() => {
    setSession(prev => ({
      ...prev,
      currentIndex: 0,
      answerVisibility: {},
      bookmarks: [],
      viewHistory: [],
      startTime: Date.now()
    }));
  }, []);

  // 统计信息计算
  const calculateStats = useCallback((): AnswerQuestionStats => {
    const viewed = new Set(session.viewHistory.map(h => h.questionId)).size;
    const answersViewed = Object.values(session.answerVisibility).filter(Boolean).length;
    const totalTimeSpent = session.viewHistory.reduce((sum, h) => sum + h.timeSpent, 0) / 1000; // 转为秒
    
    return {
      total: session.questions.length,
      viewed,
      answersViewed,
      bookmarked: session.bookmarks.length,
      totalTimeSpent,
      averageTimePerQuestion: viewed > 0 ? totalTimeSpent / viewed : 0
    };
  }, [session]);

  // 进度更新
  useEffect(() => {
    onProgress?.(calculateStats());
  }, [session.viewHistory, session.answerVisibility, session.bookmarks, calculateStats, onProgress]);

  // 键盘快捷键
  useEffect(() => {
    if (!finalConfig.keyboardShortcuts) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // 防止在输入框中触发
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goNext();
          break;
        case ' ':
          e.preventDefault();
          if (currentQuestion) {
            toggleAnswerVisibility(currentQuestion.id);
          }
          break;
        case 'b':
        case 'B':
          e.preventDefault();
          if (currentQuestion) {
            toggleBookmark(currentQuestion.id);
          }
          break;
        case 'l':
        case 'L':
          e.preventDefault();
          toggleSidebar();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'Escape':
          e.preventDefault();
          if (uiState.isFullscreen) {
            toggleFullscreen();
          } else {
            onExit?.();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [
    finalConfig.keyboardShortcuts,
    currentQuestion,
    goPrevious,
    goNext,
    toggleAnswerVisibility,
    toggleBookmark,
    toggleSidebar,
    toggleFullscreen,
    uiState.isFullscreen,
    onExit
  ]);

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>没有可用的题目</p>
        </div>
      </div>
    );
  }

  const containerClassName = cn(
    "flex flex-col h-full bg-white dark:bg-gray-900",
    uiState.isFullscreen && "fixed inset-0 z-50",
    className
  );

  const stats = calculateStats();
  const isAnswerVisible = session.answerVisibility[currentQuestion.id] || session.currentDisplayMode === 'direct';
  const isBookmarked = session.bookmarks.includes(currentQuestion.id);

  return (
    <div className={containerClassName}>
      {/* 工具栏 */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">
            {currentQuestion.type === 'case-analysis' ? '案例分析' : '论文指导'}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            共 {session.questions.length} 题
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* 显示模式切换 */}
          {finalConfig.allowModeSwitch && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">学习模式:</span>
              <div className="flex items-center gap-1 bg-white dark:bg-gray-700 rounded-lg p-1 border border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => changeDisplayMode('interactive')}
                  className={cn(
                    "px-3 py-1.5 text-xs rounded transition-all duration-200 flex items-center gap-1",
                    session.currentDisplayMode === 'interactive'
                      ? "bg-blue-500 text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                  )}
                  title="交互模式：先思考再查看答案"
                >
                  <Eye className="w-3 h-3" />
                  <span>交互</span>
                </button>
                <button
                  onClick={() => changeDisplayMode('direct')}
                  className={cn(
                    "px-3 py-1.5 text-xs rounded transition-all duration-200 flex items-center gap-1",
                    session.currentDisplayMode === 'direct'
                      ? "bg-green-500 text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                  )}
                  title="直接显示：题目和答案同时显示"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>直接</span>
                </button>
              </div>
            </div>
          )}

          {/* 书签 */}
          <button
            onClick={() => toggleBookmark(currentQuestion.id)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              isBookmarked
                ? "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700"
            )}
            title={isBookmarked ? "取消收藏" : "收藏题目"}
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>

          {/* 侧边栏切换 */}
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700"
            title="显示/隐藏题目列表"
          >
            {uiState.showSidebar ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
          </button>
          
          <button
            onClick={resetSession}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700"
            title="重新开始"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700"
            title={uiState.isFullscreen ? "退出全屏" : "全屏模式"}
          >
            {uiState.isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          
          <button
            onClick={onExit}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-red-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-red-900/20"
            title="退出"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* 侧边栏 */}
        {uiState.showSidebar && (
          <div className="w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">题目列表</h3>
              <div className="space-y-2">
                {session.questions.map((question, index) => {
                  const isAnswered = session.answerVisibility[question.id];
                  const isCurrent = index === session.currentIndex;
                  const isBookmarkedItem = session.bookmarks.includes(question.id);
                  
                  return (
                    <button
                      key={question.id}
                      onClick={() => goToQuestion(index)}
                      className={cn(
                        "w-full p-3 text-left rounded-lg border transition-all",
                        isCurrent ? "bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-600" : "bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600",
                        "flex items-center justify-between"
                      )}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            #{question.id}
                          </span>
                          {isAnswered && (
                            <Eye className="w-3 h-3 text-green-500" />
                          )}
                          {isBookmarkedItem && (
                            <BookmarkCheck className="w-3 h-3 text-yellow-500" />
                          )}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                          {question.title}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {index + 1}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 主内容区 */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* 进度条 - 根据配置显示 */}
          {finalConfig.showProgress && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <QuestionProgress
                current={session.currentIndex}
                total={session.questions.length}
                answered={stats.answersViewed}
                correct={0} // 问答题没有对错概念
              />
            </div>
          )}

          {/* 题目内容 */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="w-full pb-32">
              {/* 题目信息 */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>#{currentQuestion.id}</span>
                  <span>•</span>
                  <span className="capitalize">{currentQuestion.tags.difficulty}</span>
                  <span>•</span>
                  <span>预计 {currentQuestion.estimatedTime} 分钟</span>
                  {isBookmarked && (
                    <>
                      <span>•</span>
                      <span className="text-yellow-600 flex items-center gap-1">
                        <BookmarkCheck className="w-3 h-3" />
                        已收藏
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* 题目标题 */}
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                {currentQuestion.title}
              </h1>

              {/* 题目内容 */}
              <div 
                className="answer-question-content mb-8"
                dangerouslySetInnerHTML={{ __html: currentQuestion.content }}
              />


              {currentQuestion.type === 'essay-guidance' && (
                <>
                  {/* 论文题目 */}
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 mb-6 border border-green-200 dark:border-green-800">
                    <h2 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">论文题目</h2>
                    <p className="text-green-700 dark:text-green-300 font-medium text-lg">{currentQuestion.topic}</p>
                  </div>

                  {currentQuestion.wordLimit && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-8 border border-blue-200 dark:border-blue-800">
                      <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        写作要求
                      </h2>
                      <div className="p-3 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          <strong>字数要求：</strong>{currentQuestion.wordLimit.min} - {currentQuestion.wordLimit.max} 字
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* 显示模式提示 */}
              {session.currentDisplayMode === 'interactive' && !isAnswerVisible && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 
                              border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800/50 rounded-full flex items-center justify-center">
                        <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        💡 交互学习模式
                      </h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        先独立思考分析，然后点击下方按钮查看标准答案和详细解析
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {session.currentDisplayMode === 'direct' && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 
                              border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-800/50 rounded-full flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-green-900 dark:text-green-100">
                        📖 直接学习模式
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        题目和标准答案同时显示，适合复习和快速学习
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 答案展示 */}
              <AnswerDisplay
                question={currentQuestion}
                isVisible={isAnswerVisible}
                onToggle={() => toggleAnswerVisibility(currentQuestion.id)}
                config={{
                  showKeyPoints: finalConfig.showKeyPoints,
                  showGradingCriteria: finalConfig.showGradingCriteria,
                  showReferences: finalConfig.showReferences
                }}
              />
            </div>
          </div>

          {/* 导航栏 - 根据配置显示 */}
          {finalConfig.showNavigation && (
            <QuestionNavigation
              currentIndex={session.currentIndex}
              totalQuestions={session.questions.length}
              canGoPrevious={canGoPrevious}
              canGoNext={canGoNext}
              onPrevious={goPrevious}
              onNext={goNext}
              onJumpTo={goToQuestion}
            />
          )}
        </div>
      </div>

      {/* 键盘提示 */}
      {uiState.isFullscreen && finalConfig.keyboardShortcuts && (
        <div className="absolute bottom-4 left-4 bg-black/75 text-white text-xs p-3 rounded-lg">
          <div className="space-y-1">
            <div>← →: 切换题目</div>
            <div>Space: 显示/隐藏答案</div>
            <div>B: 收藏/取消收藏</div>
            <div>L: 显示/隐藏列表</div>
            <div>F: 全屏切换</div>
            <div>Esc: 退出</div>
          </div>
        </div>
      )}
    </div>
  );
}