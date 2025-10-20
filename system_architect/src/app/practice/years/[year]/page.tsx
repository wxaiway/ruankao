/**
 * 年份练习页面
 * 显示指定年份的题目练习界面
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { YearPractice } from '@/components/practice/YearPractice';

interface YearPracticePageProps {
  params: {
    year: string;
  };
}

// 年份显示名称自动生成（完全自动化，无需手动配置）
function getYearName(yearKey: string): string {
  // 解析年份格式：YYYY-1 或 YYYY-2
  const match = yearKey.match(/^(\d{4})-([12])$/);
  if (match) {
    const year = match[1];
    const semester = match[2] === '1' ? '上半年' : '下半年';
    return `${year}年${semester}`;
  }
  
  // 如果格式不匹配，返回原始值
  return `${yearKey}真题`;
}

export async function generateMetadata({ params }: YearPracticePageProps): Promise<Metadata> {
  const yearName = getYearName(params.year);
  
  return {
    title: `${yearName}真题练习 - 软件架构师学习平台`,
    description: `${yearName}软件架构师考试真题练习，完整的考试题目和详细解析`,
  };
}

export default function YearPracticePage({ params }: YearPracticePageProps) {
  // 验证年份格式 (例如: 2023-1, 2022-2)
  if (!/^\d{4}-[12]$/.test(params.year)) {
    notFound();
  }

  return <YearPractice yearKey={params.year} />;
}