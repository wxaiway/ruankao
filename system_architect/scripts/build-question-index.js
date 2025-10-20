const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const glob = require('glob');
const { marked } = require('marked');

/**
 * 构建题目数据文件（纯前端方案）
 * 生成完整题目数据供前端直接使用
 */
async function buildQuestionIndex() {
  console.log('🔍 开始扫描题目文件...');
  
  // 扫描所有题目文件
  const questionFiles = glob.sync('content/2025/04-练习题库/questions/*.md');
  console.log(`📚 发现 ${questionFiles.length} 个题目文件`);
  
  // 存储完整题目数据
  const questionsData = [];
  
  // 初始化索引结构
  const indices = {
    chapters: {},
    years: {},
    difficulty: {},
    questionType: {},
    knowledge: {},
    subjects: {},
    source: {}
  };
  
  // 映射表，用于显示完整名称
  const maps = {
    chapters: {},
    years: {},
    difficulty: {},
    questionType: {},
    knowledge: {},
    subjects: {},
    source: {}
  };
  
  // 题目元数据统计
  const metadata = {
    totalQuestions: 0,
    lastUpdated: new Date().toISOString(),
    categories: {}
  };
  
  // 处理每个题目文件
  for (const file of questionFiles) {
    try {
      const fileContent = fs.readFileSync(file, 'utf-8');
      const { data: frontmatter, content } = matter(fileContent);
      
      // 提取题目编号（文件名去掉扩展名）
      const questionId = path.basename(file, '.md');
      const questionNumber = parseInt(questionId);
      
      if (isNaN(questionNumber)) {
        console.warn(`⚠️  题目编号格式错误: ${file}`);
        continue;
      }
      
      // 解析选项（从markdown内容中提取）
      const options = parseOptionsFromMarkdown(content);
      
      // 提取纯题目正文（不包含选项和解析）
      const questionContent = extractQuestionContentOnly(content);
      
      // 构建完整题目对象
      const questionData = {
        id: questionId,
        title: frontmatter.title || '',
        type: frontmatter.type || 'single-choice',
        content: questionContent,
        options: options,
        correctAnswer: frontmatter.correctAnswer,
        explanation: convertMarkdownToHTML(extractExplanationFromMarkdown(content)),
        tags: frontmatter.tags || {},
        points: frontmatter.points || 1,
        estimatedTime: frontmatter.estimatedTime || 60,
        source: frontmatter.source
      };
      
      // 添加到题目数据数组
      questionsData.push(questionData);
      
      metadata.totalQuestions++;
      
      // 处理各类标签索引
      Object.entries(frontmatter.tags || {}).forEach(([tagType, tags]) => {
        if (!indices[tagType]) {
          console.warn(`⚠️  未知标签类型: ${tagType}`);
          return;
        }
        
        const tagArray = Array.isArray(tags) ? tags : [tags];
        
        tagArray.forEach(tag => {
          // 初始化索引数组
          if (!indices[tagType][tag]) {
            indices[tagType][tag] = [];
          }
          
          // 添加题目编号到索引
          indices[tagType][tag].push(questionNumber);
          
          // 构建显示名称映射
          if (!maps[tagType][tag]) {
            maps[tagType][tag] = generateDisplayName(tagType, tag, frontmatter);
          }
        });
      });
      
      // 统计分类信息
      const difficulty = frontmatter.tags?.difficulty || 'unknown';
      metadata.categories[difficulty] = (metadata.categories[difficulty] || 0) + 1;
      
    } catch (error) {
      console.error(`❌ 处理文件失败: ${file}`, error.message);
    }
  }
  
  // 对题目编号进行排序
  Object.keys(indices).forEach(indexType => {
    Object.keys(indices[indexType]).forEach(tag => {
      indices[indexType][tag].sort((a, b) => a - b);
    });
  });
  
  // 确保输出目录存在
  const publicOutputDir = 'public/data/question-index';
  const srcOutputDir = 'src/data';
  
  if (!fs.existsSync(publicOutputDir)) {
    fs.mkdirSync(publicOutputDir, { recursive: true });
  }
  if (!fs.existsSync(srcOutputDir)) {
    fs.mkdirSync(srcOutputDir, { recursive: true });
  }
  
  // 生成前端数据文件（主要文件）
  await writeQuestionDataFile(srcOutputDir, {
    questionsData: questionsData.sort((a, b) => a.id.localeCompare(b.id)),
    indices,
    maps,
    metadata
  });
  
  // 生成公共索引文件（向后兼容）
  await Promise.all([
    writeIndexFile(publicOutputDir, 'chapters', indices.chapters),
    writeIndexFile(publicOutputDir, 'years', indices.years),
    writeIndexFile(publicOutputDir, 'difficulty', indices.difficulty),
    writeIndexFile(publicOutputDir, 'questionType', indices.questionType),
    writeIndexFile(publicOutputDir, 'knowledge', indices.knowledge),
    writeIndexFile(publicOutputDir, 'subjects', indices.subjects),
    writeIndexFile(publicOutputDir, 'source', indices.source),
    writeMapFile(publicOutputDir, maps),
    writeMetadataFile(publicOutputDir, metadata)
  ]);
  
  console.log('✅ 题目数据构建完成！');
  console.log(`📊 总题目数: ${metadata.totalQuestions}`);
  console.log(`📂 生成数据文件: src/data/questions.ts`);
  console.log(`📂 生成索引文件: ${Object.keys(indices).length} 个`);
}

