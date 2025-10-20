/**
 * 版权声明页面
 */

import { Metadata } from 'next';
import { getContainerClasses, getPaddingClasses } from '@/lib/layout-config';
import { Card } from '@/components/ui/Card';
import { Copyright, Shield, FileText, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: '版权声明 - 软件架构师学习平台',
  description: '软件架构师学习平台版权声明，了解平台内容的版权信息和使用规则',
};

export default function CopyrightPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className={`${getPaddingClasses('horizontal')} py-8`}>
        <div className={getContainerClasses('main')}>
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <Copyright className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">版权声明</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              本页面详细说明软件架构师学习平台的版权信息和知识产权保护政策。
            </p>
            <p className="text-sm text-gray-500 mt-4">
              最后更新时间：{new Date().toLocaleDateString('zh-CN')}
            </p>
          </div>

          <div className="space-y-8">
            {/* 平台版权 */}
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-semibold">平台版权声明</h2>
              </div>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    © {new Date().getFullYear()} 软件架构师学习平台. 保留所有权利。
                  </p>
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-6">平台原创内容：</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>网站设计、布局和用户界面</li>
                  <li>原创的学习材料和教程</li>
                  <li>系统功能和交互逻辑</li>
                  <li>数据处理和分析算法</li>
                  <li>品牌标识和视觉元素</li>
                </ul>

                <p className="mt-4">
                  上述内容受中华人民共和国著作权法和国际版权法保护，
                  未经书面许可，任何个人或组织不得复制、修改、分发或用于商业用途。
                </p>
              </div>
            </Card>

            {/* 第三方内容 */}
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-semibold">第三方内容声明</h2>
              </div>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">考试相关内容：</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>历年真题来源于公开的考试资料</li>
                  <li>官方大纲和标准答案遵循相关考试机构的版权规定</li>
                  <li>教材内容引用符合合理使用原则</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-6">开源组件：</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>React.js - MIT License</li>
                  <li>Next.js - MIT License</li>
                  <li>Tailwind CSS - MIT License</li>
                  <li>Lucide React - ISC License</li>
                </ul>

                <p className="mt-4">
                  我们感谢开源社区的贡献，并严格遵守各开源许可证的要求。
                </p>
              </div>
            </Card>

            {/* 使用权限 */}
            <Card className="p-8">
              <h2 className="text-2xl font-semibold mb-6">内容使用权限</h2>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">个人学习使用：</h3>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <ul className="list-disc list-inside space-y-2 text-green-700 dark:text-green-300">
                    <li>允许个人浏览、学习和研究使用</li>
                    <li>可以保存内容供个人学习参考</li>
                    <li>允许在学习讨论中合理引用</li>
                  </ul>
                </div>

                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-6">禁止行为：</h3>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <ul className="list-disc list-inside space-y-2 text-red-700 dark:text-red-300">
                    <li>未经授权的商业使用</li>
                    <li>大规模复制或批量下载</li>
                    <li>二次分发或转售平台内容</li>
                    <li>去除版权标识或归属信息</li>
                    <li>反向工程或技术破解</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* 侵权处理 */}
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="w-6 h-6 text-orange-600" />
                <h2 className="text-2xl font-semibold">侵权举报与处理</h2>
              </div>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">如果您认为我们侵犯了您的版权：</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>请通过<a href="/contact" className="text-blue-600 hover:underline">联系我们</a>页面举报</li>
                  <li>提供详细的版权证明材料</li>
                  <li>说明侵权内容的具体位置</li>
                  <li>提供您的联系方式</li>
                </ul>

                <p className="mt-4">
                  我们将在收到有效举报后24小时内进行调查，
                  并在确认侵权后及时删除相关内容。
                </p>

                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-6">如果您发现他人侵犯了我们的版权：</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>我们感谢您的举报和支持</li>
                  <li>请提供侵权网站或内容的链接</li>
                  <li>我们将依法维护自己的合法权益</li>
                </ul>
              </div>
            </Card>

            {/* 免责条款 */}
            <Card className="p-8">
              <h2 className="text-2xl font-semibold mb-6">免责条款</h2>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    本平台力求确保所有内容的合法性和准确性，
                    但不保证内容的完全准确性或实时性
                  </li>
                  <li>
                    用户因使用平台内容产生的任何法律责任由用户自行承担
                  </li>
                  <li>
                    第三方链接的内容版权归原作者所有，
                    与本平台无关
                  </li>
                  <li>
                    本平台不承担因版权争议导致的任何损失或责任
                  </li>
                </ul>
              </div>
            </Card>

            {/* 法律适用 */}
            <Card className="p-8">
              <h2 className="text-2xl font-semibold mb-6">法律适用</h2>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  本版权声明受中华人民共和国著作权法、
                  计算机软件保护条例等相关法律法规管辖。
                </p>
                <p>
                  因版权问题产生的争议，
                  将由有管辖权的人民法院依法解决。
                </p>
              </div>
            </Card>

            {/* 联系信息 */}
            <Card className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">版权相关咨询</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  如有版权相关问题或需要获得使用授权，请联系我们。
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    联系我们
                  </a>
                  <a
                    href="/terms"
                    className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    使用条款
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}