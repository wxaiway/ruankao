/**
 * 年份版本化配置管理
 * 支持多年份学习资料的组织和管理
 */

export interface YearConfig {
  year: number;
  name: string;
  description: string;
  isDefault: boolean;
  isArchived: boolean;
  examDate?: string; // 11月考试时间
  springExamDate?: string; // 5月考试时间
  features?: string[];
}

/**
 * 年份配置
 */
export const YEARS_CONFIG: Record<number, YearConfig> = {
  2025: {
    year: 2025,
    name: '2025年版',
    description: '2025年软件架构师考试资料',
    isDefault: true,
    isArchived: false,
    examDate: '2025-11-08', // 11月初
    springExamDate: '2025-05-24', // 5月底
    features: ['全新架构风格', '云原生内容', 'AI辅助学习']
  }
};

/**
 * 全局年份配置
 */
export const GLOBAL_YEAR_CONFIG = {
  /** 当前默认年份 */
  currentYear: 2025,
  
  /** 所有可用年份（按降序排列） */
  availableYears: [2025],
  
  /** 已归档年份 */
  archivedYears: [],
  
  /** 默认重定向策略 */
  defaultRedirect: 'current' as 'current' | 'latest',
  
  /** 年份URL前缀 */
  yearUrlPrefix: '',
  
  /** 是否显示年份选择器 */
  showYearSelector: false,  // 只有一个年份时不显示选择器
  
  /** 最大支持年份数 */
  maxYearSpan: 5
} as const;

/**
 * 获取年份配置
 */
export function getYearConfig(year: number): YearConfig | null {
  return YEARS_CONFIG[year] || null;
}

/**
 * 获取当前年份
 */
export function getCurrentYear(): number {
  return GLOBAL_YEAR_CONFIG.currentYear;
}

/**
 * 获取默认年份配置
 */
export function getDefaultYearConfig(): YearConfig {
  const defaultYear = Object.values(YEARS_CONFIG).find(config => config.isDefault);
  return defaultYear || YEARS_CONFIG[GLOBAL_YEAR_CONFIG.currentYear];
}

/**
 * 获取所有可用年份
 */
export function getAvailableYears(): number[] {
  return [...GLOBAL_YEAR_CONFIG.availableYears];
}

/**
 * 获取已归档年份
 */
export function getArchivedYears(): number[] {
  return [...GLOBAL_YEAR_CONFIG.archivedYears];
}

/**
 * 检查年份是否有效
 */
export function isValidYear(year: number): boolean {
  return (GLOBAL_YEAR_CONFIG.availableYears as readonly number[]).includes(year);
}

/**
 * 检查年份是否已归档
 */
export function isArchivedYear(year: number): boolean {
  return (GLOBAL_YEAR_CONFIG.archivedYears as readonly number[]).includes(year);
}

/**
 * 规范化路径格式 - 确保根路径以 / 结尾，其他路径不以 / 结尾
 */
function normalizePath(path: string): string {
  if (!path || path === '') return '/';
  if (path === '/') return '/';
  return path.endsWith('/') ? path.slice(0, -1) : path;
}

/**
 * 解析路径中的年份
 * @param pathname 原始路径名
 * @returns 年份和清理后的路径
 */
export function parseYearFromPath(pathname: string): { year: number; cleanPath: string } {
  const normalizedPath = normalizePath(pathname);
  
  // 匹配年份前缀：/YYYY 或 /YYYY/...
  const yearMatch = normalizedPath.match(/^\/(\d{4})(.*)$/);
  
  if (yearMatch) {
    const year = parseInt(yearMatch[1]);
    if (isValidYear(year)) {
      const remainingPath = yearMatch[2] || '';
      return {
        year,
        cleanPath: normalizePath(remainingPath) 
      };
    }
  }
  
  // 没有找到有效年份，使用当前年份
  return {
    year: getCurrentYear(),
    cleanPath: normalizedPath
  };
}

/**
 * 生成年份路径
 * @param year 年份
 * @param cleanPath 清理后的路径（不包含年份前缀）
 * @returns 完整的年份路径
 */
export function generateYearPath(year: number, cleanPath: string): string {
  const config = getYearConfig(year);
  if (!config) return cleanPath;
  
  const normalizedCleanPath = normalizePath(cleanPath);
  
  // 当前年份（默认年份）不使用年份前缀
  if (config.isDefault) {
    return normalizedCleanPath;
  }
  
  // 归档年份使用年份前缀
  if (normalizedCleanPath === '/') {
    return `/${year}`;
  } else {
    return `/${year}${normalizedCleanPath}`;
  }
}

/**
 * 年份变更日志
 */
export const YEAR_CHANGELOG: Record<number, string[]> = {
  2025: [
    '新增云原生架构专题',
    '更新微服务架构实践',
    '增加AI辅助架构设计内容',
    '优化移动端学习体验'
  ]
};

/**
 * 获取年份变更日志
 */
export function getYearChangelog(year: number): string[] {
  return YEAR_CHANGELOG[year] || [];
}

/**
 * 考试倒计时相关功能
 */

/**
 * 获取下一场考试时间和剩余天数
 */
export function getNextExamInfo(): {
  examDate: string;
  daysRemaining: number;
  examType: 'spring' | 'autumn';
  examName: string;
} {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // JavaScript月份从0开始
  
  // 获取当前年份的考试配置
  const yearConfig = getYearConfig(currentYear);
  
  let nextExamDate: Date;
  let examType: 'spring' | 'autumn';
  let examName: string;
  
  // 判断下一场考试
  if (currentMonth <= 5) {
    // 当前是1-5月，下一场是5月底的春季考试
    const springDate = yearConfig?.springExamDate || `${currentYear}-05-25`; // 默认是5月第四个周六
    nextExamDate = new Date(springDate);
    examType = 'spring';
    examName = `${currentYear}年上半年软件架构师考试`;
  } else if (currentMonth <= 11) {
    // 当前是6-11月，下一场是11月初的秋季考试
    const autumnDate = yearConfig?.examDate || `${currentYear}-11-02`; // 默认是11月第一个周六
    nextExamDate = new Date(autumnDate);
    examType = 'autumn';
    examName = `${currentYear}年下半年软件架构师考试`;
  } else {
    // 当前是12月，下一场是明年的春季考试
    const nextYear = currentYear + 1;
    const nextYearConfig = getYearConfig(nextYear);
    const springDate = nextYearConfig?.springExamDate || `${nextYear}-05-25`;
    nextExamDate = new Date(springDate);
    examType = 'spring';
    examName = `${nextYear}年上半年软件架构师考试`;
  }
  
  // 计算剩余天数
  const timeDiff = nextExamDate.getTime() - now.getTime();
  const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  return {
    examDate: nextExamDate.toISOString().split('T')[0],
    daysRemaining: Math.max(0, daysRemaining),
    examType,
    examName
  };
}

/**
 * 格式化考试日期显示
 */
export function formatExamDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}