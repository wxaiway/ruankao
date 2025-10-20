/**
 * 年份练习组件
 * 使用QuestionViewer系统进行年份题目练习
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { questionService, Question } from '@/lib/questions';
import { QuestionViewer, QuestionSession } from '@/components/question';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, ArrowLeft, RotateCcw, Calendar } from 'lucide-react';
import Link from 'next/link';

interface YearPracticeProps {
  yearKey: string;
}

interface PracticeState {
  loading: boolean;
  error: string | null;
  questions: Question[];
  session: QuestionSession | null;
  showResult: boolean;
}

export function YearPractice({ yearKey }: YearPracticeProps) {
  const router = useRouter();
  const [state, setState] = useState<PracticeState>({
    loading: true,
    error: null,
    questions: [],
    session: null,
    showResult: false
  });

  // 获取年份显示名称
  const getYearDisplayName = () => {
    // 解析年份格式：YYYY-1 或 YYYY-2
    const match = yearKey.match(/^(\d{4})-([12])$/);
    if (match) {
      const year = match[1];
      const semester = match[2] === '1' ? '上半年' : '下半年';
      return `${year}年${semester}`;
    }
    
    // 如果格式不匹配，返回原始值
    return `${yearKey}真题`;
  };


  // 加载年份题目
  useEffect(() => {
    loadYearQuestions();
  }, [yearKey]);

  const loadYearQuestions = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const questions = await questionService.getQuestionsByYear(yearKey);
      
      if (questions.length === 0) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: `${getYearDisplayName()}暂无练习题目` 
        }));
        return;
      }

      // 按题目ID排序（年份题目通常按考试顺序）
      const sortedQuestions = [...questions].sort((a, b) => a.id.localeCompare(b.id));
      
      setState(prev => ({
        ...prev,
        loading: false,
        questions: sortedQuestions,
        error: null
      }));
    } catch (err) {
      console.error('Failed to load year questions:', err);
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
    router.push('/practice/years');
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
          <div className="text-orange-500 mb-4">
            <Calendar className="w-12 h-12 mx-auto opacity-50" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            题目不存在
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{state.error}</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={loadYearQuestions}>
              <RotateCcw className="w-4 h-4 mr-2" />
              重新加载
            </Button>
            <Button asChild variant="outline">
              <Link href="/practice/years">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回年份列表
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
    const yearName = getYearDisplayName();
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-2xl">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            {yearName}练习完成！
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

          {/* 真题评价 */}
          <div className="mb-8 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <h3 className="font-semibold mb-2">
              {accuracy >= 90 ? '🎉 优秀表现！' : 
               accuracy >= 80 ? '👍 良好水平！' : 
               accuracy >= 70 ? '📚 继续加油！' : 
               '💪 需要加强！'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {accuracy >= 90 ? '你已达到考试要求的优秀水平，保持状态！' : 
               accuracy >= 80 ? '距离考试要求很接近，再练习几套真题。' : 
               accuracy >= 70 ? '基础掌握不错，建议针对错题加强复习。' : 
               '建议回到章节练习，巩固基础知识后再做真题。'}
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={handleRestart} size="lg">
              <RotateCcw className="w-4 h-4 mr-2" />
              重新练习
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/practice/years">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回年份列表
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const yearName = getYearDisplayName();

  // 主要练习界面
  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* 头部导航 - 无宽度限制 */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePracticeExit}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                返回练习
              </button>
              
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
              
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                <h1 className="font-semibold text-gray-900 dark:text-gray-100">
                  {yearName} - 真题练习
                </h1>
              </div>
            </div>

            {/* 练习信息 */}
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>共 {state.questions.length} 题</span>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                <span>考试模式</span>
              </div>
            </div>
          </div>
        </header>

        {/* 主内容区 - 全宽 */}
        <QuestionViewer
          questions={state.questions}
          mode="practice"  // 年份练习使用练习模式，提供流畅的学习体验
          config={{
            allowReview: true,
            allowSkip: false,        // 真题练习不允许跳过
            allowBack: true,
            showTimer: true,
            showProgress: true,
            keyboardShortcuts: true,
            autoSubmit: false,
            confirmBeforeSubmit: false, // 练习模式无需确认，提升操作流畅性
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