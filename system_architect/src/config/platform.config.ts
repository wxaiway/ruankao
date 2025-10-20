export const platformConfig = {
  categories: [
    {
      id: 'foundation',
      name: '基础知识',
      description: '13个核心知识点，系统掌握软件架构理论基础',
      icon: 'BookOpen',
      color: 'blue',
      path: '/foundation',
      contentDir: '01-基础知识',
      slug: 'foundation'
    },
    {
      id: 'practice-tests',
      name: '练习题库',
      description: '选择题、案例分析、模拟试题和历年真题',
      icon: 'Clock',
      color: 'orange',
      path: '/practice-tests',
      contentDir: '04-练习题库',
      slug: 'practice-tests'
    }
  ],
  
  defaultMaterialTypes: [
    {
      id: 'overview',
      name: '章节简介',
      icon: 'Info',
      description: '章节概述、学习目标和内容指导',
      defaultFormat: 'markdown',
      filePattern: 'index.md',
      priority: 0  // 最高优先级，默认显示在第一位
    },
    {
      id: 'lecture',
      name: '基础讲义',
      icon: 'Play',
      description: 'PPT形式，系统讲解核心概念',
      defaultFormat: 'ppt',
      filePattern: 'lecture.md',
      priority: 1
    },
    {
      id: 'textbook',
      name: '精编教材',
      icon: 'BookOpen',
      description: '深入讲解方法和最佳实践',
      defaultFormat: 'markdown',
      filePattern: 'textbook.md',
      priority: 2
    },
    {
      id: 'notes',
      name: '速记卡片',
      icon: 'Clock',
      description: '关键知识点快速复习',
      defaultFormat: 'markdown',
      filePattern: 'notes.md',
      priority: 3
    },
    {
      id: 'guide',
      name: '冲刺宝典',
      icon: 'TrendingUp',
      description: '考前重点和实战技巧',
      defaultFormat: 'markdown',
      filePattern: 'guide.md',
      priority: 4
    },
    {
      id: 'theory',
      name: '理论基础',
      icon: 'BookOpen',
      description: '理论知识详细讲解',
      defaultFormat: 'markdown',
      filePattern: 'theory.md',
      priority: 5
    },
    {
      id: 'practice',
      name: '实践练习',
      icon: 'Code',
      description: '实践练习和案例',
      defaultFormat: 'markdown',
      filePattern: 'practice.md',
      priority: 6
    },
    {
      id: 'case',
      name: '案例分析',
      icon: 'FileText',
      description: '实际案例分析',
      defaultFormat: 'markdown',
      filePattern: 'case.md',
      priority: 7
    },
    {
      id: 'quiz',
      name: '练习题',
      icon: 'HelpCircle',
      description: '章节练习题',
      defaultFormat: 'quiz',
      filePattern: 'quiz.md',
      priority: 8
    }
  ],
  
  routing: {
    basePath: '/',
    categoryPattern: '/[category]',
    chapterPattern: '/[category]/[chapter]',
    materialPattern: '/[category]/[chapter]/[material]'
  },
  
  ui: {
    theme: 'auto',
    showToc: true,
    showProgress: true,
    enableSearch: true
  }
};