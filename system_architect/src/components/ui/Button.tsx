/**
 * Button 组件
 * 设计原则：一致性、可访问性、可扩展性
 */

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ButtonProps } from '@/types/ui';

const buttonVariants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
  outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900/10',
  ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100',
  destructive: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500',
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  href,
  asChild = false,
  className,
  children,
  ...props
}) => {
  const baseClasses = cn(
    // 基础样式
    'inline-flex items-center justify-center font-medium rounded-lg',
    'transition-all duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    // 尺寸和变体
    buttonSizes[size],
    buttonVariants[variant],
    // 加载状态
    loading && 'cursor-wait',
    className
  );

  // 加载指示器
  const LoadingSpinner = () => (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // 如果使用 asChild，则渲染子元素并应用样式
  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement;
    return React.cloneElement(child, {
      className: cn(baseClasses, child.props?.className),
      ...props,
    });
  }

  // 如果是链接按钮
  if (href) {
    return (
      <Link href={href} className={baseClasses} {...props}>
        {loading && <LoadingSpinner />}
        {children}
      </Link>
    );
  }

  // 普通按钮
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={baseClasses}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {children}
    </button>
  );
};