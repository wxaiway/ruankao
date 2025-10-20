/**
 * 使用指南页面
 */

import { Metadata } from 'next';
import { getContainerClasses, getPaddingClasses } from '@/lib/layout-config';
import { Card } from '@/components/ui/Card';
import { BookOpen, Target, FileText, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: '使用指南 - 软件架构师学习平台',
  description: '了解如何使用软件架构师学习平台，快速上手各项功能',
};

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className={`${getPaddingClasses('horizontal')} py-8`}>
        <div className={getContainerClasses('main')}>
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">使用指南</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              欢迎使用软件架构师学习平台！本指南将帮助您快速了解和使用平台的各项功能。
            </p>
          </div>

          {/* 功能介绍 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold">案例分析</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                提供真实的软件架构案例分析，包含详细的解题思路和标准答案。
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li>• 浏览案例题目和要求</li>
                <li>• 查看标准答案和解析</li>
                <li>• 学习分析方法和技巧</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold">论文指导</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                软考论文写作指导，提供写作框架、范文和评分标准。
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li>• 学习论文写作结构</li>
                <li>• 查看优秀范文示例</li>
                <li>• 了解评分要点</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-semibold">练习题库</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                章节练习和历年真题，支持在线答题和查看解析。
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li>• 按章节进行专项练习</li>
                <li>• 历年真题模拟考试</li>
                <li>• 查看详细题目解析</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-orange-600" />
                <h2 className="text-xl font-semibold">学习资料</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                提供系统化的学习教材和参考资料下载。
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li>• 官方教材和大纲</li>
                <li>• 学习笔记和总结</li>
                <li>• 考试经验分享</li>
              </ul>
            </Card>
          </div>

          {/* 常见问题 */}
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold">常见问题</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">如何开始学习？</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  建议先浏览学习资料了解考试大纲，然后进行章节练习巩固基础知识，最后通过案例分析和论文指导提升应试能力。
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">练习题目如何查看答案？</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  在练习过程中，选择答案后点击"提交答案"即可查看正确答案和详细解析。
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">如何获得更多帮助？</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  如有其他问题，请访问<a href="/contact" className="text-blue-600 hover:underline">联系我们</a>页面，我们将尽快为您解答。
                </p>
              </div>
            </div>
          </Card>

          {/* 更新信息 */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              最后更新时间：{new Date().toLocaleDateString('zh-CN')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}