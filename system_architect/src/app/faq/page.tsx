/**
 * 常见问题页面
 */

import { Metadata } from 'next';
import { getContainerClasses, getPaddingClasses } from '@/lib/layout-config';
import { Card } from '@/components/ui/Card';
import { HelpCircle, BookOpen, Target, FileText, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: '常见问题 - 软件架构师学习平台',
  description: '软件架构师学习平台常见问题解答，帮助您快速解决使用中遇到的问题',
};

export default function FAQPage() {
  const faqCategories = [
    {
      title: '平台使用',
      icon: <HelpCircle className="w-5 h-5" />,
      questions: [
        {
          question: '如何注册和登录账户？',
          answer: '目前平台暂不需要注册，所有学习资源都可以直接访问。后续版本将支持账户注册以保存学习进度。'
        },
        {
          question: '平台支持哪些浏览器？',
          answer: '建议使用 Chrome、Firefox、Safari 或 Edge 浏览器的最新版本以获得最佳体验。'
        },
        {
          question: '移动端是否可以正常使用？',
          answer: '是的，平台采用响应式设计，支持手机和平板电脑访问。'
        }
      ]
    },
    {
      title: '练习题库',
      icon: <Target className="w-5 h-5" />,
      questions: [
        {
          question: '如何查看题目答案和解析？',
          answer: '选择答案后点击"提交答案"按钮，即可查看正确答案和详细解析。'
        },
        {
          question: '可以重复练习同一道题吗？',
          answer: '可以的，您可以随时返回已做过的题目重新练习。'
        },
        {
          question: '题目来源是什么？',
          answer: '题目主要来源于历年软件架构设计师考试真题和经典练习题，确保质量和权威性。'
        }
      ]
    },
    {
      title: '案例分析',
      icon: <FileText className="w-5 h-5" />,
      questions: [
        {
          question: '案例分析如何使用？',
          answer: '浏览案例题目和要求，思考后查看标准答案和详细解析，学习分析方法和解题思路。'
        },
        {
          question: '案例难度如何分级？',
          answer: '案例按基础、中等、困难三个级别分类，建议按顺序逐步提升。'
        }
      ]
    },
    {
      title: '学习建议',
      icon: <BookOpen className="w-5 h-5" />,
      questions: [
        {
          question: '零基础如何开始学习？',
          answer: '建议按照：学习资料 → 章节练习 → 案例分析 → 历年真题 → 论文指导 的顺序进行系统学习。'
        },
        {
          question: '如何制定学习计划？',
          answer: '根据考试时间安排，建议每天学习2-3小时，重点掌握架构设计理论和实践方法。'
        },
        {
          question: '考前如何冲刺复习？',
          answer: '考前1个月重点做历年真题，熟悉考试题型；考前1周复习重点知识点和错题。'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className={`${getPaddingClasses('horizontal')} py-8`}>
        <div className={getContainerClasses('main')}>
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">常见问题</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              这里整理了用户最常遇到的问题和解答。如果您的问题不在此列表中，请联系我们。
            </p>
          </div>

          {/* FAQ 内容 */}
          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                    {category.icon}
                  </div>
                  <h2 className="text-2xl font-semibold">{category.title}</h2>
                </div>

                <div className="space-y-6">
                  {category.questions.map((item, questionIndex) => (
                    <div key={questionIndex}>
                      <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">
                        Q: {item.question}
                      </h3>
                      <div className="pl-4 border-l-4 border-blue-200 dark:border-blue-800">
                        <p className="text-gray-600 dark:text-gray-300">
                          A: {item.answer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* 联系支持 */}
          <Card className="p-8 mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div className="text-center">
              <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">没有找到您需要的答案？</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                我们的支持团队随时为您提供帮助
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  联系我们
                </a>
                <a
                  href="/help"
                  className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  使用指南
                </a>
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