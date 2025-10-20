const fs = require('fs');
const path = require('path');

/**
 * 论文题提取脚本
 * 从真题文档中提取论文写作题并转换为标准格式
 */

// 论文题映射配置
const essayTopicsMapping = {
  '2024年11月系统架构设计师真题-解析.md': {
    year: '2024-2',
    outputDir: 'content/2025/03-论文指导/2024-2',
    essays: [
      {
        id: 'essay001',
        title: '论软件维护及其应用',
        topic: '软件维护理论与实践应用',
        keywords: ['软件维护', '系统演化', '维护策略', '生命周期'],
        paperType: ['技术论文', '实践总结'],
        difficulty: 'medium',
        estimatedTime: 180,
        wordLimit: { min: 2800, max: 3200 }
      },
      {
        id: 'essay002',
        title: '论面向服务的架构设计',
        topic: 'SOA架构设计原理与实现',
        keywords: ['SOA', '服务架构', '微服务', '架构设计'],
        paperType: ['架构设计', '技术论文'],
        difficulty: 'hard',
        estimatedTime: 180,
        wordLimit: { min: 2800, max: 3200 }
      },
      {
        id: 'essay003',
        title: '论多源异构数据集成方法',
        topic: '异构数据源集成技术与方法',
        keywords: ['数据集成', '异构数据', 'ETL', '数据仓库'],
        paperType: ['技术论文', '方法研究'],
        difficulty: 'hard',
        estimatedTime: 180,
        wordLimit: { min: 2800, max: 3200 }
      },
      {
        id: 'essay004',
        title: '论分布式事务及其解决方案',
        topic: '分布式系统事务处理技术',
        keywords: ['分布式事务', '一致性', '事务处理', 'ACID'],
        paperType: ['技术论文', '解决方案'],
        difficulty: 'hard',
        estimatedTime: 180,
        wordLimit: { min: 2800, max: 3200 }
      }
    ]
  },
  '2025年05月系统架构设计师真题-解析.md': {
    year: '2025-1',
    outputDir: 'content/2025/03-论文指导/2025-1',
    essays: [
      {
        id: 'essay005',
        title: '论软件测试方法及应用',
        topic: 'AI辅助的软件测试技术与应用',
        keywords: ['软件测试', 'AI辅助测试', '测试用例生成', 'TDD'],
        paperType: ['技术论文', '应用研究'],
        difficulty: 'medium',
        estimatedTime: 180,
        wordLimit: { min: 2800, max: 3200 }
      },
      {
        id: 'essay006',
        title: '论多模型数据管理技术及其应用',
        topic: '多模型数据库系统设计与实现',
        keywords: ['多模型数据库', '数据管理', '统一查询', '数据一致性'],
        paperType: ['技术论文', '系统设计'],
        difficulty: 'hard',
        estimatedTime: 180,
        wordLimit: { min: 2800, max: 3200 }
      },
      {
        id: 'essay007',
        title: '论事件驱动架构在软件开发中的应用',
        topic: '事件驱动架构模式与实践',
        keywords: ['事件驱动架构', 'EDA', '异步通信', '松耦合'],
        paperType: ['架构设计', '技术论文'],
        difficulty: 'hard',
        estimatedTime: 180,
        wordLimit: { min: 2800, max: 3200 }
      },
      {
        id: 'essay008',
        title: '论负载均衡设计技术',
        topic: '负载均衡技术原理与实现策略',
        keywords: ['负载均衡', '性能优化', '高可用', '分布式系统'],
        paperType: ['技术论文', '性能优化'],
        difficulty: 'medium',
        estimatedTime: 180,
        wordLimit: { min: 2800, max: 3200 }
      }
    ]
  }
};

/**
 * 从真题文档中提取论文写作部分
 */
