/**
 * UI 组件类型定义
 * 设计原则：通用性、可复用性、类型安全
 */

import { ReactNode } from 'react';

// 基础组件 Props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  id?: string;
  'data-testid'?: string;
}

// 按钮组件类型
export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  href?: string; // 支持作为链接使用
  asChild?: boolean; // 支持作为子组件包装器
  title?: string; // 支持 title 属性
}

// 卡片组件类型
export interface CardProps extends BaseComponentProps {
  title?: string;
  description?: string;
  image?: string;
  href?: string;
  clickable?: boolean;
  variant?: 'default' | 'outlined' | 'elevated';
}

// 导航组件类型
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: ReactNode;
  active?: boolean;
  children?: NavigationItem[];
}

export interface NavigationProps extends BaseComponentProps {
  items: NavigationItem[];
  variant?: 'horizontal' | 'vertical' | 'breadcrumb';
  collapsible?: boolean;
}

// 布局组件类型
export interface LayoutProps extends BaseComponentProps {
  sidebar?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

// 表格组件类型
export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => ReactNode;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
}

export interface TableProps<T = any> extends BaseComponentProps {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (record: T, index: number) => void;
}

// 模态框组件类型
export interface ModalProps extends BaseComponentProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closable?: boolean;
  maskClosable?: boolean;
  footer?: ReactNode;
}

// 表单组件类型
export interface FormFieldProps extends BaseComponentProps {
  label?: string;
  error?: string;
  required?: boolean;
  helpText?: string;
}

export interface InputProps extends FormFieldProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// 主题相关类型
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  borderRadius: number;
  fontFamily: string;
}

// 响应式类型
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ResponsiveValue<T> {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}

// 动画类型
export type AnimationType = 'fade' | 'slide' | 'scale' | 'bounce' | 'none';

export interface AnimationConfig {
  type: AnimationType;
  duration: number;
  delay?: number;
  easing?: string;
}

// Loading 状态类型
export interface LoadingState {
  loading: boolean;
  error?: string | null;
  data?: any;
}

// 通知组件类型
export interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  closable?: boolean;
  onClose?: () => void;
}

// 搜索组件类型
export interface SearchProps extends BaseComponentProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showSuggestions?: boolean;
  suggestions?: string[];
}

// 分页组件类型
export interface PaginationProps extends BaseComponentProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number, pageSize: number) => void;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean;
}

// 进度条组件类型
export interface ProgressProps extends BaseComponentProps {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  striped?: boolean;
  animated?: boolean;
}

// 徽章组件类型
export interface BadgeProps extends BaseComponentProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  count?: number;
  maxCount?: number;
}