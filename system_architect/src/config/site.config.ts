/**
 * 站点配置系统
 * 集中管理所有可配置的站点信息
 */

// 站点基础信息
export const siteConfig = {
  // 基础URL配置
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  
  // 站点身份信息
  name: process.env.NEXT_PUBLIC_SITE_NAME || '软件架构师学习平台',
  shortName: process.env.NEXT_PUBLIC_SITE_SHORT_NAME || '架构师',
  tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE || '专业的软件架构设计学习',
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || '专注软件架构师核心能力培养，深度覆盖架构设计理论与实践，提供基础讲义、精编教材、速记卡片、冲刺宝典四种学习材料',
  
  // SEO关键词
  keywords: [
    '软件架构师', 
    '软件架构设计', 
    'ABSD', 
    '架构风格', 
    '架构评估', 
    '软件质量属性', 
    '架构模式'
  ] as const,
  
  // 团队和版权信息
  creator: process.env.NEXT_PUBLIC_SITE_CREATOR || '软件架构师学习平台',
  publisher: process.env.NEXT_PUBLIC_SITE_PUBLISHER || '软件架构师学习平台',
  team: process.env.NEXT_PUBLIC_SITE_TEAM || '软件架构师学习平台团队',
  copyright: process.env.NEXT_PUBLIC_SITE_COPYRIGHT || '软考学习平台',
  
  // 联系信息
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@ruankao-platform.com',
    wechat: process.env.NEXT_PUBLIC_CONTACT_WECHAT || '软考学习平台官方',
    website: process.env.NEXT_PUBLIC_CONTACT_WEBSITE || 'https://ruankao-platform.com',
  },
  
  // Social/Open Graph 配置
  openGraph: {
    siteName: process.env.NEXT_PUBLIC_OG_SITE_NAME || '软件架构师学习平台',
    title: process.env.NEXT_PUBLIC_OG_TITLE || '软件架构师学习平台 - 专业的软件架构设计学习',
    description: process.env.NEXT_PUBLIC_OG_DESCRIPTION || '专注软件架构师核心能力培养，深度覆盖架构设计理论与实践',
    image: {
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: process.env.NEXT_PUBLIC_OG_IMAGE_ALT || '软件架构师学习平台',
    }
  },
  
  // Twitter配置
  twitter: {
    title: process.env.NEXT_PUBLIC_TWITTER_TITLE || '软件架构师学习平台',
    description: process.env.NEXT_PUBLIC_TWITTER_DESCRIPTION || '专注软件架构师核心能力培养，深度覆盖架构设计理论与实践',
  }
} as const;

// 辅助函数：获取完整的页面标题
export function getPageTitle(pageTitle?: string): string {
  if (!pageTitle) {
    return siteConfig.name + ' - ' + siteConfig.tagline;
  }
  return `${pageTitle} | ${siteConfig.name}`;
}

// 辅助函数：获取完整URL
export function getFullUrl(path: string = ''): string {
  const baseUrl = siteConfig.url.endsWith('/') 
    ? siteConfig.url.slice(0, -1) 
    : siteConfig.url;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return baseUrl + cleanPath;
}

// 辅助函数：获取当前年份
export function getCurrentYear(): number {
  return new Date().getFullYear();
}