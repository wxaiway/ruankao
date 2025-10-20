/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用 App Router
  experimental: {
    // typedRoutes: true, // Disabled for now to avoid type issues
  },
  
  // MDX 支持
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  
  // 图片优化
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    // 允许本地图片路径
    domains: [],
  },
  
  // 静态资源处理 - 图片现在在 public/imgs/ 目录中，Next.js 会自动处理
  
  // 性能优化
  compress: true,
  poweredByHeader: false,
  
  // 未来扩展：支持国际化
  // i18n: {
  //   locales: ['zh-CN', 'en'],
  //   defaultLocale: 'zh-CN',
  // },
}

module.exports = nextConfig