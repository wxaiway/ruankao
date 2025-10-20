const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const glob = require('glob');
const { marked } = require('marked');

/**
 * 通用内容构建系统
 * 支持选择题、案例分析、论文指导等多种内容类型
 */

async function buildAllContent() {
  console.log('🚀 开始构建所有内容模块...');
  
  // 构建选择题（04-练习题库）
  await buildQuestions();
  
  // 构建案例分析（02-案例分析）
  await buildCaseAnalysis();
  
  // 构建论文指导（03-论文指导）
  await buildEssayGuidance();
  
  console.log('✅ 所有内容构建完成！');
}

/**
 * 构建选择题数据（保持现有逻辑）
 */
async function buildQuestions() {
  console.log('📚 构建选择题数据...');
  
  const questionFiles = glob.sync('content/2025/04-练习题库/questions/*.md');
  console.log(`   发现 ${questionFiles.length} 个选择题文件`);
  
  if (questionFiles.length === 0) {
    console.log('   跳过选择题构建（无文件）');
    return;
  }
  
  const questionsData = [];
  const indices = createEmptyIndices();
  const maps = createEmptyMaps();
  const metadata = createEmptyMetadata();
  
  for (const file of questionFiles) {
    try {
      const questionData = await processQuestionFile(file);
      if (questionData) {
        questionsData.push(questionData);
        updateIndicesAndMaps(questionData, indices, maps, metadata);
      }
    } catch (error) {
      console.error(`   ❌ 处理选择题文件失败: ${file}`, error.message);
    }
  }
  
  // 生成选择题数据文件
  await writeQuestionDataFile('src/data', {
    questionsData: questionsData.sort((a, b) => a.id.localeCompare(b.id)),
    indices,
    maps,
    metadata
  });
  
  console.log(`   ✅ 选择题构建完成: ${questionsData.length} 题`);
}

/**
 * 构建案例分析数据
 */
async function buildCaseAnalysis() {
  console.log('📋 构建案例分析数据...');
  
  const caseFiles = glob.sync('content/2025/02-案例分析/**/*.md');
  console.log(`   发现 ${caseFiles.length} 个案例分析文件`);
  
  if (caseFiles.length === 0) {
    console.log('   跳过案例分析构建（无文件）');
    return;
  }
  
  const casesData = [];
  const indices = createEmptyAnswerIndices();
  const maps = createEmptyAnswerMaps();
  const metadata = createEmptyAnswerMetadata();
  
  for (const file of caseFiles) {
    try {
      const caseData = await processCaseAnalysisFile(file);
      if (caseData) {
        casesData.push(caseData);
        updateAnswerIndicesAndMaps(caseData, indices, maps, metadata);
      }
    } catch (error) {
      console.error(`   ❌ 处理案例分析文件失败: ${file}`);
      console.error(`   💡 请确保文件包含正确的 <!-- ANSWER_START --> 和 <!-- ANSWER_END --> 标记`);
      console.error(`   📝 错误详情: ${error.message}`);
    }
  }
  
  // 生成案例分析数据文件
  await writeCaseAnalysisDataFile('src/data', {
    casesData: casesData.sort((a, b) => a.id.localeCompare(b.id)),
    indices,
    maps,
    metadata
  });
  
  console.log(`   ✅ 案例分析构建完成: ${casesData.length} 个案例`);
}

/**
 * 构建论文指导数据
 */
async function buildEssayGuidance() {
  console.log('📝 构建论文指导数据...');
  
  const essayFiles = glob.sync('content/2025/03-论文指导/**/*.md');
  console.log(`   发现 ${essayFiles.length} 个论文指导文件`);
  
  if (essayFiles.length === 0) {
    console.log('   跳过论文指导构建（无文件）');
    return;
  }
  
  const essaysData = [];
  const indices = createEmptyAnswerIndices();
  const maps = createEmptyAnswerMaps();
  const metadata = createEmptyAnswerMetadata();
  
  for (const file of essayFiles) {
    try {
      const essayData = await processEssayGuidanceFile(file);
      if (essayData) {
        essaysData.push(essayData);
        updateAnswerIndicesAndMaps(essayData, indices, maps, metadata);
      }
    } catch (error) {
      console.error(`   ❌ 处理论文指导文件失败: ${file}`);
      console.error(`   💡 请确保文件包含正确的 <!-- ANSWER_START --> 和 <!-- ANSWER_END --> 标记`);
      console.error(`   📝 错误详情: ${error.message}`);
    }
  }
  
  // 生成论文指导数据文件
  await writeEssayGuidanceDataFile('src/data', {
    essaysData: essaysData.sort((a, b) => a.id.localeCompare(b.id)),
    indices,
    maps,
    metadata
  });
  
  console.log(`   ✅ 论文指导构建完成: ${essaysData.length} 个指导`);
}

