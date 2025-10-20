const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * 批量修复题目问题的脚本
 */

// 需要修复的题目及其knowledge标签
const knowledgeFixes = {
  '0033': ['软件架构', '架构设计'],
  '0050': ['数学基础', '数据分析'],  
  '0051': ['数学基础', '线性规划'],
  '0058': ['企业管理', '系统架构'],
  '0065': ['软件工程', '逆向工程'],
  '0069': ['软件架构', '架构设计'],
  '0072': ['面向对象', '继承机制'],
  '0073': ['数学基础', '集合论'],
  '0074': ['计算机网络', '网络协议'],
  '0079': ['软件工程', '开发模型'],
  '0081': ['法律法规', '知识产权'],
  '0090': ['软件建模', 'UML']
};

// 需要添加解析的题目（题目ID和原始题号的映射）
const analysisNeeds = {
  '0018': '21',
  '0021': '25', 
  '0027': '31',
  '0030': '34',
  '0039': '43',
  '0040': '44',
  '0044': '4',  // 2025年上半年
  '0049': '53', // 2024年下半年 -> 这个需要核实
  '0057': '17', // 2025年上半年
  '0062': '23', // 2025年上半年
  '0069': '31', // 2025年上半年
  '0072': '34', // 2025年上半年
  '0099': '61', // 2025年上半年
  '0102': '64'  // 2025年上半年
};

async function fixQuestions() {
  console.log('🔧 开始批量修复题目...');
  
  const questionsDir = '/Users/weixianli/Downloads/17/content/2025/04-练习题库/questions';
  
  // 修复knowledge字段
  for (const [questionId, knowledge] of Object.entries(knowledgeFixes)) {
    const filePath = path.join(questionsDir, `${questionId}.md`);
    
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const { data, content: markdownContent } = matter(content);
        
        if (Array.isArray(data.tags.knowledge) && data.tags.knowledge.length === 0) {
          data.tags.knowledge = knowledge;
          
          const updatedContent = matter.stringify(markdownContent, data);
          fs.writeFileSync(filePath, updatedContent);
          
          console.log(`✅ 修复 ${questionId} 的knowledge字段: ${knowledge.join(', ')}`);
        }
      } catch (error) {
        console.error(`❌ 修复 ${questionId} 失败:`, error.message);
      }
    }
  }
  
  console.log('🎉 批量修复完成！');
}

// 执行修复
if (require.main === module) {
  fixQuestions().catch(error => {
    console.error('❌ 批量修复失败:', error);
    process.exit(1);
  });
}

module.exports = { fixQuestions };