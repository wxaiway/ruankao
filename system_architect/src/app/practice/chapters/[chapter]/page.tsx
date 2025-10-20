/**
 * 章节练习页面
 * 显示指定章节的题目练习界面
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NewChapterPractice } from '@/components/practice/NewChapterPractice';

interface ChapterPracticePageProps {
  params: {
    chapter: string;
  };
}

export async function generateMetadata({ params }: ChapterPracticePageProps): Promise<Metadata> {
  // 这里可以根据章节key获取章节名称
  const chapterName = getChapterName(params.chapter);
  
  return {
    title: `${chapterName} - 章节练习 - 软件架构师学习平台`,
    description: `${chapterName}章节的练习题目，帮助你巩固该知识点的核心概念和应用`,
  };
}

function getChapterName(chapterKey: string): string {
  const chapterNames: Record<string, string> = {
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
  
  return chapterNames[chapterKey] || '未知章节';
}

export default function ChapterPracticePage({ params }: ChapterPracticePageProps) {
  // 验证章节key格式
  if (!/^ch\d{2}$/.test(params.chapter)) {
    notFound();
  }

  return <NewChapterPractice chapterKey={params.chapter} />;
}