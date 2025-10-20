import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, BookOpen, Clock, GraduationCap, Users } from 'lucide-react';
import { getTextbooks } from '@/lib/content';
import { getContainerClasses, getPaddingClasses } from '@/lib/layout-config';

export const metadata: Metadata = {
  title: '精品教材 - 软件架构师学习平台',
  description: '系统化的专业教材，深度学习架构设计理论与实践',
};

export default async function TextbooksPage() {
  const textbooks = await getTextbooks();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className={`${getContainerClasses('main')} ${getPaddingClasses('horizontal')} py-6`}>
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回首页
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                  <GraduationCap className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    精品教材
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    系统化的专业教材，深度学习架构设计理论与实践
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`${getContainerClasses('main')} ${getPaddingClasses('horizontal')} py-8`}>
        {textbooks.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {textbooks.map((textbook) => (
              <Card key={textbook.id} className="p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-start gap-6 mb-6">
                  <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                    <BookOpen className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {textbook.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {textbook.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                      {textbook.metadata.estimatedHours && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{textbook.metadata.estimatedHours}小时课程</span>
                        </div>
                      )}
                      {textbook.metadata.totalChapters && (
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{textbook.metadata.totalChapters}个章节</span>
                        </div>
                      )}
                      {textbook.metadata.difficulty && (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{textbook.metadata.difficulty}</span>
                        </div>
                      )}
                    </div>

                    {textbook.metadata.tags && textbook.metadata.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {textbook.metadata.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-end">
                  <Button className="px-6" asChild>
                    <Link href={textbook.path}>
                      开始学习
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-50" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              教材内容即将上线
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              精品教材正在制作中，敬请期待。
            </p>
            <Button variant="outline" asChild>
              <Link href="/">
                返回首页
              </Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}