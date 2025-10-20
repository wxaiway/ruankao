const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * 真题解析脚本
 * 将 Markdown 格式的真题转换为标准题目格式
 */

// 知识点映射规则
const knowledgeMapping = {
  '操作系统|内存|页式|进程|死锁|时间片': ['操作系统', '内存管理', '进程管理'],
  '网络|协议|TCP|UDP|传输层|FTP|SMTP|IP|ICMP': ['计算机网络', '网络协议'],
  'NFS|Telnet|调制解调': ['计算机网络'],
  '数据库|SQL|范式|关系': ['数据库系统', '数据库设计'],
  '软件工程|CMMI|测试|成熟度': ['软件工程', '项目管理'],
  '架构|设计模式|组件|仓库|风格': ['软件架构', '架构设计'],
  '安全|机密性|完整性|不可否认|可控性|治理': ['信息安全', '数据安全'],
  '易用性|可用性|性能': ['系统质量', '非功能需求'],
  '通信|信道|双工': ['通信技术'],
  '保密|机密级|国家秘密': ['信息安全', '法律法规']
};

// 章节映射规则
const chapterMapping = {
  '操作系统|内存|进程|死锁': 'ch01',
  '网络|协议|TCP|UDP|传输层|通信|调制': 'ch03',
  '数据库|SQL|范式': 'ch05',
  '软件工程|CMMI|测试|成熟度': 'ch04',
  '架构|设计|仓库|风格|组件': 'ch06',
  '安全|机密|完整性|保密|治理': 'ch11',
  '易用性|可用性|性能|质量': 'ch07'
};

// 难度评估规则
const difficultyRules = {
  basic: ['基础概念', '定义', '分类', '特点'],
  medium: ['计算', '分析', '比较', '应用'],
  hard: ['综合', '设计', '优化', '评估']
};

async function parseRealQuestions() {
  console.log('🚀 开始解析真题...');
  
  const examFiles = [
    { 
      file: 't/2024年11月系统架构设计师真题-解析.md',
      year: '2024',
      period: '2',
      hasAnswer: true
    },
    {
      file: 't/2025年05月系统架构设计师真题-解析.md', 
      year: '2025',
      period: '1',
      hasAnswer: true
    }
  ];

  let questionId = 1;
  const allQuestions = [];

  for (const examFile of examFiles) {
    console.log(`📖 处理文件: ${examFile.file}`);
    
    try {
      const content = fs.readFileSync(examFile.file, 'utf-8');
      const questions = parseExamContent(content, examFile, questionId);
      
      allQuestions.push(...questions);
      questionId += questions.length;
      
      console.log(`✅ 解析完成，共 ${questions.length} 道题`);
    } catch (error) {
      console.error(`❌ 解析 ${examFile.file} 失败:`, error.message);
    }
  }

  // 清理现有测试数据
  await cleanupTestData();
  
  // 生成新的题目文件
  await generateQuestionFiles(allQuestions);
  
  console.log(`🎉 真题解析完成！共生成 ${allQuestions.length} 道题目`);
}