/**
 * 处理选择题文件（保持现有逻辑）
 */
async function processQuestionFile(file) {
  const fileContent = fs.readFileSync(file, 'utf-8');
  const { data: frontmatter, content } = matter(fileContent);
  
  const questionId = path.basename(file, '.md');
  const questionNumber = parseInt(questionId);
  
  if (isNaN(questionNumber)) {
    console.warn(`   ⚠️ 题目编号格式错误: ${file}`);
    return null;
  }
  
  const options = parseOptionsFromMarkdown(content);
  
  return {
    id: questionId,
    title: frontmatter.title || '',
    type: frontmatter.type || 'single-choice',
    content: content,
    options: options,
    correctAnswer: frontmatter.correctAnswer,
    explanation: convertMarkdownToHTML(extractExplanationFromMarkdown(content)),
    tags: frontmatter.tags || {},
    points: frontmatter.points || 1,
    estimatedTime: frontmatter.estimatedTime || 60,
    source: frontmatter.source
  };
}

/**
 * 处理案例分析文件
 */
async function processCaseAnalysisFile(file) {
  const fileContent = fs.readFileSync(file, 'utf-8');
  const { data: frontmatter, content } = matter(fileContent);
  
  const caseId = frontmatter.id || path.basename(file, '.md');
  
  // 使用新的解析方法处理内容
  const parsedContent = parseAnswerQuestionContent(content);
  
  return {
    id: caseId,
    title: frontmatter.title || '',
    type: 'case-analysis',
    content: convertMarkdownToHTML(parsedContent.questionContent),
    answer: {
      content: convertMarkdownToHTML(parsedContent.answer.content),
      keyPoints: parsedContent.answer.keyPoints,
      gradingRubric: parsedContent.answer.gradingRubric,
      references: parsedContent.answer.references
    },
    tags: {
      chapter: frontmatter.chapter || '',
      difficulty: frontmatter.difficulty || frontmatter.tags?.difficulty || 'medium',
      domains: frontmatter.tags?.domains || [],
      keywords: frontmatter.tags?.keywords || []
    },
    estimatedTime: frontmatter.estimatedTime || 30,
    images: frontmatter.images || []
  };
}

/**
 * 处理论文指导文件
 */
async function processEssayGuidanceFile(file) {
  const fileContent = fs.readFileSync(file, 'utf-8');
  const { data: frontmatter, content } = matter(fileContent);
  
  const essayId = frontmatter.id || path.basename(file, '.md');
  
  // 使用新的解析方法处理内容
  const parsedContent = parseAnswerQuestionContent(content);
  
  return {
    id: essayId,
    title: frontmatter.title || '',
    type: 'essay-guidance',
    topic: frontmatter.topic || '',
    content: convertMarkdownToHTML(parsedContent.questionContent),
    wordLimit: frontmatter.wordLimit,
    guidance: {
      structure: convertMarkdownToHTML(parsedContent.answer.content),
      keyPoints: parsedContent.answer.keyPoints,
      examples: parsedContent.answer.examples || '',
      commonMistakes: parsedContent.answer.commonMistakes || [],
      gradingCriteria: parsedContent.answer.gradingRubric
    },
    tags: {
      chapter: frontmatter.chapter || '',
      difficulty: frontmatter.difficulty || frontmatter.tags?.difficulty || 'medium',
      paperType: frontmatter.tags?.paperType || '',
      keywords: frontmatter.tags?.keywords || []
    },
    estimatedTime: frontmatter.estimatedTime || 45
  };
}

/**
 * 验证内容是否为问答题格式
 */
