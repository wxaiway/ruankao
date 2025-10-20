const fs = require('fs');
const path = require('path');

/**
 * 案例分析题提取脚本
 * 从真题文档中提取案例分析题并转换为标准格式
 */

// 题目映射配置
const caseAnalysisMapping = {
  '2024年11月系统架构设计师真题-解析.md': {
    year: '2024-2',
    outputDir: 'content/2025/02-案例分析/2024-2',
    cases: [
      {
        id: 'case001',
        title: '软件架构质量属性场景分析',
        keywords: ['质量属性', '软件架构', '场景分析', 'ATAM'],
        domains: ['软件架构', '系统设计'],
        difficulty: 'hard',
        points: 25,
        estimatedTime: 45
      },
      {
        id: 'case002',
        title: '数据库cache-aside架构设计',
        keywords: ['缓存架构', 'cache-aside', '数据库设计'],
        domains: ['数据库系统', '系统架构'],
        difficulty: 'medium',
        points: 25,
        estimatedTime: 40
      },
      {
        id: 'case003',
        title: 'ROS机器人操作系统分析',
        keywords: ['ROS', '机器人系统', '嵌入式系统'],
        domains: ['嵌入式系统', '机器人技术'],
        difficulty: 'hard',
        points: 25,
        estimatedTime: 45
      },
      {
        id: 'case004',
        title: 'Elasticsearch分词系统设计',
        keywords: ['Elasticsearch', '分词', '搜索引擎'],
        domains: ['搜索技术', 'Web应用'],
        difficulty: 'medium',
        points: 25,
        estimatedTime: 40
      },
      {
        id: 'case005',
        title: '医用血糖监测系统安全分析',
        keywords: ['医疗系统', '安全分析', '嵌入式安全'],
        domains: ['医疗信息系统', '信息安全'],
        difficulty: 'hard',
        points: 25,
        estimatedTime: 45
      }
    ]
  },
  '2025年05月系统架构设计师真题-解析.md': {
    year: '2025-1',
    outputDir: 'content/2025/02-案例分析/2025-1',
    cases: [
      {
        id: 'case006',
        title: '大模型训练平台架构设计',
        keywords: ['大模型', '训练平台', '质量属性场景', '解释器架构'],
        domains: ['人工智能', '软件架构'],
        difficulty: 'hard',
        points: 25,
        estimatedTime: 50
      },
      {
        id: 'case007',
        title: '医药知识图谱智能问答系统',
        keywords: ['知识图谱', '智能问答', 'scrapy', '异步IO'],
        domains: ['知识图谱', '人工智能'],
        difficulty: 'hard',
        points: 25,
        estimatedTime: 45
      },
      {
        id: 'case008',
        title: 'Redis主从复制与数据持久化',
        keywords: ['Redis', '主从复制', '数据持久化', 'RDB', 'AOF'],
        domains: ['数据库系统', '分布式系统'],
        difficulty: 'medium',
        points: 25,
        estimatedTime: 40
      },
      {
        id: 'case009',
        title: '端侧AI资源池化设计',
        keywords: ['端侧AI', '资源池化', '边缘计算'],
        domains: ['人工智能', '边缘计算'],
        difficulty: 'hard',
        points: 25,
        estimatedTime: 45
      },
      {
        id: 'case010',
        title: '区块链农产品溯源系统',
        keywords: ['区块链', '溯源系统', '智能合约'],
        domains: ['区块链', '供应链管理'],
        difficulty: 'hard',
        points: 25,
        estimatedTime: 50
      }
    ]
  }
};

/**
 * 从真题文档中提取案例分析部分
 */
function extractCaseAnalysisFromDocument(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // 找到案例分析部分的开始和结束位置
  const caseAnalysisStart = content.indexOf('# 案例分析');
  const essayStart = content.indexOf('# 论文写作');
  
  if (caseAnalysisStart === -1) {
    console.warn(`❌ 未找到案例分析部分: ${filePath}`);
    return '';
  }
  
  const endPos = essayStart !== -1 ? essayStart : content.length;
  const caseAnalysisContent = content.substring(caseAnalysisStart, endPos);
  
  return caseAnalysisContent;
}

/**
 * 转换中文数字到阿拉伯数字
 */
function convertChineseNumber(chineseNum) {
  const chineseNumberMap = {
    '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
    '六': 6, '七': 7, '八': 8, '九': 9, '十': 10
  };
  
  // 如果已经是阿拉伯数字，直接返回
  if (/^\d+$/.test(chineseNum)) {
    return parseInt(chineseNum);
  }
  
  // 转换中文数字
  if (chineseNumberMap[chineseNum]) {
    return chineseNumberMap[chineseNum];
  }
  
  // 默认返回1
  return 1;
}

/**
 * 解析案例分析内容，分割为独立的案例
 */
function parseCaseAnalysis(content) {
  const cases = [];
  
  // 使用正则表达式匹配案例题目（支持中文数字）
  const caseRegex = /## 试题([一二三四五六七八九十\d]+)：(.+?)(?=## 试题[一二三四五六七八九十\d]+：|# 论文写作|$)/gs;
  let match;
  
  while ((match = caseRegex.exec(content)) !== null) {
    const caseNumberStr = match[1];
    // 转换中文数字到阿拉伯数字
    const caseNumber = convertChineseNumber(caseNumberStr);
    const caseContent = match[0];
    
    cases.push({
      number: caseNumber,
      content: caseContent.trim()
    });
  }
  
  return cases;
}

