/**
 * 安全的主题初始化脚本
 * 防止 FOUC (Flash of Unstyled Content) 和 XSS 攻击
 */

import { siteConfig } from '@/config/site.config';

// 生成安全的主题初始化脚本
function generateThemeScript(): string {
  return `(function() {
    try {
      var theme = localStorage.getItem('theme');
      if (!theme) {
        theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {
      // 静默处理错误，避免阻塞页面加载
    }
  })();`;
}

export function ThemeScript() {
  // 在服务器端生成安全的脚本内容
  const scriptContent = generateThemeScript();
  
  return (
    <script 
      dangerouslySetInnerHTML={{ __html: scriptContent }}
      // 为 CSP 兼容性添加 nonce（仅在开发模式）
      {...(process.env.NODE_ENV === 'development' && { 'data-nonce': 'theme-init' })}
    />
  );
}