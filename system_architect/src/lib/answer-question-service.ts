/**
 * 问答题服务层
 * 提供案例分析和论文指导数据的统一访问接口
 */

import { AnswerQuestion, CaseAnalysis, EssayGuidance } from './answer-questions';

interface AnswerQuestionIndices {
  chapters: Record<string, string[]>;
  difficulty: Record<string, string[]>;
  domains?: Record<string, string[]>;
  paperType?: Record<string, string[]>;
  keywords?: Record<string, string[]>;
}

interface AnswerQuestionMaps {
  chapters: Record<string, string>;
  difficulty: Record<string, string>;
  domains?: Record<string, string>;
  paperType?: Record<string, string>;
  keywords?: Record<string, string>;
}

interface AnswerQuestionMetadata {
  totalItems: number;
  lastUpdated: string;
  categories: Record<string, number>;
}

class AnswerQuestionService {
  private caseAnalysisData: CaseAnalysis[] = [];
  private caseAnalysisIndices: AnswerQuestionIndices = { chapters: {}, difficulty: {} };
  private caseAnalysisDisplayMaps: AnswerQuestionMaps = { chapters: {}, difficulty: {} };
  private caseAnalysisMetadata: AnswerQuestionMetadata = { totalItems: 0, lastUpdated: '', categories: {} };

  private essayGuidanceData: EssayGuidance[] = [];
  private essayGuidanceIndices: AnswerQuestionIndices = { chapters: {}, difficulty: {} };
  private essayGuidanceDisplayMaps: AnswerQuestionMaps = { chapters: {}, difficulty: {} };
  private essayGuidanceMetadata: AnswerQuestionMetadata = { totalItems: 0, lastUpdated: '', categories: {} };

  private isInitialized = false;

