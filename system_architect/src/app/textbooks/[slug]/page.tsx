import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, BookOpen, Clock, GraduationCap } from 'lucide-react';
import { getTextbookBySlug } from '@/lib/content';
import { MarkdownViewer } from '@/components/ui/MarkdownViewer';
import { getContainerClasses, getPaddingClasses } from '@/lib/layout-config';

interface TextbookPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: TextbookPageProps): Promise<Metadata> {
  const textbook = await getTextbookBySlug(params.slug);
  
  if (!textbook) {
    return {
      title: '教材未找到',
      description: '请求的教材不存在'
    };
  }

  return {
    title: `${textbook.title} - 软件架构师学习平台`,
    description: textbook.description,
  };
}

export default async function TextbookPage({ params }: TextbookPageProps) {
  const textbook = await getTextbookBySlug(params.slug);

  if (!textbook) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className={`${getContainerClasses('main')} ${getPaddingClasses('horizontal')} py-6`}>
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/textbooks">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回教材列表
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
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {textbook.title}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    {textbook.description}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
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
                {textbook.metadata.author && (
                  <div className="flex items-center gap-1">
                    <span>作者：{textbook.metadata.author}</span>
                  </div>
                )}
                {textbook.metadata.version && (
                  <div className="flex items-center gap-1">
                    <span>{textbook.metadata.version}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800">
        <MarkdownViewer
          content={textbook.content}
          title={textbook.title}
          type="textbook"
        />
      </div>
    </div>
  );
}