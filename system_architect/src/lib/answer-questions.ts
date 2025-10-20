/**
 * 问答题数据结构和类型定义
 * 支持案例分析和论文指导两种类型
 */

// 问答题基础接口
export interface BaseAnswerQuestion {
  id: string;
  title: string;
  content: string;          // 题目内容（HTML格式，由markdown转换）
  tags: AnswerQuestionTags;
  estimatedTime: number;    // 预计用时（分钟）
  images?: string[];        // 相关图片
  createdAt?: string;
  updatedAt?: string;
}

// 问答题标签结构
export interface AnswerQuestionTags {
  chapter: string;          // 章节标签（单个值）
  difficulty: 'basic' | 'medium' | 'hard';
  domains?: string[];       // 技术领域（案例分析用）
  paperType?: string;       // 论文类型（论文指导用）
  keywords?: string[];      // 关键词
}

// 案例分析题
export interface CaseAnalysis extends BaseAnswerQuestion {
  type: 'case-analysis';
  answer: {
    content: string;        // 标准答案（HTML格式）
    keyPoints: string[];    // 关键分析点
    gradingRubric: {        // 评分细则
      criteria: string;     // 评分标准
      points: number;       // 分值
      description?: string; // 说明
    }[];
    references?: string[];  // 参考资料
  };
}

// 论文指导题
export interface EssayGuidance extends BaseAnswerQuestion {
  type: 'essay-guidance';
  topic: string;            // 论文题目
  wordLimit?: {
    min: number;
    max: number;
  };
  guidance: {
    structure: string;      // 结构指导（HTML格式）
    keyPoints: string[];    // 关键要点
    examples: string;       // 参考示例（HTML格式）
    commonMistakes: string[]; // 常见错误
    gradingCriteria: {      // 评分标准
      criteria: string;     // 评分标准
      points: number;       // 分值
      description?: string; // 说明
    }[];
  };
}

// 问答题联合类型
export type AnswerQuestion = CaseAnalysis | EssayGuidance;

// 问答题显示模式
export type AnswerDisplayMode = 
  | 'direct'      // 直接显示答案
  | 'interactive' // 点击展示答案
  | 'mixed';      // 混合模式（用户可切换）

// 问答题查看器配置
export interface AnswerQuestionConfig {
  displayMode: AnswerDisplayMode;
  defaultExpanded: boolean;       // 默认是否展开答案
  allowModeSwitch: boolean;       // 是否允许用户切换显示模式
  showKeyPoints: boolean;         // 是否显示关键要点
  showGradingCriteria: boolean;   // 是否显示评分标准
  showReferences: boolean;        // 是否显示参考资料
  enableBookmarks: boolean;       // 是否启用书签功能
  showNavigation: boolean;        // 是否显示内部导航组件
  showProgress: boolean;          // 是否显示进度条
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  keyboardShortcuts: boolean;
}

// 问答题会话状态
export interface AnswerQuestionSession {
  questions: AnswerQuestion[];
  currentIndex: number;
  answerVisibility: Record<string, boolean>; // 每题答案显示状态
  bookmarks: string[];                       // 收藏的题目ID
  viewHistory: {
    questionId: string;
    viewedAt: number;
    timeSpent: number; // 秒
  }[];
  startTime: number;
  currentDisplayMode: AnswerDisplayMode;
}

// 问答题统计信息
export interface AnswerQuestionStats {
  total: number;
  viewed: number;           // 查看过的题目数量
  answersViewed: number;    // 查看过答案的题目数量
  bookmarked: number;       // 收藏的题目数量
  totalTimeSpent: number;   // 总用时（秒）
  averageTimePerQuestion: number; // 平均每题用时
}

// 问答题导航props
export interface AnswerQuestionNavigationProps {
  currentIndex: number;
  totalQuestions: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onJumpTo?: (index: number) => void;
  className?: string;
}

// 答案展示组件props
export interface AnswerDisplayProps {
  question: AnswerQuestion;
  isVisible: boolean;
  onToggle: () => void;
  config: Pick<AnswerQuestionConfig, 'showKeyPoints' | 'showGradingCriteria' | 'showReferences'>;
  className?: string;
}


// 问答题查看器主组件props
export interface AnswerQuestionViewerProps {
  questions: AnswerQuestion[];
  config?: Partial<AnswerQuestionConfig>;
  initialIndex?: number;
  onProgress?: (stats: AnswerQuestionStats) => void;
  onExit?: () => void;
  className?: string;
}

// 默认配置
export const DEFAULT_ANSWER_QUESTION_CONFIG: AnswerQuestionConfig = {
  displayMode: 'interactive',
  defaultExpanded: false,
  allowModeSwitch: true,
  showKeyPoints: true,
  showGradingCriteria: true,
  showReferences: true,
  enableBookmarks: true,
  showNavigation: true,        // 默认显示内部导航
  showProgress: true,          // 默认显示进度条
  theme: 'auto',
  fontSize: 'medium',
  keyboardShortcuts: true
};

// 类型守卫函数
export function isCaseAnalysis(question: AnswerQuestion): question is CaseAnalysis {
  return question.type === 'case-analysis';
}

export function isEssayGuidance(question: AnswerQuestion): question is EssayGuidance {
  return question.type === 'essay-guidance';
}

// 问答题类型检测
export function getAnswerQuestionType(question: AnswerQuestion): 'case-analysis' | 'essay-guidance' {
  return question.type;
}

// 评分标准格式化
export function formatGradingInfo(question: AnswerQuestion): string {
  if (isCaseAnalysis(question)) {
    const totalPoints = question.answer.gradingRubric.reduce((sum, item) => sum + item.points, 0);
    return `总分：${totalPoints}分，共${question.answer.gradingRubric.length}项评分标准`;
  } else if (isEssayGuidance(question)) {
    const totalPoints = question.guidance.gradingCriteria.reduce((sum, item) => sum + item.points, 0);
    return `总分：${totalPoints}分，共${question.guidance.gradingCriteria.length}项评分标准`;
  }
  return '';
}