/**
 * 生成案例分析的Frontmatter
 */
function generateCaseFrontmatter(caseInfo, yearInfo) {
  return `---
id: '${caseInfo.id}'
title: '${caseInfo.title}'
difficulty: '${caseInfo.difficulty}'
chapter: '${yearInfo.year}'
estimatedTime: ${caseInfo.estimatedTime}
points: ${caseInfo.points}
year: '${yearInfo.year}'
source: '${yearInfo.year === '2024-2' ? '2024年11月' : '2025年05月'}系统架构设计师真题'
tags:
  keywords: ${JSON.stringify(caseInfo.keywords)}
  domains: ${JSON.stringify(caseInfo.domains)}
  difficulty: '${caseInfo.difficulty}'
---`;
}

/**
 * 处理案例内容，提取题目和答案
 */
function processCaseContent(rawContent) {
  // 移除案例编号标题
  let content = rawContent.replace(/^## 试题\d+：/, '# ');
  
  // 查找答案部分（通常在解析文档中会有答案标记）
  const answerMatch = content.match(/(答案：[\s\S]*?)(?=\n## |$)/);
  const explanationMatch = content.match(/(解析：[\s\S]*?)(?=\n## |$)/);
  
  let mainContent = content;
  let answerSection = '';
  
  if (answerMatch || explanationMatch) {
    // 提取题目主体部分（去掉答案和解析）
    mainContent = content.replace(/(答案：[\s\S]*?)(?=\n## |$)/, '')
                        .replace(/(解析：[\s\S]*?)(?=\n## |$)/, '');
    
    // 构建答案部分
    answerSection = '\n<!-- ANSWER_START -->\n## 参考答案\n\n';
    
    if (answerMatch) {
      answerSection += answerMatch[1].replace('答案：', '').trim() + '\n\n';
    }
    
    if (explanationMatch) {
      answerSection += '## 详细解析\n\n' + explanationMatch[1].replace('解析：', '').trim() + '\n\n';
    }
    
    answerSection += '## 关键要点\n\n';
    answerSection += '- 理解题目中的核心技术概念\n';
    answerSection += '- 掌握相关架构设计原理\n';
    answerSection += '- 能够分析实际应用场景\n\n';
    
    answerSection += '## 评分标准\n\n';
    answerSection += '- 技术理解准确性（40%）\n';
    answerSection += '- 分析逻辑清晰性（30%）\n';
    answerSection += '- 实践应用合理性（30%）\n\n';
    
    answerSection += '<!-- ANSWER_END -->';
  }
  
  return {
    mainContent: mainContent.trim(),
    answerSection: answerSection
  };
}

/**
 * 生成完整的案例分析文档
 */
function generateCaseDocument(caseInfo, yearInfo, caseContent) {
  const frontmatter = generateCaseFrontmatter(caseInfo, yearInfo);
  const { mainContent, answerSection } = processCaseContent(caseContent);
  
  return `${frontmatter}

${mainContent}${answerSection}
`;
}

/**
 * 主处理函数
 */
async function extractCaseAnalysis() {
  console.log('🔍 开始提取案例分析题...');
  
  const sourceDir = 't';
  let totalExtracted = 0;
  
  // 处理每个真题文档
  for (const [filename, config] of Object.entries(caseAnalysisMapping)) {
    const sourceFile = path.join(sourceDir, filename);
    
    if (!fs.existsSync(sourceFile)) {
      console.warn(`⚠️  源文件不存在: ${sourceFile}`);
      continue;
    }
    
    console.log(`📖 处理文档: ${filename}`);
    
    // 确保输出目录存在
    if (!fs.existsSync(config.outputDir)) {
      fs.mkdirSync(config.outputDir, { recursive: true });
    }
    
    // 提取案例分析内容
    const caseAnalysisContent = extractCaseAnalysisFromDocument(sourceFile);
    if (!caseAnalysisContent) {
      continue;
    }
    
    // 解析为独立案例
    const cases = parseCaseAnalysis(caseAnalysisContent);
    
    console.log(`📝 发现 ${cases.length} 道案例分析题`);
    
    // 生成每道案例的文档
    cases.forEach((caseData, index) => {
      if (index >= config.cases.length) {
        console.warn(`⚠️  案例配置不足: ${filename} 第${index + 1}题`);
        return;
      }
      
      const caseInfo = config.cases[index];
      const document = generateCaseDocument(caseInfo, config, caseData.content);
      
      const outputPath = path.join(config.outputDir, `${caseInfo.id}.md`);
      fs.writeFileSync(outputPath, document);
      
      console.log(`✅ 生成案例: ${outputPath}`);
      totalExtracted++;
    });
  }
  
  console.log(`\n🎉 案例分析题提取完成！共提取 ${totalExtracted} 道题目`);
}

// 执行提取
if (require.main === module) {
  extractCaseAnalysis().catch(error => {
    console.error('❌ 提取失败:', error);
    process.exit(1);
  });
}

module.exports = { extractCaseAnalysis };