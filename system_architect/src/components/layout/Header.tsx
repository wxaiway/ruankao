/**
 * Header 组件
 * 设计原则：响应式、可访问性、品牌一致性
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { YearSwitcher } from '@/components/ui/YearSwitcher';
import { ExamCountdown } from '@/components/ui/ExamCountdown';
import { parseYearFromPath } from '@/config/years';
import { siteConfig } from '@/config/site.config';
import { getContainerClasses, getPaddingClasses } from '@/lib/layout-config';

// 主题切换按钮组件
const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = React.useState(false);

  // 避免水合不一致
  React.useEffect(() => {
    setMounted(true);
    
    // 读取本地存储的主题设置
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    
    // 应用主题
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!mounted) {
    return (
      <button className="p-2 rounded-lg opacity-50 cursor-not-allowed">
        <div className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label={`切换到${theme === 'light' ? '深色' : '浅色'}模式`}
    >
      {theme === 'light' ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </button>
  );
};

// 移动端菜单按钮
const MobileMenuButton: React.FC<{
  isOpen: boolean;
  onClick: () => void;
}> = ({ isOpen, onClick }) => (
  <button
    onClick={onClick}
    className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    aria-label="切换菜单"
  >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {isOpen ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      )}
    </svg>
  </button>
);

// 导航菜单项
const navigationItems: { href: string; label: string }[] = [
  // 移除无用的首页链接
  // { href: '/', label: '首页' },
];

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  // Extract current year from pathname
  const { year: currentYear } = parseYearFromPath(pathname);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <div className={`${getContainerClasses('main')} ${getPaddingClasses('horizontal')}`}>
        <div className="flex h-16 items-center justify-between">
          {/* Logo 和品牌名 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white font-bold text-lg">
                架
              </div>
              <span className="hidden sm:inline-block font-bold text-xl text-gray-900 dark:text-gray-100">
                {siteConfig.name}
              </span>
              <span className="sm:hidden font-bold text-lg text-gray-900 dark:text-gray-100">
                {siteConfig.shortName}
              </span>
            </Link>
          </div>

          {/* 桌面端导航 - 替换为考试倒计时 */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary-600 dark:hover:text-primary-400',
                  isActive(item.href)
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-300'
                )}
              >
                {item.label}
              </Link>
            ))}
            
            {/* 考试倒计时 */}
            <ExamCountdown className="ml-4" />
          </nav>

          {/* 右侧操作区 */}
          <div className="flex items-center space-x-2">
            {/* 年份切换器 - 桌面端 */}
            <div className="hidden lg:block">
              <YearSwitcher currentYear={currentYear} className="mr-2" />
            </div>
            
            <ThemeToggle />
            <MobileMenuButton
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
            
            {/* 未来功能预留 */}
            {/* <Button variant="outline" size="sm" className="hidden sm:inline-flex">
              登录
            </Button> */}
          </div>
        </div>

        {/* 移动端菜单 */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 py-4">
            {/* 年份切换器 - 移动端 */}
            <div className="px-3 pb-4 border-b border-gray-200 dark:border-gray-700 mb-4">
              <YearSwitcher currentYear={currentYear} />
            </div>
            
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 text-base font-medium rounded-lg transition-colors',
                    isActive(item.href)
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* 移动端考试倒计时 */}
              <div className="px-3 py-2 mt-4 border-t border-gray-200 dark:border-gray-700">
                <ExamCountdown />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};