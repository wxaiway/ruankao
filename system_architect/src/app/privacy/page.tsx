/**
 * 隐私政策页面
 */

import { Metadata } from 'next';
import { getContainerClasses, getPaddingClasses } from '@/lib/layout-config';
import { Card } from '@/components/ui/Card';
import { Shield, Eye, Lock, UserCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: '隐私政策 - 软件架构师学习平台',
  description: '软件架构师学习平台隐私政策，了解我们如何收集、使用和保护您的个人信息',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className={`${getPaddingClasses('horizontal')} py-8`}>
        <div className={getContainerClasses('main')}>
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">隐私政策</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              我们重视并保护用户的隐私权。本政策说明我们如何收集、使用、储存和保护您的个人信息。
            </p>
            <p className="text-sm text-gray-500 mt-4">
              最后更新时间：{new Date().toLocaleDateString('zh-CN')}
            </p>
          </div>

          <div className="space-y-8">
            {/* 信息收集 */}
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Eye className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-semibold">信息收集</h2>
              </div>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">我们收集的信息</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>访问信息：包括IP地址、浏览器类型、访问时间等技术信息</li>
                  <li>使用数据：您在平台上的学习行为和偏好</li>
                  <li>反馈信息：您主动提供的意见反馈和联系信息</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-6">信息收集方式</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>网站访问时的自动收集</li>
                  <li>用户主动提交的表单信息</li>
                  <li>Cookies和类似技术</li>
                </ul>
              </div>
            </Card>

            {/* 信息使用 */}
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <UserCheck className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-semibold">信息使用</h2>
              </div>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">使用目的</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>提供和改善我们的服务</li>
                  <li>分析网站使用情况，优化用户体验</li>
                  <li>回应用户询问和提供技术支持</li>
                  <li>发送重要的服务通知</li>
                  <li>防范欺诈和滥用行为</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-6">数据处理原则</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>最小化原则：只收集必要的信息</li>
                  <li>目的限制：仅用于明确告知的目的</li>
                  <li>数据准确性：确保信息准确和及时更新</li>
                  <li>存储限制：不超过必要的保存期限</li>
                </ul>
              </div>
            </Card>

            {/* 信息保护 */}
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-semibold">信息保护</h2>
              </div>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">安全措施</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>使用HTTPS加密传输保护数据安全</li>
                  <li>定期进行安全评估和更新</li>
                  <li>限制员工访问个人信息的权限</li>
                  <li>建立数据泄露应急响应机制</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-6">数据共享</h3>
                <p>我们承诺：</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>不会出售您的个人信息</li>
                  <li>不会向第三方披露您的个人信息，除非获得您的明确同意</li>
                  <li>仅在法律要求的情况下配合执法部门</li>
                </ul>
              </div>
            </Card>

            {/* 用户权利 */}
            <Card className="p-8">
              <h2 className="text-2xl font-semibold mb-6">您的权利</h2>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>访问权：</strong>您有权了解我们收集了您的哪些个人信息</li>
                  <li><strong>更正权：</strong>您有权要求更正不准确的个人信息</li>
                  <li><strong>删除权：</strong>在特定情况下，您有权要求删除您的个人信息</li>
                  <li><strong>反对权：</strong>您有权反对我们处理您的个人信息</li>
                </ul>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-blue-700 dark:text-blue-300">
                    如需行使上述权利，请通过 
                    <a href="/contact" className="underline ml-1">联系我们</a> 页面与我们取得联系。
                  </p>
                </div>
              </div>
            </Card>

            {/* Cookies政策 */}
            <Card className="p-8">
              <h2 className="text-2xl font-semibold mb-6">Cookies使用</h2>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>我们使用Cookies和类似技术来：</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>记住您的偏好设置</li>
                  <li>分析网站流量和使用模式</li>
                  <li>提供个性化的用户体验</li>
                </ul>

                <p className="mt-4">
                  您可以通过浏览器设置管理Cookies偏好，但这可能会影响网站的某些功能。
                </p>
              </div>
            </Card>

            {/* 政策更新 */}
            <Card className="p-8">
              <h2 className="text-2xl font-semibold mb-6">政策更新</h2>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  我们可能会不时更新本隐私政策。重大变更将在网站显著位置公告，
                  并在变更生效前给予用户充分的通知时间。
                </p>
                
                <p>
                  继续使用我们的服务即表示您同意更新后的隐私政策。
                </p>
              </div>
            </Card>

            {/* 联系信息 */}
            <Card className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">有隐私相关问题？</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  如果您对我们的隐私政策有任何疑问或建议，请随时联系我们。
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  联系我们
                </a>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}