/**
 * 练习题库主页面
 * 显示练习模式选择界面
 */

import { Metadata } from 'next';
import { PracticeSelector } from '@/components/practice/PracticeSelector';
import { getContainerClasses, getPaddingClasses } from '@/lib/layout-config';

export const metadata: Metadata = {
  title: '练习题库 - 软件架构师学习平台',
  description: '系统架构设计师考试练习题库，提供章节练习、历年真题、智能练习等多种练习模式',
};

export default function PracticePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className={`${getPaddingClasses('horizontal')} py-8`}>
        <div className={getContainerClasses('main')}>
          <PracticeSelector />
        </div>
      </div>
    </div>
  );
}