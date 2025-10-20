/**
 * 题目查看器主组件
 * 类似PPTViewer的完整题目展示系统
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  BookOpen, 
  Eye, 
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { QuestionViewerProps, QuestionViewerConfig, QuestionUIState, KeyboardAction } from '../types';
import { useQuestionSession } from '../hooks/useQuestionSession';
import { useQuestionKeyboard } from '../hooks/useQuestionKeyboard';
import { QuestionOption } from './QuestionOption';
import { QuestionNavigation } from './QuestionNavigation';
import { QuestionProgress } from './QuestionProgress';

// 默认配置
const DEFAULT_CONFIG: QuestionViewerConfig = {
  allowReview: true,
  allowSkip: true,
  allowBack: true,
  showTimer: true,
  showProgress: true,
  keyboardShortcuts: true,
  autoSubmit: false,
  confirmBeforeSubmit: false,
  theme: 'auto',
  fontSize: 'medium',
  colorBlind: false
};


// 题目内容组件
interface QuestionContentProps {
  question: any;
  selectedAnswer?: string;
  isExplanationVisible: boolean;
  showResult: boolean;
  onAnswerSelect: (answer: string) => void;
  onToggleExplanation: () => void;
  config: QuestionViewerConfig;
}

function QuestionContent({
  question,
  selectedAnswer,
  isExplanationVisible,
  showResult,
  onAnswerSelect,
  onToggleExplanation,
  config
}: QuestionContentProps) {
  const renderQuestionText = () => {
    // 现在 content 字段应该已经包含纯净的题目正文
    let questionText = question.content || question.title;
    
    // 去除开头的 # 符号和可（如果还存在）
    questionText = questionText.replace(/^# \d*[.-]?\s*/, '');
    
    return questionText.trim();
  };

  return (
    <div className="p-6 space-y-6 pb-20">
        {/* 题目信息 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>#{question.id}</span>
            <span>•</span>
            <span>{question.tags.difficulty === 'basic' ? '基础' : question.tags.difficulty === 'medium' ? '中等' : '困难'}</span>
            {config.showTimer && (
              <>
                <span>•</span>
                <span>预计 {question.estimatedTime}秒</span>
              </>
            )}
          </div>
          
          {config.allowReview && (
            <button
              onClick={onToggleExplanation}
              className={cn(
                "flex items-center gap-2 px-3 py-1 text-sm rounded-lg transition-all duration-200",
                showResult 
                  ? "text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                  : "text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
              )}
              title={showResult ? "查看详细解析" : "查看参考解析"}
            >
              {isExplanationVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isExplanationVisible ? '隐藏解析' : (showResult ? '查看解析' : '查看解析')}
            </button>
          )}
        </div>

        {/* 题目正文 */}
        <div className="mb-6">
          <div className="prose dark:prose-invert max-w-none">
            <h3 className="text-lg font-medium leading-relaxed mb-6">
              {renderQuestionText()}
            </h3>
          </div>
        </div>

        {/* 选项列表 */}
        <div className="space-y-3" role="radiogroup" aria-label="答案选项">
          {question.options?.map((option: any) => (
            <QuestionOption
              key={option.key}
              option={option}
              selected={selectedAnswer === option.key}
              disabled={showResult}
              showResult={showResult}
              isCorrect={showResult ? option.key === question.correctAnswer : undefined}
              onClick={() => onAnswerSelect(option.key)}
            />
          ))}
        </div>

        {/* 学习提示 */}
        {!showResult && !isExplanationVisible && (
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl animate-fade-in">
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
                  先独立思考分析，然后点击右上角「查看解析」按钮学习标准答案和详细解析
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 答案解析 */}
        {isExplanationVisible && question.explanation && (
          <div className={cn(
            "mt-8 p-6 rounded-xl border-l-4 animate-fade-in",
            showResult 
              ? "bg-green-50 dark:bg-green-800/20 border-green-500" 
              : "bg-orange-50 dark:bg-orange-800/20 border-orange-500"
          )}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className={cn("w-5 h-5", showResult ? "text-green-600" : "text-orange-600")} />
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                  {showResult ? "详细解析" : "参考解析"}
                </h4>
              </div>
              {!showResult && (
                <div className="text-xs text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded">
                  学习模式
                </div>
              )}
            </div>
            <div 
              className="prose dark:prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: question.explanation }}
            />
            {!showResult && (
              <div className="mt-4 p-3 bg-orange-100 dark:bg-orange-800/30 rounded-lg">
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  💡 <strong>学习提示：</strong>这是参考解析，可以帮助你学习标准思路。如果想验证答案正确性，可以先选择答案并提交。
                </p>
              </div>
            )}
          </div>
        )}
    </div>
  );
}

