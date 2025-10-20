/**
 * 年份练习总览页面
 * 显示所有可用年份的练习题目
 */

import { Metadata } from 'next';
import { PracticeSelector } from '@/components/practice/PracticeSelector';
import { getContainerClasses, getPaddingClasses } from '@/lib/layout-config';

export const metadata: Metadata = {
  title: '历年真题练习 - 软件架构师学习平台',
  description: '按年份分类的软件架构师历年真题练习，包含各年度上半年和下半年的完整考试题目',
};

export default function YearPracticePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className={`${getPaddingClasses('horizontal')} py-8`}>
        <div className={getContainerClasses('main')}>
          {/* 使用现有的PracticeSelector，它已经包含了年份部分 */}
          <PracticeSelector />
        </div>
      </div>
    </div>
  );
}