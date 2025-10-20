/**
 * 关于我们页面
 */

import React from 'react';
import { Metadata } from 'next';
import { Card } from '@/components/ui/Card';
import { Breadcrumb } from '@/components/ui/Navigation';
import { getContainerClasses, getPaddingClasses } from '@/lib/layout-config';
import { siteConfig } from '@/config/site.config';

export const metadata: Metadata = {
  title: '关于我们',
  description: '了解软考学习平台的愿景、使命和团队',
};

export default function AboutPage() {
  const breadcrumbItems = [
    { label: '首页', href: '/' },
    { label: '关于我们' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className={`${getContainerClasses('main')} ${getPaddingClasses('horizontal')} py-8`}>
        <Breadcrumb items={breadcrumbItems} className="mb-8" />

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              关于软考学习平台
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              致力于提供最优质的软考学习资源和体验
            </p>
          </div>

          <div className="grid gap-8 mb-12">
            <Card className="p-8">
              <Card.Header>
                <Card.Title className="text-2xl mb-4">我们的愿景</Card.Title>
              </Card.Header>
              <Card.Content>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  成为最专业、最受信赖的软考学习平台，帮助每一位学习者高效掌握软考知识，
                  顺利通过考试，提升专业技能和职业竞争力。
                </p>
              </Card.Content>
            </Card>

            <Card className="p-8">
              <Card.Header>
                <Card.Title className="text-2xl mb-4">我们的使命</Card.Title>
              </Card.Header>
              <Card.Content>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  通过系统化的内容组织、科学的学习方法和优质的用户体验，
                  让软考学习变得更加高效和轻松。我们相信优质的教育资源应该惠及每一个人。
                </p>
              </Card.Content>
            </Card>

            <Card className="p-8">
              <Card.Header>
                <Card.Title className="text-2xl mb-4">核心价值观</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">
                      🎯 专业专注
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      专注于软考领域，深入研究考试要求和最佳实践
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">
                      📚 内容为王
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      坚持提供高质量、准确性和实用性的学习内容
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">
                      👥 用户至上
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      以用户需求为中心，持续优化学习体验
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">
                      🚀 持续创新
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      拥抱新技术，不断改进和创新学习方法
                    </p>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>

          <div className="text-center">
            <Card className="p-8 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
              <Card.Content>
                <h2 className="text-2xl font-bold text-primary-900 dark:text-primary-100 mb-4">
                  联系我们
                </h2>
                <p className="text-primary-800 dark:text-primary-200 mb-4">
                  如果您有任何问题、建议或合作意向，欢迎随时联系我们。
                </p>
                <div className="space-y-2 text-sm text-primary-700 dark:text-primary-300">
                  <p>📧 邮箱：{siteConfig.contact.email}</p>
                  <p>💬 微信：{siteConfig.contact.wechat}</p>
                  <p>🌐 网站：{siteConfig.contact.website}</p>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}