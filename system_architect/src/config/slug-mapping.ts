// 章节目录名到英文slug的映射配置
export const chapterSlugMapping: Record<string, string> = {
  // 基础知识章节 (新的12章节结构)
  '00-考试介绍及备考攻略': 'exam-introduction-strategy',
  '01-计算机系统基础': 'computer-system-fundamentals',
  '02-嵌入式系统': 'embedded-systems',
  '03-计算机网络': 'computer-networks',
  '04-数据库系统': 'database-systems',
  '05-系统工程与信息系统基础': 'systems-engineering-information-systems',
  '06-软件工程': 'software-engineering',
  '07-知识产权与标准化': 'intellectual-property-standardization',
  '08-项目管理': 'project-management',
  '09-软件架构设计': 'software-architecture-design',
  '10-系统可靠性分析与设计': 'system-reliability-analysis-design',
  '11-信息安全技术基础知识': 'information-security-fundamentals',
  
  // 旧的映射已移除，避免与新结构冲突
  // 这些内容已合并到 '09-软件架构设计' 章节中
  
  // 案例分析章节
  '电商系统架构': 'ecommerce-system-architecture',
  '金融系统架构': 'financial-system-architecture',
  '社交网络架构': 'social-network-architecture',
  '物联网系统架构': 'iot-system-architecture',
  '大数据处理架构': 'big-data-processing-architecture',
  '云原生架构': 'cloud-native-architecture',
  
  // 论文指导章节
  '论文写作基础': 'paper-writing-basics',
  '架构设计论文模板': 'architecture-design-paper-template',
  '优秀论文范例': 'excellent-paper-examples',
  '常见问题分析': 'common-issues-analysis',
  '评分标准解读': 'scoring-criteria-interpretation',
  
  // 练习题库章节
  '选择题': 'multiple-choice-questions',
  '案例分析题': 'case-study-questions',
  '模拟试题': 'mock-exams',
  '历年真题': 'past-exam-papers'
};

// 反向映射：从英文slug到中文标题
export const slugToChapterMapping: Record<string, string> = Object.fromEntries(
  Object.entries(chapterSlugMapping).map(([chineseName, englishSlug]) => [englishSlug, chineseName])
);

// 根据目录名生成英文slug
export function generateEnglishSlug(chapterDirName: string): string {
  const cleanName = chapterDirName.replace(/^\d+-/, ''); // 移除数字前缀
  return chapterSlugMapping[chapterDirName] || chapterSlugMapping[cleanName] || 
         // 如果没有映射，生成默认的英文slug
         cleanName.toLowerCase()
           .replace(/[\u4e00-\u9fff]/g, '') // 移除中文字符
           .replace(/[^a-z0-9]+/g, '-')     // 替换非字母数字为连字符
           .replace(/^-+|-+$/g, '');        // 移除首尾连字符
}

// 根据英文slug获取中文标题
export function getChapterTitle(slug: string): string {
  const chapterDirName = slugToChapterMapping[slug];
  if (!chapterDirName) return slug;
  
  // 移除数字前缀，返回中文标题
  return chapterDirName.replace(/^\d+-/, '');
}

// 验证slug是否存在
export function isValidChapterSlug(slug: string): boolean {
  return slug in slugToChapterMapping;
}