  /**
   * 初始化数据（懒加载）
   */
  private async initialize() {
    if (this.isInitialized) return;

    try {
      // 动态导入案例分析数据（如果存在）
      try {
        const caseModule = await import('@/data/case-analysis');
        this.caseAnalysisData = caseModule.caseAnalysisData || [];
        this.caseAnalysisIndices = caseModule.caseAnalysisIndices || { chapters: {}, difficulty: {} };
        this.caseAnalysisDisplayMaps = caseModule.caseAnalysisDisplayMaps || { chapters: {}, difficulty: {} };
        this.caseAnalysisMetadata = caseModule.caseAnalysisMetadata || { totalItems: 0, lastUpdated: '', categories: {} };
      } catch (error) {
        console.warn('案例分析数据未找到，可能尚未创建相关内容');
      }

      // 动态导入论文指导数据（如果存在）
      try {
        const essayModule = await import('@/data/essay-guidance');
        this.essayGuidanceData = essayModule.essayGuidanceData || [];
        this.essayGuidanceIndices = essayModule.essayGuidanceIndices || { chapters: {}, difficulty: {} };
        this.essayGuidanceDisplayMaps = essayModule.essayGuidanceDisplayMaps || { chapters: {}, difficulty: {} };
        this.essayGuidanceMetadata = essayModule.essayGuidanceMetadata || { totalItems: 0, lastUpdated: '', categories: {} };
      } catch (error) {
        console.warn('论文指导数据未找到，可能尚未创建相关内容');
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('问答题数据初始化失败:', error);
      throw error;
    }
  }

  /**
   * 获取所有案例分析
   */
  async getAllCaseAnalysis(): Promise<CaseAnalysis[]> {
    await this.initialize();
    return [...this.caseAnalysisData];
  }

  /**
   * 获取所有论文指导
   */
  async getAllEssayGuidance(): Promise<EssayGuidance[]> {
    await this.initialize();
    return [...this.essayGuidanceData];
  }

  /**
   * 根据章节获取案例分析
   */
  async getCaseAnalysisByChapter(chapter: string): Promise<CaseAnalysis[]> {
    await this.initialize();
    const questionIds = this.caseAnalysisIndices.chapters[chapter] || [];
    return this.caseAnalysisData.filter(item => questionIds.includes(item.id));
  }

  /**
   * 获取案例分析的导航信息（上一个/下一个）
   */
  async getCaseAnalysisNavigation(chapter: string, currentIndex: number) {
    await this.initialize();
    const items = await this.getCaseAnalysisByChapter(chapter);
    
    return {
      canGoPrevious: currentIndex > 0,
      canGoNext: currentIndex < items.length - 1,
      totalItems: items.length,
      currentItem: items[currentIndex] || null,
      previousItem: currentIndex > 0 ? items[currentIndex - 1] : null,
      nextItem: currentIndex < items.length - 1 ? items[currentIndex + 1] : null
    };
  }

  /**
   * 根据章节获取论文指导
   */
  async getEssayGuidanceByChapter(chapter: string): Promise<EssayGuidance[]> {
    await this.initialize();
    const questionIds = this.essayGuidanceIndices.chapters[chapter] || [];
    return this.essayGuidanceData.filter(item => questionIds.includes(item.id));
  }

  /**
   * 获取论文指导的导航信息（上一个/下一个）
   */
  async getEssayGuidanceNavigation(chapter: string, currentIndex: number) {
    await this.initialize();
    const items = await this.getEssayGuidanceByChapter(chapter);
    
    return {
      canGoPrevious: currentIndex > 0,
      canGoNext: currentIndex < items.length - 1,
      totalItems: items.length,
      currentItem: items[currentIndex] || null,
      previousItem: currentIndex > 0 ? items[currentIndex - 1] : null,
      nextItem: currentIndex < items.length - 1 ? items[currentIndex + 1] : null
    };
  }

  /**
   * 根据难度获取案例分析
   */
  async getCaseAnalysisByDifficulty(difficulty: string): Promise<CaseAnalysis[]> {
    await this.initialize();
    const questionIds = this.caseAnalysisIndices.difficulty[difficulty] || [];
    return this.caseAnalysisData.filter(item => questionIds.includes(item.id));
  }

  /**
   * 根据难度获取论文指导
   */
  async getEssayGuidanceByDifficulty(difficulty: string): Promise<EssayGuidance[]> {
    await this.initialize();
    const questionIds = this.essayGuidanceIndices.difficulty[difficulty] || [];
    return this.essayGuidanceData.filter(item => questionIds.includes(item.id));
  }

  /**
   * 根据技术领域获取案例分析
   */
  async getCaseAnalysisByDomain(domain: string): Promise<CaseAnalysis[]> {
    await this.initialize();
    const questionIds = this.caseAnalysisIndices.domains?.[domain] || [];
    return this.caseAnalysisData.filter(item => questionIds.includes(item.id));
  }

  /**
   * 根据论文类型获取论文指导
   */
  async getEssayGuidanceByPaperType(paperType: string): Promise<EssayGuidance[]> {
    await this.initialize();
    const questionIds = this.essayGuidanceIndices.paperType?.[paperType] || [];
    return this.essayGuidanceData.filter(item => questionIds.includes(item.id));
  }

  /**
   * 根据ID获取案例分析
   */
  async getCaseAnalysisById(id: string): Promise<CaseAnalysis | null> {
    await this.initialize();
    return this.caseAnalysisData.find(item => item.id === id) || null;
  }

  /**
   * 根据ID获取论文指导
   */
  async getEssayGuidanceById(id: string): Promise<EssayGuidance | null> {
    await this.initialize();
    return this.essayGuidanceData.find(item => item.id === id) || null;
  }

  /**
   * 获取案例分析显示映射
   */
  async getCaseAnalysisDisplayMaps(): Promise<AnswerQuestionMaps> {
    await this.initialize();
    return { ...this.caseAnalysisDisplayMaps };
  }

  /**
   * 获取论文指导显示映射
   */
  async getEssayGuidanceDisplayMaps(): Promise<AnswerQuestionMaps> {
    await this.initialize();
    return { ...this.essayGuidanceDisplayMaps };
  }

  /**
   * 获取案例分析索引
   */
  async getCaseAnalysisIndices(): Promise<AnswerQuestionIndices> {
    await this.initialize();
    return { ...this.caseAnalysisIndices };
  }

  /**
   * 获取论文指导索引
   */
  async getEssayGuidanceIndices(): Promise<AnswerQuestionIndices> {
    await this.initialize();
    return { ...this.essayGuidanceIndices };
  }

  /**
   * 获取案例分析元数据
   */
  async getCaseAnalysisMetadata(): Promise<AnswerQuestionMetadata> {
    await this.initialize();
    return { ...this.caseAnalysisMetadata };
  }

  /**
   * 获取论文指导元数据
   */
  async getEssayGuidanceMetadata(): Promise<AnswerQuestionMetadata> {
    await this.initialize();
    return { ...this.essayGuidanceMetadata };
  }

  /**
   * 搜索案例分析（按关键词）
   */
  async searchCaseAnalysis(query: string): Promise<CaseAnalysis[]> {
    await this.initialize();
    const lowerQuery = query.toLowerCase();
    return this.caseAnalysisData.filter(item =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.content.toLowerCase().includes(lowerQuery) ||
      item.tags.keywords?.some(keyword => keyword.toLowerCase().includes(lowerQuery)) ||
      item.tags.domains?.some(domain => domain.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * 搜索论文指导（按关键词）
   */
  async searchEssayGuidance(query: string): Promise<EssayGuidance[]> {
    await this.initialize();
    const lowerQuery = query.toLowerCase();
    return this.essayGuidanceData.filter(item =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.topic.toLowerCase().includes(lowerQuery) ||
      item.content.toLowerCase().includes(lowerQuery) ||
      item.tags.keywords?.some(keyword => keyword.toLowerCase().includes(lowerQuery)) ||
      item.tags.paperType?.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * 获取可用的章节列表
   */
  async getAvailableChapters(type: 'case-analysis' | 'essay-guidance'): Promise<Array<{ key: string; name: string; count: number }>> {
    await this.initialize();
    
    const indices = type === 'case-analysis' ? this.caseAnalysisIndices : this.essayGuidanceIndices;
    const displayMaps = type === 'case-analysis' ? this.caseAnalysisDisplayMaps : this.essayGuidanceDisplayMaps;
    
    return Object.entries(indices.chapters).map(([key, questionIds]) => ({
      key,
      name: displayMaps.chapters[key] || key,
      count: questionIds.length
    })).sort((a, b) => a.key.localeCompare(b.key));
  }

  /**
   * 获取可用的难度列表
   */
  async getAvailableDifficulties(type: 'case-analysis' | 'essay-guidance'): Promise<Array<{ key: string; name: string; count: number }>> {
    await this.initialize();
    
    const indices = type === 'case-analysis' ? this.caseAnalysisIndices : this.essayGuidanceIndices;
    const displayMaps = type === 'case-analysis' ? this.caseAnalysisDisplayMaps : this.essayGuidanceDisplayMaps;
    
    return Object.entries(indices.difficulty).map(([key, questionIds]) => ({
      key,
      name: displayMaps.difficulty[key] || key,
      count: questionIds.length
    })).sort((a, b) => {
      const order = { 'basic': 0, 'medium': 1, 'hard': 2 };
      return (order[a.key as keyof typeof order] || 999) - (order[b.key as keyof typeof order] || 999);
    });
  }

  /**
   * 获取可用的技术领域列表（仅案例分析）
   */
  async getAvailableDomains(): Promise<Array<{ key: string; name: string; count: number }>> {
    await this.initialize();
    
    if (!this.caseAnalysisIndices.domains || !this.caseAnalysisDisplayMaps.domains) {
      return [];
    }
    
    return Object.entries(this.caseAnalysisIndices.domains).map(([key, questionIds]) => ({
      key,
      name: this.caseAnalysisDisplayMaps.domains?.[key] || key,
      count: questionIds.length
    })).sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * 获取可用的论文类型列表（仅论文指导）
   */
  async getAvailablePaperTypes(): Promise<Array<{ key: string; name: string; count: number }>> {
    await this.initialize();
    
    if (!this.essayGuidanceIndices.paperType || !this.essayGuidanceDisplayMaps.paperType) {
      return [];
    }
    
    return Object.entries(this.essayGuidanceIndices.paperType).map(([key, questionIds]) => ({
      key,
      name: this.essayGuidanceDisplayMaps.paperType?.[key] || key,
      count: questionIds.length
    })).sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * 统计信息
   */
  async getStatistics(): Promise<{
    caseAnalysis: { total: number; byDifficulty: Record<string, number>; byChapter: Record<string, number> };
    essayGuidance: { total: number; byDifficulty: Record<string, number>; byChapter: Record<string, number> };
  }> {
    await this.initialize();
    
    return {
      caseAnalysis: {
        total: this.caseAnalysisData.length,
        byDifficulty: { ...this.caseAnalysisMetadata.categories },
        byChapter: Object.fromEntries(
          Object.entries(this.caseAnalysisIndices.chapters).map(([key, ids]) => [key, ids.length])
        )
      },
      essayGuidance: {
        total: this.essayGuidanceData.length,
        byDifficulty: { ...this.essayGuidanceMetadata.categories },
        byChapter: Object.fromEntries(
          Object.entries(this.essayGuidanceIndices.chapters).map(([key, ids]) => [key, ids.length])
        )
      }
    };
  }
}

// 创建单例实例
export const answerQuestionService = new AnswerQuestionService();

// 导出类型
export type { AnswerQuestionIndices, AnswerQuestionMaps, AnswerQuestionMetadata };