/**
 * Footer 组件
 * 设计原则：简洁、信息完整、响应式
 */

import React from 'react';
import Link from 'next/link';
import { getContainerClasses, getPaddingClasses } from '@/lib/layout-config';
import { siteConfig, getCurrentYear } from '@/config/site.config';

const footerLinks = {
  核心功能: [
    { name: '案例分析', href: '/case-analysis' },
    { name: '论文指导', href: '/essay-guidance' },
    { name: '练习题库', href: '/practice' },
    { name: '学习资料', href: '/textbooks' },
  ],
  帮助中心: [
    { name: '平台介绍', href: '/about' },
    { name: '使用指南', href: '/help' },
    { name: '联系我们', href: '/contact' },
    { name: '常见问题', href: '/faq' },
  ],
  更多信息: [
    { name: '隐私政策', href: '/privacy' },
    { name: '使用条款', href: '/terms' },
    { name: '版权声明', href: '/copyright' },
  ],
};

const socialLinks = [
  {
    name: 'GitHub',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
  {
    name: '微信公众号',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.162 4.203 2.992 5.539-.208.831-.867 2.891-.867 2.891s3.013-.315 3.672-.927c.66.104 1.359.157 2.094.157 4.8 0 8.691-3.288 8.691-7.342C16.582 5.476 13.491 2.188 8.691 2.188zM6.78 7.38c.7 0 1.265.566 1.265 1.265s-.566 1.265-1.265 1.265S5.515 9.344 5.515 8.645 6.081 7.38 6.78 7.38zm3.822 0c.7 0 1.265.566 1.265 1.265s-.566 1.265-1.265 1.265-1.265-.566-1.265-1.265.566-1.265 1.265-1.265z"/>
        <path d="M24 14.966c0-3.259-2.892-5.907-6.456-5.907-3.564 0-6.456 2.648-6.456 5.907 0 3.259 2.892 5.907 6.456 5.907.522 0 1.025-.043 1.506-.125.553.487 2.447.801 2.447.801s-.553-1.357-.727-1.904C23.447 18.477 24 16.774 24 14.966zM15.171 14.22c-.553 0-1.001-.448-1.001-1.001s.448-1.001 1.001-1.001 1.001.448 1.001 1.001-.448 1.001-1.001 1.001zm3.375 0c-.553 0-1.001-.448-1.001-1.001s.448-1.001 1.001-1.001 1.001.448 1.001 1.001-.448 1.001-1.001 1.001z"/>
      </svg>
    ),
  },
];

export const Footer: React.FC = () => {
  const currentYear = getCurrentYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className={`${getContainerClasses('main')} ${getPaddingClasses('horizontal')} py-12`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 品牌信息 */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white font-bold text-lg">
                软
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                {siteConfig.copyright}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              专业的软考学习资源平台，提供高质量的学习资料和练习题库，助力软考通关。
            </p>
            
            {/* 社交链接 */}
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* 链接分组 */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 底部信息 */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © {currentYear} {siteConfig.copyright}. 保留所有权利。
            </p>
            
            {/* 备案信息和其他法律信息 */}
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-gray-400 text-xs">
                ICP备案号：待申请
              </span>
              <span className="text-gray-400 text-xs">
                版本 v1.0.0
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};