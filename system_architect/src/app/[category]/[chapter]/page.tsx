import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { getChapterByPath, getCategoryBySlug } from '@/lib/content';
import { parseYearFromPath } from '@/config/years';
import { UniversalViewer } from '@/components/content/UniversalViewer';
import { ChapterHeader } from '@/components/content/ChapterHeader';
import { EnhancedBreadcrumb } from '@/components/content/EnhancedBreadcrumb';
import { getContainerClasses, getPaddingClasses } from '@/lib/layout-config';

interface ChapterPageProps {
  params: {
    category: string;
    chapter: string;
  };
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  // Extract year from middleware headers
  const headersList = headers();
  const year = headersList.get('x-current-year') ? parseInt(headersList.get('x-current-year')!) : undefined;
  const chapter = await getChapterByPath(params.category, params.chapter, year);
  const category = await getCategoryBySlug(params.category, year);
  
  if (!chapter || !category) {
    return {
      title: '章节未找到',
      description: '请求的学习章节不存在'
    };
  }

  const yearSuffix = category.year && category.year !== 2025 ? ` (${category.year}年版)` : '';
  return {
    title: `${chapter.title} - ${category.name}${yearSuffix} - 软件架构师学习平台`,
    description: chapter.description || `学习 ${chapter.title} 的相关内容`,
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  // Extract year from middleware headers
  const headersList = headers();
  const year = headersList.get('x-current-year') ? parseInt(headersList.get('x-current-year')!) : undefined;
  const chapter = await getChapterByPath(params.category, params.chapter, year);
  const category = await getCategoryBySlug(params.category, year);

  if (!chapter || !category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Enhanced Breadcrumb Navigation */}
      <EnhancedBreadcrumb 
        category={category}
        chapter={chapter}
      />
      
      {/* Chapter Header */}
      <ChapterHeader 
        category={category}
        chapter={chapter}
      />

      {/* Content */}
      <div className={`w-full ${getPaddingClasses('horizontal')} py-8`}>
        {chapter.materials.length > 0 ? (
          <div className="w-full">
            <ErrorBoundary>
              <Suspense fallback={<LoadingSpinner text="加载学习材料..." />}>
                <UniversalViewer 
                  materials={chapter.materials}
                  categorySlug={params.category}
                  chapterSlug={params.chapter}
                />
              </Suspense>
            </ErrorBoundary>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                学习材料即将上线
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                该章节的学习材料正在制作中，敬请期待。
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}