function extractEssayTopicsFromDocument(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // 找到论文写作部分
  const essayStart = content.indexOf('# 论文写作');
  
  if (essayStart === -1) {
    console.warn(`❌ 未找到论文写作部分: ${filePath}`);
    return '';
  }
  
  const essayContent = content.substring(essayStart);
  
  return essayContent;
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
 * 解析论文内容，分割为独立的论文题目
 */
function parseEssayTopics(content) {
  const essays = [];
  
  // 使用正则表达式匹配论文题目（支持中文数字）
  const essayRegex = /## 试题([一二三四五六七八九十\d]+)：(.+?)(?=## 试题[一二三四五六七八九十\d]+：|$)/gs;
  let match;
  
  while ((match = essayRegex.exec(content)) !== null) {
    const essayNumberStr = match[1];
    // 转换中文数字到阿拉伯数字
    const essayNumber = convertChineseNumber(essayNumberStr);
    const essayContent = match[0];
    
    essays.push({
      number: essayNumber,
      content: essayContent.trim()
    });
  }
  
  return essays;
}

/**
 * 生成论文题的Frontmatter
 */
function generateEssayFrontmatter(essayInfo, yearInfo) {
  return `---
id: '${essayInfo.id}'
title: '${essayInfo.title}'
topic: '${essayInfo.topic}'
difficulty: '${essayInfo.difficulty}'
chapter: '${yearInfo.year}'
estimatedTime: ${essayInfo.estimatedTime}
wordLimit:
  min: ${essayInfo.wordLimit.min}
  max: ${essayInfo.wordLimit.max}
year: '${yearInfo.year}'
source: '${yearInfo.year === '2024-2' ? '2024年11月' : '2025年05月'}系统架构设计师真题'
tags:
  keywords: ${JSON.stringify(essayInfo.keywords)}
  paperType: ${JSON.stringify(essayInfo.paperType)}
  difficulty: '${essayInfo.difficulty}'
---`;
}

/**
 * 处理论文内容，提取题目要求和写作指导
 */
function processEssayContent(rawContent, essayInfo) {
  // 移除题目编号标题，替换为主标题
  let content = rawContent.replace(/^## 试题\d+：/, '# ');
  
  // 查找写作指导部分（在解析文档中）
  const guidanceMatch = content.match(/(写作指导：[\s\S]*?)(?=\n## |$)/);
  const analysisMatch = content.match(/(分析：[\s\S]*?)(?=\n## |$)/);
  
  let mainContent = content;
  let guidanceSection = '';
  
  // 移除已有的指导内容，提取纯题目要求
  if (guidanceMatch) {
    mainContent = mainContent.replace(/(写作指导：[\s\S]*?)(?=\n## |$)/, '');
  }
  if (analysisMatch) {
    mainContent = mainContent.replace(/(分析：[\s\S]*?)(?=\n## |$)/, '');
  }
  
  // 构建标准的写作指导部分
  guidanceSection = '\n<!-- ANSWER_START -->\n## 写作指导\n\n';
  
  guidanceSection += '### 第一部分：项目概述要点\n\n';
  guidanceSection += '1. **项目背景选择**：选择与论文主题相关的实际项目，背景描述要具体\n';
  guidanceSection += '2. **角色职责描述**：明确说明你在项目中的具体职责和贡献\n';
  guidanceSection += '3. **技术栈介绍**：简要介绍项目使用的核心技术和工具\n';
  guidanceSection += '4. **项目规模说明**：描述项目的规模、周期、团队大小等基本信息\n\n';
  
  guidanceSection += '### 第二部分：理论阐述要点\n\n';
  
  // 根据不同论文主题提供针对性指导
  if (essayInfo.keywords.includes('软件维护')) {
    guidanceSection += '1. **维护类型分类**：正确性维护、适应性维护、完善性维护、预防性维护\n';
    guidanceSection += '2. **维护过程模型**：瀑布模型、迭代模型、螺旋模型在维护中的应用\n';
    guidanceSection += '3. **维护策略**：主动维护vs被动维护、预防性措施\n';
    guidanceSection += '4. **维护工具**：版本控制、缺陷跟踪、自动化测试工具\n\n';
  } else if (essayInfo.keywords.includes('SOA')) {
    guidanceSection += '1. **SOA核心原理**：服务封装、服务接口、服务注册与发现\n';
    guidanceSection += '2. **架构模式**：ESB企业服务总线、微服务架构、RESTful服务\n';
    guidanceSection += '3. **服务治理**：服务生命周期管理、版本控制、监控\n';
    guidanceSection += '4. **技术实现**：Web Services、消息队列、API网关\n\n';
  } else if (essayInfo.keywords.includes('数据集成')) {
    guidanceSection += '1. **集成模式**：ETL、ELT、实时集成、批量集成\n';
    guidanceSection += '2. **数据质量**：数据清洗、去重、标准化、一致性检查\n';
    guidanceSection += '3. **技术架构**：数据仓库、数据湖、数据中台\n';
    guidanceSection += '4. **集成工具**：Kettle、Talend、DataStage等\n\n';
  } else if (essayInfo.keywords.includes('分布式事务')) {
    guidanceSection += '1. **ACID特性**：原子性、一致性、隔离性、持久性在分布式环境中的挑战\n';
    guidanceSection += '2. **一致性模型**：强一致性、最终一致性、因果一致性\n';
    guidanceSection += '3. **解决方案**：2PC、3PC、Saga、TCC补偿事务\n';
    guidanceSection += '4. **实现框架**：Seata、TCC-Transaction、Saga等\n\n';
  } else if (essayInfo.keywords.includes('软件测试')) {
    guidanceSection += '1. **AI辅助测试**：测试用例自动生成、智能缺陷定位、测试数据生成\n';
    guidanceSection += '2. **测试策略**：单元测试、集成测试、系统测试、验收测试\n';
    guidanceSection += '3. **TDD方法**：测试驱动开发流程、红绿重构循环\n';
    guidanceSection += '4. **测试工具**：JUnit、Mockito、Selenium、大语言模型应用\n\n';
  } else if (essayInfo.keywords.includes('多模型数据库')) {
    guidanceSection += '1. **数据模型类型**：关系模型、文档模型、图模型、键值模型\n';
    guidanceSection += '2. **统一查询**：跨模型查询语言、查询优化、执行计划\n';
    guidanceSection += '3. **数据一致性**：ACID事务、分布式一致性、冲突解决\n';
    guidanceSection += '4. **系统架构**：存储引擎、查询引擎、元数据管理\n\n';
  } else if (essayInfo.keywords.includes('事件驱动架构')) {
    guidanceSection += '1. **EDA核心概念**：事件、事件流、事件处理器、事件存储\n';
    guidanceSection += '2. **架构模式**：发布订阅、事件溯源、CQRS、Saga\n';
    guidanceSection += '3. **技术实现**：消息队列、事件总线、流处理引擎\n';
    guidanceSection += '4. **设计原则**：松耦合、异步处理、最终一致性\n\n';
  } else if (essayInfo.keywords.includes('负载均衡')) {
    guidanceSection += '1. **均衡算法**：轮询、加权轮询、最少连接、一致性哈希\n';
    guidanceSection += '2. **均衡层次**：DNS负载均衡、硬件负载均衡、软件负载均衡\n';
    guidanceSection += '3. **健康检查**：主动检查、被动检查、故障转移\n';
    guidanceSection += '4. **性能优化**：连接复用、请求分发、缓存策略\n\n';
  }
  
  guidanceSection += '### 第三部分：实践应用要点\n\n';
  guidanceSection += '1. **具体实现**：结合项目描述具体的技术实现方案和架构设计\n';
  guidanceSection += '2. **问题解决**：说明遇到的具体问题、分析过程和解决方案\n';
  guidanceSection += '3. **效果评估**：量化项目效果，如性能提升、成本降低、效率改善等\n';
  guidanceSection += '4. **经验总结**：提炼项目中的关键经验和最佳实践\n\n';
  
  guidanceSection += '## 写作策略\n\n';
  guidanceSection += '### 结构安排\n';
  guidanceSection += '- **第一部分**：800-1000字，重点描述项目背景和个人职责\n';
  guidanceSection += '- **第二部分**：1200-1400字，详细阐述理论知识和技术原理\n';
  guidanceSection += '- **第三部分**：800-1000字，结合实践深入分析应用效果\n\n';
  
  guidanceSection += '### 语言表达\n';
  guidanceSection += '- 使用准确的技术术语，避免口语化表达\n';
  guidanceSection += '- 逻辑清晰，论证充分，避免空洞的理论堆砌\n';
  guidanceSection += '- 结合具体数据和案例，增强说服力\n';
  guidanceSection += '- 注意段落层次，合理使用小标题\n\n';
  
  guidanceSection += '## 常见问题\n\n';
  guidanceSection += '### 项目描述不具体\n';
  guidanceSection += '- **问题**：项目背景描述过于宽泛，缺乏针对性\n';
  guidanceSection += '- **解决**：选择与论文主题密切相关的具体项目模块进行描述\n\n';
  
  guidanceSection += '### 理论阐述过于浅显\n';
  guidanceSection += '- **问题**：理论部分只是概念罗列，缺乏深度分析\n';
  guidanceSection += '- **解决**：深入分析技术原理，说明为什么这样设计，有什么优势\n\n';
  
  guidanceSection += '### 实践结合不紧密\n';
  guidanceSection += '- **问题**：理论和实践两张皮，缺乏有机结合\n';
  guidanceSection += '- **解决**：在实践部分要呼应理论，说明理论在项目中的具体应用\n\n';
  
  guidanceSection += '## 评分标准\n\n';
  guidanceSection += '### 内容质量（60分）\n';
  guidanceSection += '- **项目描述**（15分）：项目背景真实、职责明确、规模合理\n';
  guidanceSection += '- **理论阐述**（25分）：概念准确、分析深入、逻辑清晰\n';
  guidanceSection += '- **实践应用**（20分）：结合紧密、效果明显、经验有价值\n\n';
  
  guidanceSection += '### 语言表达（25分）\n';
  guidanceSection += '- **语言准确性**（10分）：术语使用准确，表达清晰\n';
  guidanceSection += '- **逻辑结构**（10分）：层次清晰，论证充分\n';
  guidanceSection += '- **语言流畅性**（5分）：文字通顺，可读性强\n\n';
  
  guidanceSection += '### 字数要求（15分）\n';
  guidanceSection += '- 符合字数要求（2800-3200字）\n';
  guidanceSection += '- 各部分比例合理\n';
  guidanceSection += '- 不得抄袭或大段引用\n\n';
  
  guidanceSection += '<!-- ANSWER_END -->';
  
  return {
    mainContent: mainContent.trim(),
    guidanceSection: guidanceSection
  };
}

/**
 * 生成完整的论文指导文档
 */
function generateEssayDocument(essayInfo, yearInfo, essayContent) {
  const frontmatter = generateEssayFrontmatter(essayInfo, yearInfo);
  const { mainContent, guidanceSection } = processEssayContent(essayContent, essayInfo);
  
  return `${frontmatter}

${mainContent}${guidanceSection}
`;
}

/**
 * 主处理函数
 */
async function extractEssayTopics() {
  console.log('🔍 开始提取论文题...');
  
  const sourceDir = 't';
  let totalExtracted = 0;
  
  // 处理每个真题文档
  for (const [filename, config] of Object.entries(essayTopicsMapping)) {
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
    
    // 提取论文写作内容
    const essayContent = extractEssayTopicsFromDocument(sourceFile);
    if (!essayContent) {
      continue;
    }
    
    // 解析为独立论文题
    const essays = parseEssayTopics(essayContent);
    
    console.log(`📝 发现 ${essays.length} 道论文题`);
    
    // 生成每道论文题的文档
    essays.forEach((essayData, index) => {
      if (index >= config.essays.length) {
        console.warn(`⚠️  论文题配置不足: ${filename} 第${index + 1}题`);
        return;
      }
      
      const essayInfo = config.essays[index];
      const document = generateEssayDocument(essayInfo, config, essayData.content);
      
      const outputPath = path.join(config.outputDir, `${essayInfo.id}.md`);
      fs.writeFileSync(outputPath, document);
      
      console.log(`✅ 生成论文题: ${outputPath}`);
      totalExtracted++;
    });
  }
  
  console.log(`\n🎉 论文题提取完成！共提取 ${totalExtracted} 道题目`);
}

// 执行提取
if (require.main === module) {
  extractEssayTopics().catch(error => {
    console.error('❌ 提取失败:', error);
    process.exit(1);
  });
}

module.exports = { extractEssayTopics };