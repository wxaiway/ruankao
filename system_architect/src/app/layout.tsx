/**
 * 根布局组件
 * 提供全局样式、字体、元数据等基础设置
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemeScript } from '@/components/ThemeScript';
import './globals.css';
import { siteConfig, getFullUrl } from '@/config/site.config';

// 字体配置
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// 默认元数据配置
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    template: `%s | ${siteConfig.name}`,
    default: `${siteConfig.name} - ${siteConfig.tagline}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.team }],
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  
  // Open Graph 元数据
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: siteConfig.url,
    siteName: siteConfig.openGraph.siteName,
    title: siteConfig.openGraph.title,
    description: siteConfig.openGraph.description,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: siteConfig.openGraph.image.alt,
      },
    ],
  },
  
  // Twitter 卡片
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.twitter.title,
    description: siteConfig.twitter.description,
    images: ['/og-image.jpg'],
  },
  
  // 机器人指令
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// 视口配置（Next.js 14 新要求）
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* 预加载关键资源 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* 图标设置 */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* 安全的主题初始化脚本 */}
        <ThemeScript />
      </head>
      <body className={`font-sans antialiased ${inter.className}`}>
        {/* 页面结构 */}
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        
        {/* 为未来功能预留的全局组件 */}
        {/* <Notifications /> */}
        {/* <ProgressBar /> */}
        {/* <Analytics /> */}
      </body>
    </html>
  );
}