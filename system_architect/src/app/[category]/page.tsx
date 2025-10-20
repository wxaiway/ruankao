import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, BookOpen, Clock, Users } from 'lucide-react';
import { getCategoryBySlug } from '@/lib/content';
import { parseYearFromPath } from '@/config/years';
import { getContainerClasses, getPaddingClasses } from '@/lib/layout-config';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  // Extract year from middleware headers
  const headersList = headers();
  const year = headersList.get('x-current-year') ? parseInt(headersList.get('x-current-year')!) : undefined;
  const category = await getCategoryBySlug(params.category, year);
  
  if (!category) {
    return {
      title: '分类未找到',
      description: '请求的学习分类不存在'
    };
  }

  const yearSuffix = category.year && category.year !== 2025 ? ` (${category.year}年版)` : '';
  return {
    title: `${category.name}${yearSuffix} - 软件架构师学习平台`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Extract year from middleware headers
  const headersList = headers();
  const year = headersList.get('x-current-year') ? parseInt(headersList.get('x-current-year')!) : undefined;
  const category = await getCategoryBySlug(params.category, year);

  if (!category) {
    notFound();
  }

  const totalMaterials = category.chapters.reduce(
    (sum: number, chapter: any) => sum + chapter.materials.length, 
    0
  );

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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {category.name}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                {category.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{category.chapters.length} 章节</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{totalMaterials} 学习材料</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`${getContainerClasses('main')} ${getPaddingClasses('horizontal')} py-8`}>
        {category.chapters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.chapters.map((chapter: any) => (
              <Card key={chapter.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {chapter.title}
                  </h3>
                </div>
                
                {chapter.description && (
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {chapter.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{chapter.materials.length} 材料</span>
                    </div>
                    {chapter.metadata.estimatedMinutes && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{chapter.metadata.estimatedMinutes} 分钟</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Material Types Preview */}
                {chapter.materials.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {chapter.materials.slice(0, 3).map((material: any) => (
                        <span 
                          key={material.id}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
                        >
                          {material.type.name}
                        </span>
                      ))}
                      {chapter.materials.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                          +{chapter.materials.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <Button className="w-full" asChild>
                  <Link href={chapter.path}>
                    开始学习
                  </Link>
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              章节内容即将上线
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              该分类的学习内容正在制作中，敬请期待。
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