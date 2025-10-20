/**
 * 题目组件系统入口
 * 导出所有题目相关组件和钩子
 */

// 主要组件
export { QuestionViewer } from './components/QuestionViewer';
export { QuestionOption } from './components/QuestionOption';
export { QuestionNavigation } from './components/QuestionNavigation';
export { QuestionProgress } from './components/QuestionProgress';

// 钩子
export { useQuestionSession } from './hooks/useQuestionSession';
export { useQuestionKeyboard } from './hooks/useQuestionKeyboard';

// 类型定义
export type {
  QuestionMode,
  LayoutMode,
  AnswerState,
  QuestionStats,
  QuestionSession,
  QuestionUIState,
  QuestionViewerConfig,
  QuestionViewerProps,
  QuestionOptionProps,
  QuestionNavigationProps,
  QuestionProgressProps,
  KeyboardAction
} from './types';