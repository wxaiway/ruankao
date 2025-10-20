/**
 * 题目查看器类型定义
 * 定义题目系统的所有类型和接口
 */

import { Question } from '@/lib/questions';

// 答题模式
export type QuestionMode = 'practice' | 'exam' | 'review';

// 布局模式
export type LayoutMode = 'comfortable' | 'compact' | 'fullscreen';

// 答题状态
export type AnswerState = 'unanswered' | 'answered' | 'submitted' | 'reviewing';

// 题目统计信息
export interface QuestionStats {
  total: number;
  answered: number;
  correct: number;
  timeSpent: number; // 总耗时（秒）
  accuracy: number; // 正确率
}

// 题目会话状态
export interface QuestionSession {
  questions: Question[];
  currentIndex: number;
  mode: QuestionMode;
  answers: Record<string, string>; // questionId -> answer
  submitted: Record<string, boolean>; // questionId -> submitted
  explanationVisible: Record<string, boolean>;
  timeSpent: Record<string, number>; // questionId -> seconds
  startTime: number;
  isCompleted: boolean;
  stats: QuestionStats;
}

// UI状态
export interface QuestionUIState {
  showSidebar: boolean;
  isFullscreen: boolean;
  layout: LayoutMode;
  autoAdvance: boolean; // 自动进入下一题
  showProgress: boolean;
  soundEnabled: boolean;
}

// 题目查看器配置
export interface QuestionViewerConfig {
  // 功能配置
  allowReview: boolean; // 允许查看解析
  allowSkip: boolean; // 允许跳过题目
  allowBack: boolean; // 允许返回上一题
  showTimer: boolean; // 显示计时器
  showProgress: boolean; // 显示进度
  
  // 交互配置
  keyboardShortcuts: boolean; // 启用键盘快捷键
  autoSubmit: boolean; // 自动提交答案
  confirmBeforeSubmit: boolean; // 提交前确认
  
  // 样式配置
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  colorBlind: boolean; // 色盲友好模式
}

// 题目查看器props
export interface QuestionViewerProps {
  questions: Question[];
  mode?: QuestionMode;
  config?: Partial<QuestionViewerConfig>;
  onComplete?: (session: QuestionSession) => void;
  onProgress?: (stats: QuestionStats) => void;
  onExit?: () => void;
  className?: string;
}

// 题目选项数据类型
export interface QuestionOptionData {
  key: string;
  text: string;
}

// 题目选项props
export interface QuestionOptionProps {
  option: QuestionOptionData;
  selected: boolean;
  disabled: boolean;
  showResult: boolean;
  isCorrect?: boolean;
  onClick: () => void;
  className?: string;
}

// 导航类型
export type NavigationType = 'practice' | 'case-analysis' | 'essay-guidance';

// 题目导航props
export interface QuestionNavigationProps {
  currentIndex: number;
  totalQuestions: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onJumpTo?: (index: number) => void;
  
  // 扩展：支持不同类型
  type?: NavigationType;
  title?: string;
  
  // 提交相关（仅练习题使用）
  showSubmit?: boolean;
  canSubmit?: boolean;
  onSubmit?: () => void;
  className?: string;
}

// 题目进度props
export interface QuestionProgressProps {
  current: number;
  total: number;
  answered: number;
  correct: number;
  showStats?: boolean;
  className?: string;
}

// 键盘快捷键动作
export type KeyboardAction = 
  | 'selectA' | 'selectB' | 'selectC' | 'selectD'
  | 'submit' | 'next' | 'previous'
  | 'toggleExplanation' | 'toggleSidebar'
  | 'toggleFullscreen' | 'exit';