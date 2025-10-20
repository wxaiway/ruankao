/**
 * 题目数据类型定义
 * 纯前端版本，移除API相关代码
 */

// 题目数据类型定义
export interface Question {
  id: string;
  title: string;
  type: 'single-choice' | 'multiple-choice' | 'judgment' | 'case-analysis';
  content: string; // markdown内容
  options?: QuestionOption[];
  correctAnswer: string | string[];
  explanation: string;
  tags: QuestionTags;
  points: number;
  estimatedTime: number;
  source?: string;
}

export interface QuestionOption {
  key: string;
  text: string;
}

export interface QuestionTags {
  knowledge: string[];
  chapters: string[];
  years: string[];
  subjects: string[];
  difficulty: string;
  questionType: string;
  source: string[];
}

export interface QuestionIndex {
  data: Record<string, number[]>;
}

export interface QuestionMaps {
  [key: string]: Record<string, string>;
}

export interface QuestionMetadata {
  totalQuestions: number;
  lastUpdated: string;
  categories: Record<string, number>;
}

// 导出纯前端服务（向后兼容）
export { clientQuestionService as questionService } from './questions-client';