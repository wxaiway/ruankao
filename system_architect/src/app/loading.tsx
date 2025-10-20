/**
 * 全局加载页面
 */

import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400"></div>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          正在加载...
        </p>
      </div>
    </div>
  );
}