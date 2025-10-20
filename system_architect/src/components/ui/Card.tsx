/**
 * Card 组件
 * 设计原则：模块化、响应式、一致性
 */

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { CardProps } from '@/types/ui';

const cardVariants = {
  default: 'bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700',
  outlined: 'bg-transparent border-2 border-gray-300 dark:border-gray-600',
  elevated: 'bg-white shadow-lg border-0 dark:bg-gray-800',
};

// 卡片子组件先声明
const CardHeader: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => (
  <div className={cn('px-6 py-4 border-b border-gray-200 dark:border-gray-700', className)}>
    {children}
  </div>
);

const CardContent: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => (
  <div className={cn('p-6', className)}>
    {children}
  </div>
);

const CardFooter: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => (
  <div className={cn('px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700', className)}>
    {children}
  </div>
);

const CardTitle: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => (
  <h3 className={cn('text-lg font-semibold text-gray-900 dark:text-gray-100', className)}>
    {children}
  </h3>
);

interface CardComponent extends React.FC<CardProps> {
  Header: typeof CardHeader;
  Content: typeof CardContent;
  Footer: typeof CardFooter;
  Title: typeof CardTitle;
}

export const Card: CardComponent = ({
  title,
  description,
  image,
  href,
  clickable = false,
  variant = 'default',
  className,
  children,
  ...props
}) => {
  const baseClasses = cn(
    // 基础样式
    'rounded-xl overflow-hidden transition-all duration-200 ease-in-out',
    // 变体样式
    cardVariants[variant],
    // 交互样式
    (clickable || href) && [
      'cursor-pointer',
      'hover:shadow-md hover:-translate-y-0.5',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    ],
    className
  );

  const renderCardContent = () => (
    <div className="flex flex-col h-full">
      {/* 图片 */}
      {image && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={image}
            alt={title || ''}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      
      {/* 内容区域 */}
      <div className="p-6 flex-1">
        {/* 标题 */}
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </h3>
        )}
        
        {/* 描述 */}
        {description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
            {description}
          </p>
        )}
        
        {/* 自定义内容 */}
        {children}
      </div>
    </div>
  );

  // 如果是链接卡片
  if (href) {
    return (
      <Link href={href} className={baseClasses} {...props}>
        {renderCardContent()}
      </Link>
    );
  }

  // 普通卡片
  return (
    <div className={baseClasses} {...props}>
      {renderCardContent()}
    </div>
  );
};

// 添加子组件到主组件
Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Title = CardTitle;