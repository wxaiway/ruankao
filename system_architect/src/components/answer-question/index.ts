/**
 * 问答题组件导出
 */

export { AnswerQuestionViewer } from './components/AnswerQuestionViewer';
export { AnswerDisplay } from './components/AnswerDisplay';

// 重新导出类型定义
export type {
  AnswerQuestion,
  CaseAnalysis,
  EssayGuidance,
  AnswerQuestionConfig,
  AnswerQuestionSession,
  AnswerQuestionStats,
  AnswerDisplayMode,
  AnswerQuestionViewerProps,
  AnswerDisplayProps
} from '@/lib/answer-questions';

// 重新导出工具函数
export {
  isCaseAnalysis,
  isEssayGuidance,
  getAnswerQuestionType,
  formatGradingInfo,
  DEFAULT_ANSWER_QUESTION_CONFIG
} from '@/lib/answer-questions';