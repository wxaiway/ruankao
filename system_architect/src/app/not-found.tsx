/**
 * 404 页面
 */

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { getContainerClasses, getPaddingClasses } from '@/lib/layout-config';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className={`max-w-md mx-auto text-center ${getPaddingClasses('horizontal')}`}>
        <div className="mb-8">
          <div className="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-4">
            404
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            页面未找到
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            抱歉，您访问的页面不存在或已被移动。
          </p>
        </div>

        <div className="space-y-4">
          <Button asChild size="lg" className="w-full">
            <Link href="/">
              返回首页
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/architecture">
              浏览学习内容
            </Link>
          </Button>
        </div>

        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>如果您认为这是一个错误，请联系我们的技术支持。</p>
        </div>
      </div>
    </div>
  );
}