// 主组件
export function QuestionViewer({
  questions,
  mode = 'practice',
  config = {},
  onComplete,
  onProgress,
  onExit,
  className
}: QuestionViewerProps) {
  // 配置合并
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // UI状态
  const [uiState, setUIState] = useState<QuestionUIState>({
    showSidebar: false,
    isFullscreen: false,
    layout: 'comfortable',
    autoAdvance: false,
    showProgress: true,
    soundEnabled: false
  });

  // 题目会话管理
  const {
    session,
    currentQuestion,
    currentAnswer,
    isExplanationVisible,
    canGoPrevious,
    canGoNext,
    isAnswered,
    isSubmitted,
    isCorrect,
    initSession,
    goToQuestion,
    goNext,
    goPrevious,
    selectAnswer,
    submitAnswer,
    toggleExplanation,
    completeSession,
    resetSession
  } = useQuestionSession(questions, mode);

  // 键盘快捷键处理
  const handleKeyboardAction = useCallback((action: KeyboardAction, event: KeyboardEvent) => {
    switch (action) {
      case 'selectA':
      case 'selectB':
      case 'selectC':
      case 'selectD':
        if (!isSubmitted && currentQuestion?.options) {
          const answerKey = action.replace('select', '');
          selectAnswer(answerKey);
          if (finalConfig.autoSubmit) {
            submitAnswer(answerKey);
          }
        }
        break;
      case 'submit':
        if (currentAnswer && !isSubmitted) {
          submitAnswer(currentAnswer);
        }
        break;
      case 'next':
        goNext();
        break;
      case 'previous':
        goPrevious();
        break;
      case 'toggleExplanation':
        toggleExplanation();
        break;
      case 'toggleSidebar':
        setUIState(prev => ({ ...prev, showSidebar: !prev.showSidebar }));
        break;
      case 'toggleFullscreen':
        setUIState(prev => ({ ...prev, isFullscreen: !prev.isFullscreen }));
        break;
      case 'exit':
        onExit?.();
        break;
    }
  }, [currentQuestion, currentAnswer, isAnswered, selectAnswer, submitAnswer, goNext, goPrevious, toggleExplanation, finalConfig.autoSubmit, onExit]);

  useQuestionKeyboard({
    enabled: finalConfig.keyboardShortcuts && !session.isCompleted,
    onAction: handleKeyboardAction
  });

  // 处理答案选择
  const handleAnswerSelect = useCallback((answer: string) => {
    selectAnswer(answer);
    if (finalConfig.autoSubmit) {
      submitAnswer(answer);
    }
  }, [selectAnswer, submitAnswer, finalConfig.autoSubmit]);

  // 处理答案提交
  const handleAnswerSubmit = useCallback(() => {
    if (currentAnswer && finalConfig.confirmBeforeSubmit) {
      if (confirm('确定要提交答案吗？提交后将无法修改。')) {
        submitAnswer(currentAnswer);
      }
    } else if (currentAnswer) {
      submitAnswer(currentAnswer);
    }
  }, [currentAnswer, submitAnswer, finalConfig.confirmBeforeSubmit]);

  // UI控制函数
  const toggleSidebar = useCallback(() => {
    setUIState(prev => ({ ...prev, showSidebar: !prev.showSidebar }));
  }, []);

  const toggleFullscreen = useCallback(() => {
    setUIState(prev => ({ ...prev, isFullscreen: !prev.isFullscreen }));
  }, []);

  // 进度更新
  useEffect(() => {
    onProgress?.(session.stats);
  }, [session.stats, onProgress]);

  // 完成检测
  useEffect(() => {
    if (session.isCompleted) {
      onComplete?.(session);
    }
  }, [session.isCompleted, session, onComplete]);

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

  // 在练习模式下，需要提交答案后才显示结果；在考试模式下，需要完成整个会话
  const showResult = isSubmitted || (mode === 'exam' && session.isCompleted);

  return (
    <div className={containerClassName}>
      {/* 工具栏 - 隐藏以避免重复，使用外部ContextNavigation */}

      <div className="flex flex-1 min-h-0">
        {/* 侧边栏 */}
        {uiState.showSidebar && (
          <div className="w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            {/* 题目列表内容 */}
            <div className="p-4">
              <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">题目列表</h3>
              <div className="space-y-2">
                {session.questions.map((question, index) => {
                  const isAnswered = question.id in session.answers;
                  const isCorrect = isAnswered ? session.answers[question.id] === question.correctAnswer : false;
                  const isCurrent = index === session.currentIndex;
                  
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
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              isCorrect ? "bg-green-500" : "bg-red-500"
                            )} />
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
          {/* 进度条 */}
          {finalConfig.showProgress && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <QuestionProgress
                current={session.currentIndex}
                total={session.questions.length}
                answered={session.stats.answered}
                correct={session.stats.correct}
              />
            </div>
          )}

          {/* 导航栏 - 集成提交功能 */}
          <QuestionNavigation
            currentIndex={session.currentIndex}
            totalQuestions={session.questions.length}
            canGoPrevious={canGoPrevious && finalConfig.allowBack}
            canGoNext={canGoNext && (finalConfig.allowSkip || showResult)}
            onPrevious={goPrevious}
            onNext={goNext}
            onJumpTo={finalConfig.allowSkip ? goToQuestion : undefined}
            showSubmit={!finalConfig.autoSubmit && !isSubmitted}
            canSubmit={!!currentAnswer}
            onSubmit={handleAnswerSubmit}
          />

          {/* 题目内容区域 - 纯滚动容器 */}
          <div className="flex-1 overflow-y-auto">
            <QuestionContent
              question={currentQuestion}
              selectedAnswer={currentAnswer}
              isExplanationVisible={isExplanationVisible}
              showResult={showResult}
              onAnswerSelect={handleAnswerSelect}
              onToggleExplanation={toggleExplanation}
              config={finalConfig}
            />
          </div>
        </div>
      </div>

      {/* 键盘提示 */}
      {uiState.isFullscreen && finalConfig.keyboardShortcuts && (
        <div className="absolute bottom-4 left-4 bg-black/75 text-white text-xs p-3 rounded-lg">
          <div className="space-y-1">
            <div>1-4 / A-D: 选择答案</div>
            <div>Enter: 提交答案</div>
            <div>Space: 查看解析</div>
            <div>← →: 切换题目</div>
            <div>Esc: 退出</div>
          </div>
        </div>
      )}
    </div>
  );
}