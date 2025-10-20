/**
 * 新版章节练习组件
 * 使用独立的题目组件系统重构
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { questionService, Question } from '@/lib/questions';
import { QuestionViewer, QuestionSession } from '@/components/question';
import { ContextNavigation } from '@/components/navigation/ContextNavigation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, ArrowLeft, RotateCcw, Target, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface NewChapterPracticeProps {
  chapterKey: string;
}

interface PracticeState {
  loading: boolean;
  error: string | null;
  questions: Question[];
  session: QuestionSession | null;
  showResult: boolean;
}

export function NewChapterPractice({ chapterKey }: NewChapterPracticeProps) {
  const router = useRouter();
  const [state, setState] = useState<PracticeState>({
    loading: true,
    error: null,
    questions: [],
    session: null,
    showResult: false
  });

  // 加载章节题目
  useEffect(() => {
    loadChapterQuestions();
  }, [chapterKey]);

  const loadChapterQuestions = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const questions = await questionService.getQuestionsByChapter(chapterKey, true);
      
      if (questions.length === 0) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: '该章节暂无练习题目' 
        }));
        return;
      }

      // 随机打乱题目顺序
      const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
      
      setState(prev => ({
        ...prev,
        loading: false,
        questions: shuffledQuestions,
        error: null
      }));
    } catch (err) {
      console.error('Failed to load chapter questions:', err);
      setState(prev => ({
        ...prev,
        loading: false,
        error: '加载题目失败，请稍后重试'
      }));
    }
  };

  // 处理练习完成
  const handlePracticeComplete = (session: QuestionSession) => {
    setState(prev => ({ ...prev, session, showResult: true }));
  };

  // 处理练习退出
  const handlePracticeExit = () => {
    router.push('/practice');
  };

  // 重新开始练习
  const handleRestart = () => {
    setState(prev => ({ ...prev, session: null, showResult: false }));
  };

  // 加载状态
  if (state.loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner text="正在加载题目..." />
      </div>
    );
  }

  // 错误状态
  if (state.error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <div className="text-red-500 mb-4">
            <Target className="w-12 h-12 mx-auto opacity-50" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            加载失败
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{state.error}</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={loadChapterQuestions}>
              <RotateCcw className="w-4 h-4 mr-2" />
              重新加载
            </Button>
            <Button asChild variant="outline">
              <Link href="/practice">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回练习
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // 完成结果页面
  if (state.showResult && state.session) {
    const { session } = state;
    const accuracy = Math.round(session.stats.accuracy);
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-2xl">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            练习完成！
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {session.stats.total}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">总题数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {session.stats.correct}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">答对</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {accuracy}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">正确率</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {Math.round(session.stats.timeSpent / 60)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">用时(分钟)</div>
            </div>
          </div>

          {/* 成绩评价 */}
          <div className="mb-8 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <h3 className="font-semibold mb-2">
              {accuracy >= 90 ? '🎉 优秀！' : 
               accuracy >= 80 ? '👍 良好！' : 
               accuracy >= 70 ? '📚 继续努力！' : 
               '💪 加油练习！'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {accuracy >= 90 ? '你的掌握程度很高，继续保持！' : 
               accuracy >= 80 ? '掌握得不错，可以尝试更难的题目。' : 
               accuracy >= 70 ? '基础还可以，建议多复习错题。' : 
               '需要加强基础知识的学习。'}
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={handleRestart} size="lg">
              <RotateCcw className="w-4 h-4 mr-2" />
              重新练习
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/practice">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回练习
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // 获取章节显示名称
  const getChapterDisplayName = () => {
    const chapterNames: Record<string, string> = {
      'ch01': '计算机系统基础',
      'ch02': '信息系统基础', 
      'ch03': '信息安全技术',
      'ch04': '软件工程基础',
      'ch05': '数据库设计基础',
      'ch06': '系统架构设计基础',
      'ch07': '系统质量属性与架构评估',
      'ch08': '软件可靠性技术',
      'ch09': '软件架构演化和维护',
      'ch10': '未来信息综合技术',
      'ch11': '标准化与知识产权',
      'ch12': '应用数学',
      'ch13': '专业英语'
    };
    
    return chapterNames[chapterKey] || '未知章节';
  };

  const chapterName = getChapterDisplayName();

  // 主要练习界面
  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* 头部上下文导航 */}
        <ContextNavigation
          type="practice"
          title={`${chapterName} - 章节练习`}
          icon={<Target className="w-5 h-5" />}
          onBack={handlePracticeExit}
          actions={
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>共 {state.questions.length} 题</span>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>练习模式</span>
              </div>
            </div>
          }
        />

        {/* 主内容区 - 全宽 */}
        <QuestionViewer
          questions={state.questions}
          mode="practice"
          config={{
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
          }}
          onComplete={handlePracticeComplete}
          onProgress={(stats) => {
            // 进度数据统计，可用于学习分析
          }}
          onExit={handlePracticeExit}
          className="flex-1"
        />
      </div>
    </ErrorBoundary>
  );
}