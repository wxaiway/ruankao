/**
 * 纯前端题目数据服务
 * 直接使用构建生成的数据，无需API请求
 */

import { Question, QuestionMetadata } from './questions';
import { questionsData, questionIndices, displayMaps, questionMetadata } from '@/data/questions';

export class ClientQuestionService {
  private questionsMap = new Map<string, Question>();
  
  constructor() {
    // 构建题目ID映射表，提高查询效率
    questionsData.forEach(question => {
      this.questionsMap.set(question.id, question);
    });
  }
  
  /**
   * 根据章节获取题目
   */
  async getQuestionsByChapter(chapterKey: string, includeSubchapters = false): Promise<Question[]> {
    let questionNumbers: number[] = [];
    
    // 获取主章节题目
    const chapterQuestions = (questionIndices.chapters as Record<string, number[]>)[chapterKey];
    if (chapterQuestions) {
      questionNumbers.push(...chapterQuestions);
    }
    
    // 如果需要包含子章节
    if (includeSubchapters) {
      Object.keys(questionIndices.chapters).forEach(key => {
        if (key.startsWith(chapterKey + '-')) {
          const subChapterQuestions = (questionIndices.chapters as Record<string, number[]>)[key];
          if (subChapterQuestions) {
            questionNumbers.push(...subChapterQuestions);
          }
        }
      });
    }
    
    // 去重并排序
    questionNumbers = [...new Set(questionNumbers)].sort((a, b) => a - b);
    
    return this.getQuestionsByNumbers(questionNumbers);
  }
  
  /**
   * 根据年份获取题目
   */
  async getQuestionsByYear(yearKey: string, subjectKey?: string): Promise<Question[]> {
    const questionNumbers = (questionIndices.years as Record<string, number[]>)[yearKey] || [];
    let questions = this.getQuestionsByNumbers(questionNumbers);
    
    // 如果指定了科目，进行过滤
    if (subjectKey) {
      questions = questions.filter(q => 
        q.tags.subjects && q.tags.subjects.includes(subjectKey)
      );
    }
    
    return questions;
  }
  
  /**
   * 根据难度获取题目
   */
  async getQuestionsByDifficulty(difficultyKey: string): Promise<Question[]> {
    const questionNumbers = (questionIndices.difficulty as Record<string, number[]>)[difficultyKey] || [];
    return this.getQuestionsByNumbers(questionNumbers);
  }
  
  /**
   * 根据知识点获取题目
   */
  async getQuestionsByKnowledge(knowledgeKey: string): Promise<Question[]> {
    const questionNumbers = (questionIndices.knowledge as Record<string, number[]>)[knowledgeKey] || [];
    return this.getQuestionsByNumbers(questionNumbers);
  }
  
  /**
   * 复合条件查询题目
   */
  async getQuestionsByMultipleFilters(filters: {
    chapters?: string[];
    years?: string[];
    difficulty?: string[];
    knowledge?: string[];
    subjects?: string[];
  }): Promise<Question[]> {
    const allQuestions = new Set<number>();
    let isFirst = true;
    
    // 处理每个过滤条件
    for (const [filterType, filterValues] of Object.entries(filters)) {
      if (!filterValues || filterValues.length === 0) continue;
      
      const filterQuestions = new Set<number>();
      const indexKey = filterType as keyof typeof questionIndices;
      
      // 收集满足当前过滤条件的题目
      filterValues.forEach(value => {
        const indexData = questionIndices[indexKey] as Record<string, number[]>;
        if (indexData && indexData[value]) {
          indexData[value].forEach(qNum => filterQuestions.add(qNum));
        }
      });
      
      // 计算交集
      if (isFirst) {
        filterQuestions.forEach(qNum => allQuestions.add(qNum));
        isFirst = false;
      } else {
        // 保留交集
        const intersection = new Set<number>();
        allQuestions.forEach(qNum => {
          if (filterQuestions.has(qNum)) {
            intersection.add(qNum);
          }
        });
        allQuestions.clear();
        intersection.forEach(qNum => allQuestions.add(qNum));
      }
    }
    
    return this.getQuestionsByNumbers([...allQuestions].sort((a, b) => a - b));
  }
  
  /**
   * 根据题目编号数组获取题目
   */
  private getQuestionsByNumbers(questionNumbers: number[]): Question[] {
    const questions: Question[] = [];
    
    questionNumbers.forEach(num => {
      const questionId = num.toString().padStart(4, '0');
      const question = this.questionsMap.get(questionId);
      if (question) {
        questions.push(question);
      }
    });
    
    return questions;
  }
  
  /**
   * 根据ID获取单个题目
   */
  async getQuestionById(questionId: string): Promise<Question | null> {
    return this.questionsMap.get(questionId) || null;
  }
  
  /**
   * 获取章节列表（带题目数量）
   */
  async getChapterList(): Promise<Array<{ key: string; name: string; count: number }>> {
    return Object.entries(questionIndices.chapters as Record<string, number[]>)
      .filter(([key]) => !key.includes('-')) // 只显示主章节
      .map(([key, questions]) => ({
        key,
        name: (displayMaps.chapters as Record<string, string>)[key] || key,
        count: questions.length
      }))
      .sort((a, b) => a.key.localeCompare(b.key));
  }
  
  /**
   * 获取年份列表（带题目数量）
   */
  async getYearList(): Promise<Array<{ key: string; name: string; count: number }>> {
    return Object.entries(questionIndices.years as Record<string, number[]>)
      .map(([key, questions]) => ({
        key,
        name: (displayMaps.years as Record<string, string>)[key] || key,
        count: questions.length
      }))
      .sort((a, b) => b.key.localeCompare(a.key)); // 按年份倒序
  }
  
  /**
   * 获取元数据
   */
  async getMetadata(): Promise<QuestionMetadata> {
    return questionMetadata as QuestionMetadata;
  }
  
  /**
   * 获取显示名称映射
   */
  getDisplayMaps() {
    return displayMaps;
  }
  
  /**
   * 获取所有题目
   */
  getAllQuestions(): Question[] {
    return questionsData;
  }
}

// 导出单例服务
export const clientQuestionService = new ClientQuestionService();