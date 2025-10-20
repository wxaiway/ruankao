/**
 * Navigation 组件
 * 设计原则：可访问性、响应式、可扩展性
 */

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NavigationProps, NavigationItem } from '@/types/ui';

// 面包屑导航组件
export const Breadcrumb: React.FC<{
  items: Array<{ label: string; href?: string }>;
  className?: string;
}> = ({ items, className }) => (
  <nav className={cn('flex', className)} aria-label="面包屑导航">
    <ol className="inline-flex items-center space-x-1 md:space-x-3">
      {items.map((item, index) => (
        <li key={index} className="inline-flex items-center">
          {index > 0 && (
            <svg
              className="w-3 h-3 text-gray-400 mx-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ) : (
            <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
              {item.label}
            </span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

// 目录组件
export const TableOfContents: React.FC<{
  headings: Array<{ id: string; text: string; level: number; slug: string }>;
  className?: string;
}> = ({ headings, className }) => {
  const [activeId, setActiveId] = React.useState<string>('');

  // 监听滚动位置，高亮当前章节
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -66%' }
    );

    headings.forEach(({ slug }) => {
      const element = document.getElementById(slug);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (slug: string) => {
    const element = document.getElementById(slug);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={cn('sticky top-20', className)}>
      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
        目录
      </h4>
      <ul className="space-y-2 text-sm">
        {headings.map(({ id, text, level, slug }) => (
          <li key={id}>
            <button
              onClick={() => handleClick(slug)}
              className={cn(
                'block w-full text-left transition-colors duration-200',
                'hover:text-primary-600 dark:hover:text-primary-400',
                activeId === slug
                  ? 'text-primary-600 dark:text-primary-400 font-medium'
                  : 'text-gray-600 dark:text-gray-400',
                // 根据标题级别设置缩进
                level === 2 && 'pl-0',
                level === 3 && 'pl-4',
                level === 4 && 'pl-8',
                level >= 5 && 'pl-12'
              )}
            >
              {text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// 章节导航组件（上一章/下一章）
export const ChapterNavigation: React.FC<{
  prevChapter?: { title: string; href: string };
  nextChapter?: { title: string; href: string };
  className?: string;
}> = ({ prevChapter, nextChapter, className }) => (
  <nav className={cn('flex justify-between items-center pt-8 mt-12 border-t border-gray-200 dark:border-gray-700', className)}>
    {prevChapter ? (
      <Link
        href={prevChapter.href}
        className="flex items-center text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200 transition-colors group"
      >
        <svg
          className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">上一章</div>
          <div className="font-medium">{prevChapter.title}</div>
        </div>
      </Link>
    ) : (
      <div />
    )}

    {nextChapter && (
      <Link
        href={nextChapter.href}
        className="flex items-center text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200 transition-colors group text-right"
      >
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">下一章</div>
          <div className="font-medium">{nextChapter.title}</div>
        </div>
        <svg
          className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    )}
  </nav>
);

// 主导航组件
export const Navigation: React.FC<NavigationProps> = ({
  items,
  variant = 'horizontal',
  collapsible = false,
  className,
}) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const NavigationItem: React.FC<{ item: NavigationItem; level?: number }> = ({ 
    item, 
    level = 0 
  }) => (
    <li>
      <Link
        href={item.href}
        className={cn(
          'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
          isActive(item.href)
            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
          level > 0 && 'ml-4'
        )}
      >
        {item.icon && <span className="mr-3">{item.icon}</span>}
        {item.label}
      </Link>
      
      {/* 子菜单 */}
      {item.children && item.children.length > 0 && (
        <ul className="mt-2 space-y-1">
          {item.children.map((child) => (
            <NavigationItem key={child.id} item={child} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );

  if (variant === 'breadcrumb') {
    const breadcrumbItems = items.map(item => ({
      label: item.label,
      href: item.href,
    }));
    return <Breadcrumb items={breadcrumbItems} className={className} />;
  }

  return (
    <nav className={cn('space-y-1', className)}>
      {collapsible && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-between p-2 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          导航菜单
          <svg
            className={cn('w-4 h-4 transition-transform', isCollapsed && 'rotate-180')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
      
      <ul className={cn('space-y-1', collapsible && isCollapsed && 'hidden')}>
        {items.map((item) => (
          <NavigationItem key={item.id} item={item} />
        ))}
      </ul>
    </nav>
  );
};