function parseExamContent(content, examInfo, startId) {
  const questions = [];
  
  // 按题目标题分割内容
  const questionBlocks = content.split(/(?=## \d{4}年\d{1,2}月第\d+(?:-\d+)?题)/);
  
  for (let i = 1; i < questionBlocks.length; i++) {
    try {
      const questionData = parseQuestionBlock(questionBlocks[i], examInfo, startId + i - 1);
      if (questionData) {
        if (Array.isArray(questionData)) {
          questions.push(...questionData);
        } else {
          questions.push(questionData);
        }
      }
    } catch (error) {
      console.warn(`⚠️  解析第 ${i} 题失败:`, error.message);
    }
  }
  
  return questions;
}

function parseQuestionBlock(block, examInfo, questionId) {
  const lines = block.trim().split('\n');
  
  // 解析题目标题
  const headerMatch = lines[0].match(/## (\d{4})年(\d{1,2})月第(\d+(?:-\d+)?)题/);
  if (!headerMatch) return null;
  
  const questionNumber = headerMatch[3];
  
  // 处理题组（如71-75题）
  if (questionNumber.includes('-')) {
    const [start, end] = questionNumber.split('-').map(n => parseInt(n));
    if (end - start > 2) {
      return parseQuestionGroup(block, examInfo, questionId, questionNumber);
    } else {
      return parseMultipleQuestion(block, examInfo, questionId, questionNumber);
    }
  }
  
  return parseSingleQuestion(block, examInfo, questionId, questionNumber);
}

function parseSingleQuestion(block, examInfo, questionId, questionNumber) {
  const lines = block.trim().split('\n');
  
  // 提取题目内容
  let questionText = '';
  let options = [];
  let answer = '';
  let explanation = '';
  
  let currentSection = 'question';
  let questionStarted = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // 跳过标题行
    if (line.startsWith('##')) {
      questionStarted = true;
      continue;
    }
    
    if (!questionStarted) continue;
    
    // 识别答案行
    if (line.match(/^答案[：:]\s*([A-D])\s*$/)) {
      answer = line.match(/^答案[：:]\s*([A-D])\s*$/)[1];
      currentSection = 'explanation';
      continue;
    }
    
    // 识别解析开始
    if (line.match(/^解析[：:]/) || (currentSection === 'explanation' && line.length > 0)) {
      currentSection = 'explanation';
      if (!line.match(/^解析[：:]/)) {
        explanation += line + '\n';
      }
      continue;
    }
    
    // 识别选项
    const optionMatch = line.match(/^([A-D])\.\s*(.+)$/);
    if (optionMatch && currentSection === 'question') {
      options.push({
        key: optionMatch[1],
        text: optionMatch[2].trim()
      });
      continue;
    }
    
    // 题目内容
    if (currentSection === 'question' && line.length > 0 && !optionMatch) {
      questionText += line + '\n';
    }
  }
  
  // 清理和验证
  questionText = questionText.trim();
  explanation = explanation.trim();
  
  if (!questionText || options.length !== 4 || !answer) {
    console.warn(`⚠️  题目 ${questionNumber} 数据不完整`);
    return null;
  }
  
  // 生成题目标题
  const title = generateQuestionTitle(questionText);
  
  // 推断知识点和章节
  const knowledge = inferKnowledge(questionText + ' ' + explanation);
  const chapters = inferChapters(questionText + ' ' + explanation);
  const difficulty = inferDifficulty(questionText + ' ' + explanation);
  
  // 构建完整题目内容
  const fullContent = buildFullContent(questionText, options, explanation);
  
  return {
    id: questionId.toString().padStart(4, '0'),
    title,
    type: 'single-choice',
    content: fullContent,
    options,
    correctAnswer: answer,
    explanation: convertToHTML(explanation),
    tags: {
      knowledge,
      chapters,
      years: [`${examInfo.year}-${examInfo.period}`],
      subjects: ['综合知识'],
      difficulty,
      questionType: 'single-choice',
      source: ['历年真题']
    },
    points: 1,
    estimatedTime: estimateTime(questionText, explanation),
    source: `${examInfo.year}年${examInfo.period === '1' ? '上' : '下'}半年真题第${questionNumber}题`
  };
}

function parseMultipleQuestion(block, examInfo, questionId, questionNumber) {
  // 处理填空题（如1-2题、4-5题）
  const lines = block.trim().split('\n');
  const [startNum, endNum] = questionNumber.split('-').map(n => parseInt(n));
  
  // 提取题目内容
  let questionText = '';
  let options1 = [], options2 = [];
  let answers = '';
  let explanation = '';
  
  let currentSection = 'question';
  let questionStarted = false;
  let optionGroup = 1;
  
  for (const line of lines) {
    const trimLine = line.trim();
    
    if (trimLine.startsWith('##')) {
      questionStarted = true;
      continue;
    }
    
    if (!questionStarted) continue;
    
    // 识别答案
    if (trimLine.match(/^答案[：:]\s*([A-D](?:\s+[A-D])?)\s*$/)) {
      answers = trimLine.match(/^答案[：:]\s*([A-D](?:\s+[A-D])?)\s*$/)[1];
      currentSection = 'explanation';
      continue;
    }
    
    // 识别解析
    if (trimLine.match(/^解析[：:]/) || (currentSection === 'explanation' && trimLine.length > 0)) {
      currentSection = 'explanation';
      if (!trimLine.match(/^解析[：:]/)) {
        explanation += trimLine + '\n';
      }
      continue;
    }
    
    // 识别选项
    const optionMatch = trimLine.match(/^([A-D])\.\s*(.+)$/);
    if (optionMatch && currentSection === 'question') {
      const option = {
        key: optionMatch[1],
        text: optionMatch[2].trim()
      };
      
      if (optionGroup === 1) {
        options1.push(option);
        if (options1.length === 4) optionGroup = 2;
      } else {
        options2.push(option);
      }
      continue;
    }
    
    // 题目内容
    if (currentSection === 'question' && trimLine.length > 0 && !optionMatch) {
      questionText += trimLine + '\n';
    }
  }
  
  // 解析答案
  const answerArray = answers.trim().split(/\s+/);
  if (answerArray.length !== 2) {
    console.warn(`⚠️  题目 ${questionNumber} 答案格式错误: ${answers}`);
    return null;
  }
  
  // 生成两个独立题目
  const questions = [];
  const baseTitle = generateQuestionTitle(questionText);
  
  // 第一题
  questions.push({
    id: questionId.toString().padStart(4, '0'),
    title: `${baseTitle}(第1空)`,
    type: 'single-choice',
    content: buildFullContent(questionText + '\n\n**第一个空：**', options1, explanation),
    options: options1,
    correctAnswer: answerArray[0],
    explanation: convertToHTML(explanation),
    tags: {
      knowledge: inferKnowledge(questionText),
      chapters: inferChapters(questionText),
      years: [`${examInfo.year}-${examInfo.period}`],
      subjects: ['综合知识'],
      difficulty: inferDifficulty(questionText),
      questionType: 'single-choice',
      source: ['历年真题']
    },
    points: 1,
    estimatedTime: estimateTime(questionText, explanation),
    source: `${examInfo.year}年${examInfo.period === '1' ? '上' : '下'}半年真题第${startNum}题`
  });
  
  // 第二题
  questions.push({
    id: (questionId + 1).toString().padStart(4, '0'),
    title: `${baseTitle}(第2空)`,
    type: 'single-choice',
    content: buildFullContent(questionText + '\n\n**第二个空：**', options2, explanation),
    options: options2,
    correctAnswer: answerArray[1],
    explanation: convertToHTML(explanation),
    tags: {
      knowledge: inferKnowledge(questionText),
      chapters: inferChapters(questionText),
      years: [`${examInfo.year}-${examInfo.period}`],
      subjects: ['综合知识'],
      difficulty: inferDifficulty(questionText),
      questionType: 'single-choice',
      source: ['历年真题']
    },
    points: 1,
    estimatedTime: estimateTime(questionText, explanation),
    source: `${examInfo.year}年${examInfo.period === '1' ? '上' : '下'}半年真题第${endNum}题`
  });
  
  return questions;
}

function parseQuestionGroup(block, examInfo, questionId, questionNumber) {
  // 处理大题组，暂时作为整体保留
  const lines = block.trim().split('\n');
  
  let content = '';
  let started = false;
  
  for (const line of lines) {
    if (line.startsWith('##')) {
      started = true;
      continue;
    }
    if (started) {
      content += line + '\n';
    }
  }
  
  return {
    id: questionId.toString().padStart(4, '0'),
    title: `案例分析题组 (第${questionNumber}题)`,
    type: 'case-analysis',
    content: content.trim(),
    options: [],
    correctAnswer: '',
    explanation: '',
    tags: {
      knowledge: ['案例分析'],
      chapters: ['ch06'],
      years: [`${examInfo.year}-${examInfo.period}`],
      subjects: ['案例分析'],
      difficulty: 'hard',
      questionType: 'case-analysis',
      source: ['历年真题']
    },
    points: 15,
    estimatedTime: 900,
    source: `${examInfo.year}年${examInfo.period === '1' ? '上' : '下'}半年真题第${questionNumber}题`
  };
}

function generateQuestionTitle(questionText) {
  // 从题目内容生成简洁标题
  let title = questionText.replace(/\n/g, ' ').trim();
  
  // 移除题目编号
  title = title.replace(/^\d+[-.]?\s*/, '');
  
  // 提取关键概念
  const concepts = [];
  for (const [pattern] of Object.entries(knowledgeMapping)) {
    const regex = new RegExp(pattern, 'i');
    if (regex.test(title)) {
      const match = title.match(regex);
      if (match) concepts.push(match[0]);
    }
  }
  
  if (concepts.length > 0) {
    return `关于${concepts[0]}的问题`;
  }
  
  // 截取前30个字符作为标题
  return title.length > 30 ? title.substring(0, 30) + '...' : title;
}

function inferKnowledge(text) {
  const knowledge = [];
  
  for (const [pattern, keywords] of Object.entries(knowledgeMapping)) {
    const regex = new RegExp(pattern, 'i');
    if (regex.test(text)) {
      knowledge.push(...keywords);
    }
  }
  
  return [...new Set(knowledge)]; // 去重
}

function inferChapters(text) {
  for (const [pattern, chapter] of Object.entries(chapterMapping)) {
    const regex = new RegExp(pattern, 'i');
    if (regex.test(text)) {
      return [chapter];
    }
  }
  return ['ch06']; // 默认章节
}

function inferDifficulty(text) {
  const textLower = text.toLowerCase();
  
  if (textLower.match(/计算|分析|比较|应用/)) {
    return 'medium';
  }
  if (textLower.match(/综合|设计|优化|评估/)) {
    return 'hard';
  }
  return 'basic';
}

function estimateTime(questionText, explanation) {
  const totalLength = questionText.length + explanation.length;
  
  if (totalLength < 200) return 60;
  if (totalLength < 500) return 90;
  if (totalLength < 1000) return 120;
  return 150;
}

function buildFullContent(questionText, options, explanation) {
  let content = `# ${questionText}\n\n`;
  
  for (const option of options) {
    content += `${option.key}. ${option.text}\n`;
  }
  
  if (explanation) {
    content += `\n## 解析\n\n${explanation}`;
  }
  
  return content;
}

function convertToHTML(markdownText) {
  if (!markdownText) return '';
  
  // 简单的 markdown 到 HTML 转换
  return markdownText
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>');
}

async function cleanupTestData() {
  console.log('🧹 清理测试数据...');
  
  const questionsDir = 'content/2025/04-练习题库/questions';
  const files = fs.readdirSync(questionsDir);
  
  for (const file of files) {
    if (file.endsWith('.md')) {
      fs.unlinkSync(path.join(questionsDir, file));
      console.log(`🗑️  删除测试文件: ${file}`);
    }
  }
}

async function generateQuestionFiles(questions) {
  console.log('📝 生成题目文件...');
  
  const questionsDir = 'content/2025/04-练习题库/questions';
  
  for (const question of questions) {
    const frontmatter = {
      id: question.id,
      title: question.title,
      type: question.type,
      tags: question.tags,
      correctAnswer: question.correctAnswer,
      points: question.points,
      estimatedTime: question.estimatedTime,
      source: question.source
    };
    
    const fileContent = matter.stringify(question.content, frontmatter);
    const fileName = `${question.id}.md`;
    const filePath = path.join(questionsDir, fileName);
    
    fs.writeFileSync(filePath, fileContent);
    console.log(`✅ 生成: ${fileName}`);
  }
}

// 执行解析
if (require.main === module) {
  parseRealQuestions().catch(error => {
    console.error('❌ 解析失败:', error);
    process.exit(1);
  });
}

module.exports = { parseRealQuestions };