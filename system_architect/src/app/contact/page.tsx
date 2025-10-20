/**
 * 联系我们页面
 */

import { Metadata } from 'next';
import { getContainerClasses, getPaddingClasses } from '@/lib/layout-config';
import { Card } from '@/components/ui/Card';
import { Mail, MessageSquare, Clock, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: '联系我们 - 软件架构师学习平台',
  description: '联系软件架构师学习平台，获取技术支持和意见反馈渠道',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className={`${getPaddingClasses('horizontal')} py-8`}>
        <div className={getContainerClasses('main')}>
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">联系我们</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              我们重视每一位用户的意见和建议。如有任何问题或建议，请通过以下方式联系我们。
            </p>
          </div>

          {/* 联系方式 */}
          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <h2 className="text-2xl font-semibold mb-8 text-center">联系方式</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-medium mb-2">邮箱联系</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      发送邮件至我们的官方邮箱，我们将在24小时内回复您。
                    </p>
                    <a 
                      href="mailto:support@softarch-learn.com" 
                      className="text-blue-600 hover:underline font-medium"
                    >
                      support@softarch-learn.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MessageSquare className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-medium mb-2">GitHub Issues</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      在GitHub上提交问题反馈和功能建议。
                    </p>
                    <a 
                      href="https://github.com/softarch-learn/platform/issues" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      提交Issue
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-medium mb-2">响应时间</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      邮件回复：24小时内<br />
                      GitHub Issues：48小时内
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <HelpCircle className="w-6 h-6 text-orange-600 mt-1" />
                  <div>
                    <h3 className="font-medium mb-2">获取帮助</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      查看使用指南和常见问题解答。
                    </p>
                    <div className="flex gap-2">
                      <a 
                        href="/help" 
                        className="text-blue-600 hover:underline text-sm"
                      >
                        使用指南
                      </a>
                      <span className="text-gray-400">•</span>
                      <a 
                        href="/faq" 
                        className="text-blue-600 hover:underline text-sm"
                      >
                        常见问题
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* 反馈指南 */}
              <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-medium mb-3 text-blue-900 dark:text-blue-100">💡 反馈指南</h3>
                <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
                  <p><strong>Bug反馈：</strong>请详细描述问题现象、重现步骤和您的浏览器信息</p>
                  <p><strong>功能建议：</strong>请说明您希望的功能和使用场景</p>
                  <p><strong>内容问题：</strong>请指出具体的页面和错误内容</p>
                </div>
              </div>
            </Card>
          </div>

          {/* 更新信息 */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              最后更新时间：{new Date().toLocaleDateString('zh-CN')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}