/**
 * 写入前端数据文件
 */
async function writeQuestionDataFile(outputDir, data) {
  const filePath = path.join(outputDir, 'questions.ts');
  
  // 生成TypeScript内容
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
  console.log(`📄 questions.ts - ${sizeKB}KB`);
}

/**
 * 写入单个索引文件
 */
async function writeIndexFile(outputDir, indexType, indexData) {
  const filePath = path.join(outputDir, `${indexType}.json`);
  const content = JSON.stringify({ data: indexData }, null, 2);
  fs.writeFileSync(filePath, content);
  
  const sizeKB = Math.round(content.length / 1024);
  console.log(`📄 ${indexType}.json - ${sizeKB}KB`);
}

/**
 * 写入映射文件
 */
async function writeMapFile(outputDir, maps) {
  const filePath = path.join(outputDir, 'maps.json');
  const content = JSON.stringify(maps, null, 2);
  fs.writeFileSync(filePath, content);
  
  const sizeKB = Math.round(content.length / 1024);
  console.log(`🗺️  maps.json - ${sizeKB}KB`);
}

/**
 * 写入元数据文件
 */
async function writeMetadataFile(outputDir, metadata) {
  const filePath = path.join(outputDir, 'metadata.json');
  const content = JSON.stringify(metadata, null, 2);
  fs.writeFileSync(filePath, content);
  
  console.log(`📋 metadata.json - 题目统计信息`);
}

/**
 * 生成标签的显示名称
 */
function generateDisplayName(tagType, tag, frontmatter) {
  switch (tagType) {
    case 'chapters':
      // ch06 -> 第06章-系统架构设计基础
      if (tag.startsWith('ch')) {
        const chapterNum = tag.substring(2);
        return `第${chapterNum.padStart(2, '0')}章-${getChapterName(tag)}`;
      }
      return tag;
      
    case 'years':
      // 2023-1 -> 2023年上半年
      if (tag.match(/\d{4}-[12]/)) {
        const [year, half] = tag.split('-');
        return `${year}年${half === '1' ? '上' : '下'}半年`;
      }
      return tag;
      
    case 'difficulty':
      const difficultyMap = {
        'basic': '基础',
        'medium': '中等', 
        'hard': '困难'
      };
      return difficultyMap[tag] || tag;
      
    case 'questionType':
      const typeMap = {
        'single-choice': '单选题',
        'multiple-choice': '多选题',
        'judgment': '判断题'
      };
      return typeMap[tag] || tag;
      
    default:
      return tag;
  }
}

/**
 * 获取章节名称（这里简化处理，实际可以从配置文件读取）
 */
function getChapterName(chapterCode) {
  const chapterNames = {
    'ch01': '计算机系统基础',
    'ch02': '信息系统基础', 
    'ch03': '信息安全技术',
    'ch04': '软件工程基础',
    'ch05': '数据库设计基础',
    'ch06': '系统架构设计基础',
    'ch07': '系统质量属性与架构评估',
    'ch08': '软件可靠性技术',
    'ch09': '软件架构演化和维护',
    'ch10': '未来信息综合技术',
    'ch11': '标准化与知识产权',
    'ch12': '应用数学',
    'ch13': '专业英语'
  };
  
  return chapterNames[chapterCode] || '未知章节';
}

/**
 * 从markdown内容中解析选项
 */
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

/**
 * 从markdown内容中提取纯题目正文（不包含选项和解析）
 */
function extractQuestionContentOnly(content) {
  // 先去掉解析部分
  const contentWithoutExplanation = content.split('## 解析')[0];
  
  // 按行分割
  const lines = contentWithoutExplanation.split('\n');
  const questionLines = [];
  let foundOptions = false;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // 检测到选项行就停止
    if (trimmedLine.match(/^[A-D]\.\s+/)) {
      foundOptions = true;
      break;
    }
    
    // 跳过空的提示行（如 "**第一个空：**"）
    if (trimmedLine.match(/^\*\*第[一二三四五六七八九十\d]+个?空：?\*\*$/)) {
      continue;
    }
    
    questionLines.push(line);
  }
  
  // 清理末尾多余空行
  while (questionLines.length > 0 && questionLines[questionLines.length - 1].trim() === '') {
    questionLines.pop();
  }
  
  return questionLines.join('\n').trim();
}

/**
 * 从markdown内容中提取解析部分
 */
function extractExplanationFromMarkdown(content) {
  const explanationMatch = content.match(/## 解析\n\n([\s\S]*?)(?=\n## |$)/);
  return explanationMatch ? explanationMatch[1].trim() : '';
}

/**
 * 将markdown转换为HTML
 */
function convertMarkdownToHTML(markdownText) {
  if (!markdownText) return '';
  
  // 配置marked选项
  marked.setOptions({
    gfm: true,          // 启用GitHub风格markdown
    breaks: true,       // 支持换行符转换
    sanitize: false,    // 不进行HTML清理（我们信任内容）
    smartLists: true,   // 智能列表处理
    smartypants: true   // 智能引号和破折号
  });
  
  try {
    return marked.parse(markdownText);
  } catch (error) {
    console.warn('⚠️  Markdown转换失败:', error.message);
    return markdownText; // 降级返回原始文本
  }
}

// 执行构建
if (require.main === module) {
  buildQuestionIndex().catch(error => {
    console.error('❌ 构建失败:', error);
    process.exit(1);
  });
}

module.exports = { buildQuestionIndex };