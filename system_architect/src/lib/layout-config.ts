/**
 * 布局配置系统 - 方案A：经典固定宽度 + 两侧留白
 * 实现更保守的容器宽度，通过增加padding创建两侧预留空间
 */

// 响应式容器宽度配置
export const LAYOUT_CONFIG = {
  // 容器最大宽度（大幅收缩版本，创建大量两侧留白）
  maxWidth: {
    sm: 'max-w-xl',        // 小屏：576px（进一步收缩）
    md: 'max-w-2xl',       // 中屏：672px（进一步收缩）
    lg: 'max-w-3xl',       // 大屏：768px（进一步收缩）
    xl: 'max-w-4xl',       // 超大屏：896px（进一步收缩）
    '2xl': 'max-w-5xl'     // 超超大屏：1024px（进一步收缩）
  },
  
  // 智能留白系统
  padding: {
    // 水平留白（大幅增强版，创建宽松的阅读体验）
    horizontal: {
      sm: 'px-8',          // 小屏：32px（大幅增大）
      md: 'px-12',         // 中屏：48px（大幅增大）
      lg: 'px-16',         // 大屏：64px（大幅增大）
      xl: 'px-24',         // 超大屏：96px（大幅增大）
      '2xl': 'px-32'       // 超超大屏：128px（大幅增大）
    },
    // 垂直间距
    vertical: {
      section: {
        sm: 'py-8',        // 小屏：32px
        md: 'py-12',       // 中屏：48px
        lg: 'py-16',       // 大屏：64px
        xl: 'py-20',       // 超大屏：80px
        '2xl': 'py-24'     // 超超大屏：96px
      },
      content: {
        sm: 'py-4',
        md: 'py-6', 
        lg: 'py-8',
        xl: 'py-10',
        '2xl': 'py-12'
      }
    }
  },

  // 内容宽度限制（用于阅读体验优化）
  content: {
    // 文章阅读最优宽度
    reading: 'max-w-4xl',  // 保持不变，约65-75字符/行
    // 卡片布局最大宽度  
    cards: 'max-w-none',   // 允许充分利用空间
    // 表单和交互元素
    forms: 'max-w-2xl'
  }
} as const;

// 生成响应式容器类名
export function getContainerClasses(type: 'main' | 'wide' | 'full' = 'main'): string {
  const baseClasses = 'mx-auto';
  
  switch (type) {
    case 'wide':
      // 更宽的容器，用于需要更多空间的页面
      return `${baseClasses} max-w-full sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl`;
    case 'full':
      // 全宽容器
      return `${baseClasses} max-w-full`;
    case 'main':
    default:
      // 经典固定宽度 + 响应式padding - 创建大量两侧留白
      return `${baseClasses} max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl`;
  }
}

// 生成响应式留白类名
export function getPaddingClasses(type: 'horizontal' | 'vertical' | 'section' = 'horizontal'): string {
  switch (type) {
    case 'horizontal':
      // 大幅增加水平留白，创建宽松的阅读体验
      return 'px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40';
    case 'vertical':
      return 'py-4 sm:py-6 md:py-8 lg:py-8 xl:py-10 2xl:py-12';
    case 'section':
      // 保持合理的区块间距
      return 'py-8 sm:py-12 md:py-16 lg:py-20 xl:py-20 2xl:py-24';
    default:
      return '';
  }
}

// 视觉连续性增强
export const VISUAL_CONTINUITY = {
  // 阴影系统
  shadows: {
    subtle: 'shadow-sm',
    normal: 'shadow-md',
    elevated: 'shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50'
  },
  
  // 渐变系统
  gradients: {
    headerToContent: 'bg-gradient-to-b from-white via-gray-50/80 to-transparent dark:from-gray-900 dark:via-gray-900/80 dark:to-transparent',
    contentBorder: 'border-t border-gray-100 dark:border-gray-800'
  },
  
  // 圆角系统统一
  borderRadius: {
    card: 'rounded-xl',
    section: 'rounded-2xl',
    content: 'rounded-lg'
  }
} as const;