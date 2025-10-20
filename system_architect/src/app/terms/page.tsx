/**
 * 使用条款页面
 */

import { Metadata } from 'next';
import { getContainerClasses, getPaddingClasses } from '@/lib/layout-config';
import { Card } from '@/components/ui/Card';
import { FileText, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: '使用条款 - 软件架构师学习平台',
  description: '软件架构师学习平台使用条款，了解使用本平台的权利和义务',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className={`${getPaddingClasses('horizontal')} py-8`}>
        <div className={getContainerClasses('main')}>
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">使用条款</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              欢迎使用软件架构师学习平台。使用本平台即表示您同意遵守以下条款和条件。
            </p>
            <p className="text-sm text-gray-500 mt-4">
              最后更新时间：{new Date().toLocaleDateString('zh-CN')}
            </p>
          </div>

          <div className="space-y-8">
            {/* 接受条款 */}
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-semibold">接受条款</h2>
              </div>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  通过访问和使用软件架构师学习平台（以下简称"本平台"），
                  您确认已阅读、理解并同意受本使用条款的约束。
                </p>
                <p>
                  如果您不同意这些条款，请不要使用本平台。
                </p>
              </div>
            </Card>

            {/* 服务描述 */}
            <Card className="p-8">
              <h2 className="text-2xl font-semibold mb-6">服务描述</h2>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">我们提供的服务包括：</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>软件架构设计师考试相关的学习资料</li>
                  <li>在线练习题库和历年真题</li>
                  <li>案例分析和论文写作指导</li>
                  <li>学习进度跟踪和统计分析</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-6">服务特点：</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>免费提供核心学习功能</li>
                  <li>无需注册即可使用大部分功能</li>
                  <li>持续更新和完善内容</li>
                </ul>
              </div>
            </Card>

            {/* 用户责任 */}
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
                <h2 className="text-2xl font-semibold">用户责任</h2>
              </div>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">您同意：</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>仅将本平台用于合法的学习目的</li>
                  <li>不传播病毒、恶意软件或有害内容</li>
                  <li>不进行任何可能损害平台功能的行为</li>
                  <li>尊重知识产权，不非法复制或分发内容</li>
                  <li>提供真实、准确的信息</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-6">禁止行为：</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>尝试未经授权访问系统或用户数据</li>
                  <li>使用自动化工具过度请求服务器资源</li>
                  <li>发布违法、有害或不当内容</li>
                  <li>冒充他人或提供虚假信息</li>
                </ul>
              </div>
            </Card>

            {/* 知识产权 */}
            <Card className="p-8">
              <h2 className="text-2xl font-semibold mb-6">知识产权</h2>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">平台内容：</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>本平台的所有内容，包括但不限于文本、图片、代码、设计等，均受版权保护</li>
                  <li>用户可以为个人学习目的使用这些内容</li>
                  <li>未经许可，不得用于商业用途或进行二次分发</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-6">第三方内容：</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>部分内容可能来源于第三方，我们尊重原作者的知识产权</li>
                  <li>如发现侵权内容，请及时联系我们处理</li>
                </ul>
              </div>
            </Card>

            {/* 免责声明 */}
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <XCircle className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-semibold">免责声明</h2>
              </div>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">服务提供：</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>本平台按"现状"提供服务，不保证服务的持续可用性</li>
                  <li>我们努力确保内容的准确性，但不承担内容错误导致的损失</li>
                  <li>技术故障、网络中断等情况可能影响服务使用</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-6">责任限制：</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>我们不对用户的学习结果或考试成绩承担责任</li>
                  <li>不承担因使用本平台而产生的任何直接或间接损失</li>
                  <li>第三方链接或内容的准确性和安全性由第三方负责</li>
                </ul>
              </div>
            </Card>

            {/* 服务变更 */}
            <Card className="p-8">
              <h2 className="text-2xl font-semibold mb-6">服务变更与终止</h2>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">服务变更：</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>我们保留随时修改、暂停或终止服务的权利</li>
                  <li>重大变更将提前通知用户</li>
                  <li>服务升级和维护期间可能出现短暂中断</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-6">账户终止：</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>违反使用条款的用户账户可能被暂停或终止</li>
                  <li>用户可以随时停止使用本平台</li>
                </ul>
              </div>
            </Card>

            {/* 法律适用 */}
            <Card className="p-8">
              <h2 className="text-2xl font-semibold mb-6">法律适用与争议解决</h2>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <ul className="list-disc list-inside space-y-2">
                  <li>本条款受中华人民共和国法律管辖</li>
                  <li>因使用本平台产生的争议，双方应首先友好协商解决</li>
                  <li>协商不成的，可提交有管辖权的人民法院解决</li>
                </ul>
              </div>
            </Card>

            {/* 条款修改 */}
            <Card className="p-8">
              <h2 className="text-2xl font-semibold mb-6">条款修改</h2>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  我们保留随时修改本使用条款的权利。修改后的条款将在网站上公布，
                  并自公布之日起生效。
                </p>
                <p>
                  继续使用本平台即表示您接受修改后的条款。
                  如不同意修改内容，请停止使用本平台。
                </p>
              </div>
            </Card>

            {/* 联系信息 */}
            <Card className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">对条款有疑问？</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  如果您对使用条款有任何疑问，请通过以下方式联系我们。
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