function isAnswerQuestionFormat(content) {
  return content.includes('<!-- ANSWER_START -->') && content.includes('<!-- ANSWER_END -->');
}

/**
 * 解析问答题内容结构（新版本）
 * 支持 <!-- ANSWER_START --> 和 <!-- ANSWER_END --> 分隔符
 */
function parseAnswerQuestionContent(content) {
  // 验证内容格式
  if (!isAnswerQuestionFormat(content)) {
    throw new Error('内容不符合问答题格式：缺少 ANSWER_START/ANSWER_END 标记');
  }

  // 使用注释分隔符分割题目和答案部分
  const answerMatch = content.match(/<!-- ANSWER_START -->([\s\S]*?)<!-- ANSWER_END -->/);
  
  let questionContent = '';
  let requirements = '';
  let answer = { 
    content: '', 
    keyPoints: [], 
    gradingRubric: [], 
    references: [],
    examples: '',
    commonMistakes: []
  };
  
  if (answerMatch) {
    // 分离题目部分和答案部分
    const questionPart = content.replace(/<!-- ANSWER_START -->[\s\S]*?<!-- ANSWER_END -->/, '').trim();
    const answerPart = answerMatch[1].trim();
    
    // 移除重复的标题（以 # 开头的行）
    const cleanedQuestionPart = questionPart.replace(/^# .+$/m, '').trim();
    
    // 解析题目部分
    const questionSections = cleanedQuestionPart.split(/^## /m).filter(section => section.trim());
    
    for (const section of questionSections) {
      const lines = section.split('\n');
      const title = lines[0].trim();
      const body = lines.slice(1).join('\n').trim();
      
      if (title.includes('案例背景') || title.includes('写作背景') || title.includes('背景')) {
        questionContent += `## ${title}\n${body}\n\n`;
      } else if (title.includes('分析要求') || title.includes('写作要求') || title.includes('要求')) {
        requirements = body;
        questionContent += `## ${title}\n${body}\n\n`;
      } else if (!title.includes('标题')) {
        // 其他题目内容
        questionContent += `## ${title}\n${body}\n\n`;
      }
    }
    
    // 解析答案部分
    parseAnswerSection(answerPart, answer);
  } else {
    // 如果没有分隔符，处理整个内容
    // 但需要正确提取要求部分
    questionContent = content;
    
    // 尝试从内容中提取要求部分
    const requirementsMatch = content.match(/## (分析要求|写作要求|要求)[^#]*?(?=\n## |$)/s);
    if (requirementsMatch) {
      requirements = requirementsMatch[0].replace(/## (分析要求|写作要求|要求)\s*/, '').trim();
    }
  }
  
  return { 
    questionContent: questionContent.trim(), 
    requirements: requirements.trim(), 
    answer 
  };
}

/**
 * 解析答案部分内容
 */
function parseAnswerSection(answerContent, answer) {
  // 提取主要答案内容（去掉关键要点、评分标准、参考资料等部分）
  let mainContent = answerContent;
  
  // 提取关键要点
  const keyPointsMatch = answerContent.match(/## 关键要点\s*\n([\s\S]*?)(?=\n## |$)/);
  if (keyPointsMatch) {
    const keyPointsText = keyPointsMatch[1];
    answer.keyPoints = keyPointsText
      .split('\n')
      .filter(line => line.trim().startsWith('- '))
      .map(line => line.replace(/^- /, '').trim());
    
    mainContent = mainContent.replace(keyPointsMatch[0], '');
  }
  
  // 提取评分标准（表格格式）
  const gradingMatch = answerContent.match(/## 评分标准\s*\n([\s\S]*?)(?=\n## |$)/);
  if (gradingMatch) {
    const gradingText = gradingMatch[1];
    answer.gradingRubric = parseGradingTable(gradingText);
    
    mainContent = mainContent.replace(gradingMatch[0], '');
  }
  
  // 提取参考资料
  const referencesMatch = answerContent.match(/## 参考资料\s*\n([\s\S]*?)(?=\n## |$)/);
  if (referencesMatch) {
    const referencesText = referencesMatch[1];
    answer.references = referencesText
      .split('\n')
      .filter(line => line.trim().startsWith('- '))
      .map(line => line.replace(/^- /, '').trim());
    
    mainContent = mainContent.replace(referencesMatch[0], '');
  }
  
  // 提取常见问题（如果存在）
  const mistakesMatch = answerContent.match(/## 常见问题[\s\S]*?\n([\s\S]*?)(?=\n## |$)/);
  if (mistakesMatch) {
    answer.commonMistakes = mistakesMatch[1]
      .split('\n')
      .filter(line => line.trim().startsWith('- ') || line.trim().startsWith('**问题'))
      .map(line => line.replace(/^- /, '').replace(/^\*\*问题\d+[\:\：]/, '').trim());
    
    mainContent = mainContent.replace(mistakesMatch[0], '');
  }
  
  answer.content = mainContent.trim();
}

/**
 * 解析评分标准表格
 */
function parseGradingTable(tableText) {
  const lines = tableText.split('\n').filter(line => line.trim());
  const gradingRubric = [];
  
  for (const line of lines) {
    if (line.includes('|') && !line.includes('---')) {
      const columns = line.split('|').map(col => col.trim()).filter(col => col);
      
      if (columns.length >= 3 && !columns[0].includes('评分项')) {
        gradingRubric.push({
          criteria: columns[0],
          points: parseInt(columns[1].replace(/[^\d]/g, '')) || 0,
          description: columns[2] || ''
        });
      }
    }
  }
  
  return gradingRubric;
}

/**
 * 解析案例分析内容结构（旧版本，保留兼容性）
 */
function parseCaseAnalysisContent(content) {
  return parseAnswerQuestionContent(content);
}

/**
 * 解析论文指导内容结构
 */
function parseEssayGuidanceContent(content) {
  const sections = content.split(/^# /m).filter(section => section.trim());
  
  let topic = '';
  let requirements = '';
  let guidance = { structure: '', keyPoints: [], examples: '', commonMistakes: [], gradingCriteria: [] };
  
  for (const section of sections) {
    const lines = section.split('\n');
    const title = lines[0].trim();
    const body = lines.slice(1).join('\n').trim();
    
    if (title.includes('论文题目') || title.includes('题目')) {
      topic = body;
    } else if (title.includes('写作要求') || title.includes('要求')) {
      requirements = body;
    } else if (title.includes('写作指导') || title.includes('指导')) {
      // 进一步解析指导内容的子章节
      const guidanceSections = body.split(/^## /m);
      for (const guideSection of guidanceSections) {
        const guideLines = guideSection.split('\n');
        const guideTitle = guideLines[0].trim();
        const guideBody = guideLines.slice(1).join('\n').trim();
        
        if (guideTitle.includes('论文结构') || guideTitle.includes('结构')) {
          guidance.structure = guideBody;
        } else if (guideTitle.includes('关键要点') || guideTitle.includes('要点')) {
          guidance.keyPoints = guideBody.split('\n').filter(line => line.trim().startsWith('- ')).map(line => line.replace('- ', ''));
        } else if (guideTitle.includes('常见问题') || guideTitle.includes('问题')) {
          guidance.commonMistakes = guideBody.split('\n').filter(line => line.trim().startsWith('- ')).map(line => line.replace('- ', ''));
        }
      }
    }
  }
  
  return { topic, requirements, guidance };
}

/**
 * 将markdown转换为HTML（复用现有函数）
 */
function convertMarkdownToHTML(markdownText) {
  if (!markdownText) return '';
  
  marked.setOptions({
    gfm: true,
    breaks: true,
    sanitize: false,
    smartLists: true,
    smartypants: true
  });
  
  try {
    return marked.parse(markdownText);
  } catch (error) {
    console.warn('⚠️ Markdown转换失败:', error.message);
    return markdownText;
  }
}

/**
 * 写入案例分析数据文件
 */
async function writeCaseAnalysisDataFile(outputDir, data) {
  const filePath = path.join(outputDir, 'case-analysis.ts');
  
  const tsContent = `/**
 * 案例分析数据文件 - 自动生成，请勿手动编辑
 * 生成时间: ${new Date().toLocaleString()}
 */

import { CaseAnalysis } from '@/lib/answer-questions';

export const caseAnalysisData: CaseAnalysis[] = ${JSON.stringify(data.casesData, null, 2)};

export const caseAnalysisIndices = ${JSON.stringify(data.indices, null, 2)};

export const caseAnalysisDisplayMaps = ${JSON.stringify(data.maps, null, 2)};

export const caseAnalysisMetadata = ${JSON.stringify(data.metadata, null, 2)};
`;
  
  fs.writeFileSync(filePath, tsContent);
  
  const sizeKB = Math.round(tsContent.length / 1024);
  console.log(`   📄 case-analysis.ts - ${sizeKB}KB`);
}

/**
 * 写入论文指导数据文件
 */
async function writeEssayGuidanceDataFile(outputDir, data) {
  const filePath = path.join(outputDir, 'essay-guidance.ts');
  
  const tsContent = `/**
 * 论文指导数据文件 - 自动生成，请勿手动编辑
 * 生成时间: ${new Date().toLocaleString()}
 */

import { EssayGuidance } from '@/lib/answer-questions';

export const essayGuidanceData: EssayGuidance[] = ${JSON.stringify(data.essaysData, null, 2)};

export const essayGuidanceIndices = ${JSON.stringify(data.indices, null, 2)};

export const essayGuidanceDisplayMaps = ${JSON.stringify(data.maps, null, 2)};

export const essayGuidanceMetadata = ${JSON.stringify(data.metadata, null, 2)};
`;
  
  fs.writeFileSync(filePath, tsContent);
  
  const sizeKB = Math.round(tsContent.length / 1024);
  console.log(`   📄 essay-guidance.ts - ${sizeKB}KB`);
}

// 复用现有的辅助函数
function createEmptyIndices() {
  return {
    chapters: {},
    years: {},
    difficulty: {},
    questionType: {},
    knowledge: {},
    subjects: {},
    source: {}
  };
}

function createEmptyMaps() {
  return {
    chapters: {},
    years: {},
    difficulty: {},
    questionType: {},
    knowledge: {},
    subjects: {},
    source: {}
  };
}

function createEmptyMetadata() {
  return {
    totalQuestions: 0,
    lastUpdated: new Date().toISOString(),
    categories: {}
  };
}

function createEmptyAnswerIndices() {
  return {
    chapters: {},
    difficulty: {},
    domains: {},
    paperType: {},
    keywords: {}
  };
}

function createEmptyAnswerMaps() {
  return {
    chapters: {},
    difficulty: {},
    domains: {},
    paperType: {},
    keywords: {}
  };
}

function createEmptyAnswerMetadata() {
  return {
    totalItems: 0,
    lastUpdated: new Date().toISOString(),
    categories: {}
  };
}

function updateIndicesAndMaps(questionData, indices, maps, metadata) {
  // 复用现有逻辑
  const questionNumber = parseInt(questionData.id);
  metadata.totalQuestions++;
  
  Object.entries(questionData.tags || {}).forEach(([tagType, tags]) => {
    if (!indices[tagType]) return;
    
    const tagArray = Array.isArray(tags) ? tags : [tags];
    tagArray.forEach(tag => {
      if (!indices[tagType][tag]) {
        indices[tagType][tag] = [];
      }
      indices[tagType][tag].push(questionNumber);
      
      if (!maps[tagType][tag]) {
        maps[tagType][tag] = generateDisplayName(tagType, tag);
      }
    });
  });
  
  const difficulty = questionData.tags?.difficulty || 'unknown';
  metadata.categories[difficulty] = (metadata.categories[difficulty] || 0) + 1;
}

function updateAnswerIndicesAndMaps(questionData, indices, maps, metadata) {
  metadata.totalItems++;
  
  // Handle chapter (single value)
  if (questionData.tags?.chapter) {
    const chapter = questionData.tags.chapter;
    if (!indices.chapters[chapter]) {
      indices.chapters[chapter] = [];
    }
    indices.chapters[chapter].push(questionData.id);
    
    if (!maps.chapters[chapter]) {
      maps.chapters[chapter] = generateAnswerDisplayName('chapters', chapter);
    }
  }
  
  // Handle difficulty (single value)
  if (questionData.tags?.difficulty) {
    const difficulty = questionData.tags.difficulty;
    if (!indices.difficulty[difficulty]) {
      indices.difficulty[difficulty] = [];
    }
    indices.difficulty[difficulty].push(questionData.id);
    
    if (!maps.difficulty[difficulty]) {
      maps.difficulty[difficulty] = generateAnswerDisplayName('difficulty', difficulty);
    }
  }
  
  // Handle other tags (arrays)
  Object.entries(questionData.tags || {}).forEach(([tagType, tags]) => {
    if (!indices[tagType] || tagType === 'chapter' || tagType === 'difficulty') return;
    
    const tagArray = Array.isArray(tags) ? tags : [tags];
    tagArray.forEach(tag => {
      if (!indices[tagType][tag]) {
        indices[tagType][tag] = [];
      }
      indices[tagType][tag].push(questionData.id);
      
      if (!maps[tagType][tag]) {
        maps[tagType][tag] = generateAnswerDisplayName(tagType, tag);
      }
    });
  });
  
  const difficulty = questionData.tags?.difficulty || 'unknown';
  metadata.categories[difficulty] = (metadata.categories[difficulty] || 0) + 1;
}

function generateDisplayName(tagType, tag) {
  // 复用现有逻辑
  switch (tagType) {
    case 'chapters':
      if (tag.startsWith('ch')) {
        const chapterNum = tag.substring(2);
        return `第${chapterNum.padStart(2, '0')}章`;
      }
      return tag;
    case 'difficulty':
      const difficultyMap = { 'basic': '基础', 'medium': '中等', 'hard': '困难' };
      return difficultyMap[tag] || tag;
    default:
      return tag;
  }
}

function generateAnswerDisplayName(tagType, tag) {
  switch (tagType) {
    case 'chapters':
      return generateDisplayName(tagType, tag);
    case 'difficulty':
      return generateDisplayName(tagType, tag);
    case 'domains':
      return tag;
    case 'paperType':
      return tag;
    case 'keywords':
      return tag;
    default:
      return tag;
  }
}

// 复用现有的选择题处理函数
function parseOptionsFromMarkdown(content) {
  // 提取题目主体部分（排除解析部分）
  const questionPart = content.split('## 解析')[0];
  const lines = questionPart.split('\n');
  const options = [];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    const optionMatch = trimmedLine.match(/^([A-D])\.\s*(.+)$/);
    if (optionMatch) {
      options.push({
        key: optionMatch[1],
        text: optionMatch[2].trim()
      });
    }
  }
  
  return options;
}

function extractExplanationFromMarkdown(content) {
  const explanationMatch = content.match(/## 解析\n\n([\s\S]*?)(?=\n## |$)/);
  if (!explanationMatch) {
    // 尝试不需要双换行的情况
    const simpleMatch = content.match(/## 解析\n([\s\S]*?)(?=\n## |$)/);
    return simpleMatch ? simpleMatch[1].trim() : '';
  }
  return explanationMatch ? explanationMatch[1].trim() : '';
}

async function writeQuestionDataFile(outputDir, data) {
  // 复用现有的选择题写入逻辑
  const filePath = path.join(outputDir, 'questions.ts');
  
  const tsContent = `/**
 * 题目数据文件 - 自动生成，请勿手动编辑
 * 生成时间: ${new Date().toLocaleString()}
 */

import { Question } from '@/lib/questions';

export const questionsData: Question[] = ${JSON.stringify(data.questionsData, null, 2)};

export const questionIndices = ${JSON.stringify(data.indices, null, 2)};

export const displayMaps = ${JSON.stringify(data.maps, null, 2)};

export const questionMetadata = ${JSON.stringify(data.metadata, null, 2)};
`;
  
  fs.writeFileSync(filePath, tsContent);
  
  const sizeKB = Math.round(tsContent.length / 1024);
  console.log(`   📄 questions.ts - ${sizeKB}KB`);
}

// 执行构建
if (require.main === module) {
  buildAllContent().catch(error => {
    console.error('❌ 构建失败:', error);
    process.exit(1);
  });
}

module.exports = { 
  buildAllContent,
  buildQuestions, 
  buildCaseAnalysis, 
  buildEssayGuidance 
};