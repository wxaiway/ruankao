'use client';

import { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Card } from './Card';
import { FileText, ExternalLink, Copy, Check } from 'lucide-react';
import { Button } from './Button';
import { parseHeadingsFromMarkdown, generateHeadingId, type HeadingInfo } from '@/lib/heading-utils';

interface MarkdownViewerProps {
  content: string;
  title: string;
  type: string;
}

function MarkdownViewerComponent({ content, title, type }: MarkdownViewerProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeHeading, setActiveHeading] = useState<string>('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  
  // 创建heading元素的引用映射
  const headingRefs = useRef<Map<string, HTMLElement>>(new Map());
  
  // 注册heading元素的回调函数
  const registerHeadingRef = useCallback((id: string) => {
    return (element: HTMLElement | null) => {
      if (element) {
        headingRefs.current.set(id, element);
      } else {
        headingRefs.current.delete(id);
      }
    };
  }, []);

  // 使用统一的标题解析工具生成目录
  const tableOfContents = useMemo(() => {
    return parseHeadingsFromMarkdown(content);
  }, [content]);

  // 处理目录点击跳转 - 使用统一的简洁方案
  const handleTocClick = useCallback((id: string) => {
    const element = headingRefs.current.get(id);
    if (element) {
      // 使用浏览器原生scrollIntoView，自动处理各种滚动容器场景
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
      setActiveHeading(id);
    }
  }, []);

  // 简化的滚动监听逻辑
  useEffect(() => {
    const handleScroll = () => {
      // 统一的滚动容器检测
      const isDesktop = window.innerWidth >= 1024;
      const scrollContainer = isDesktop 
        ? document.getElementById('main-content-container')
        : document.documentElement;
      
      if (!scrollContainer) return;
      
      const scrollTop = isDesktop 
        ? (scrollContainer as HTMLElement).scrollTop
        : window.scrollY;
      
      const scrollHeight = isDesktop
        ? (scrollContainer as HTMLElement).scrollHeight - (scrollContainer as HTMLElement).clientHeight
        : document.documentElement.scrollHeight - window.innerHeight;
      
      // 更新阅读进度
      const progress = Math.min(100, Math.max(0, (scrollTop / Math.max(scrollHeight, 1)) * 100));
      setReadingProgress(progress);
      
      // 更新活跃标题 - 使用ref而不是DOM查询
      let activeId = '';
      let bestMatch = -1;
      
      headingRefs.current.forEach((element, id) => {
        const rect = element.getBoundingClientRect();
        const offset = isDesktop ? 150 : 100; // PC端留更多空间给固定侧边栏
        
        if (rect.top <= offset && rect.top > bestMatch) {
          bestMatch = rect.top;
          activeId = id;
        }
      });
      
      if (activeId && activeId !== activeHeading) {
        setActiveHeading(activeId);
      }
    };

    // 统一的事件监听逻辑
    const isDesktop = window.innerWidth >= 1024;
    const target = isDesktop 
      ? document.getElementById('main-content-container')
      : window;
    
    if (target) {
      target.addEventListener('scroll', handleScroll);
      handleScroll(); // 初始化检查
      
      return () => target.removeEventListener('scroll', handleScroll);
    }
  }, [activeHeading]);

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // 只在PC端支持快捷键
      if (window.innerWidth >= 1024) {
        // Ctrl/Cmd + B 切换侧边栏
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
          e.preventDefault();
          setSidebarCollapsed(!sidebarCollapsed);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [sidebarCollapsed]);
  
  // 点击外部关闭移动端菜单
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileMenuOpen && window.innerWidth < 1024) {
        const target = e.target as HTMLElement;
        if (!target.closest('.mobile-toc-menu')) {
          setMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  // 获取材料类型配置

  // 代码复制功能
  const copyToClipboard = async (code: string, language: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(`${language}-${code.substring(0, 50)}`);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  // 标题索引跟踪
  const headingIndices = useRef({ h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 });
  
  const components = useMemo(() => ({
    h1: ({ children, ...props }: any) => {
      const text = children?.toString() || '';
      const id = generateHeadingId(text, 1, headingIndices.current.h1++);
      return (
        <h1
          ref={registerHeadingRef(id)}
          id={id}
          className="text-4xl font-bold text-gray-900 dark:text-white mb-8 pt-8 border-t-2 border-blue-200 dark:border-blue-800"
          {...props}
        >
          {children}
        </h1>
      );
    },
    h2: ({ children, ...props }: any) => {
      const text = children?.toString() || '';
      const id = generateHeadingId(text, 2, headingIndices.current.h2++);
      return (
        <h2
          ref={registerHeadingRef(id)}
          id={id}
          className="text-3xl font-semibold text-gray-900 dark:text-white mb-6 mt-12 pt-4 border-t border-gray-200 dark:border-gray-700"
          {...props}
        >
          {children}
        </h2>
      );
    },
    h3: ({ children, ...props }: any) => {
      const text = children?.toString() || '';
      const id = generateHeadingId(text, 3, headingIndices.current.h3++);
      return (
        <h3
          ref={registerHeadingRef(id)}
          id={id}
          className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 mt-8"
          {...props}
        >
          {children}
        </h3>
      );
    },
    h4: ({ children, ...props }: any) => {
      const text = children?.toString() || '';
      const id = generateHeadingId(text, 4, headingIndices.current.h4++);
      return (
        <h4
          ref={registerHeadingRef(id)}
          id={id}
          className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6"
          {...props}
        >
          {children}
        </h4>
      );
    },
    
    // 段落
    p: ({ children, ...props }: any) => (
      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed" {...props}>
        {children}
      </p>
    ),
    
    // 列表
    ul: ({ children, ...props }: any) => (
      <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700 dark:text-gray-300" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: any) => (
      <ol className="list-decimal list-inside mb-6 space-y-2 text-gray-700 dark:text-gray-300" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }: any) => (
      <li className="mb-1" {...props}>
        {children}
      </li>
    ),
    
    // 代码
    code: ({ inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      if (!inline && match) {
        const codeString = String(children).replace(/\n$/, '');
        const codeId = `${language}-${codeString.substring(0, 50)}`;
        const isCopied = copiedCode === codeId;
        
        return (
          <div className="relative group mb-6">
            <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-t-lg border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {language.toUpperCase()}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(codeString, language)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {isCopied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <SyntaxHighlighter
              style={oneLight}
              language={language}
              PreTag="div"
              className="rounded-t-none !mt-0"
              {...props}
            >
              {codeString}
            </SyntaxHighlighter>
          </div>
        );
      }
      
      return (
        <code 
          className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-red-600 dark:text-red-400" 
          {...props}
        >
          {children}
        </code>
      );
    },
    
    // 引用
    blockquote: ({ children, ...props }: any) => (
      <blockquote 
        className="border-l-4 border-blue-500 pl-6 py-2 my-6 bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-300 italic" 
        {...props}
      >
        {children}
      </blockquote>
    ),
    
    // 图片组件 - 优化显示和响应式
    img: ({ src, alt, ...props }: any) => {
      // 处理相对路径，转换为绝对路径
      const imageSrc = src?.startsWith('./imgs/') ? src.replace('./imgs/', '/imgs/') : src;
      
      return (
        <div className="flex flex-col items-center my-6 sm:my-8">
          <img
            src={imageSrc}
            alt={alt}
            className="w-full max-w-4xl h-auto rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
            style={{ maxHeight: '600px' }}
            {...props}
          />
          {alt && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center italic max-w-2xl">
              {alt}
            </p>
          )}
        </div>
      );
    },
    
    // 链接
    a: ({ children, href, ...props }: any) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline inline-flex items-center gap-1"
        {...props}
      >
        {children}
        <ExternalLink className="w-3 h-3" />
      </a>
    ),
    
    // 表格
    table: ({ children, ...props }: any) => (
      <div className="overflow-x-auto mb-6 -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table 
            className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden" 
            {...props}
          >
            {children}
          </table>
        </div>
      </div>
    ),
    thead: ({ children, ...props }: any) => (
      <thead 
        className="bg-gray-50 dark:bg-gray-800" 
        {...props}
      >
        {children}
      </thead>
    ),
    th: ({ children, ...props }: any) => (
      <th 
        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" 
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }: any) => (
      <td 
        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300" 
        {...props}
      >
        {children}
      </td>
    ),
    
    // 水平线
    hr: ({ ...props }: any) => (
      <hr 
        className="my-8 border-gray-300 dark:border-gray-600" 
        {...props}
      />
    ),
  }), [registerHeadingRef]);

  return (
    <div className="w-full h-full">
      {/* 移动端粘性顶部目录栏 */}
      <div className="block lg:hidden">
        
        {/* 移动端粘性目录栏 */}
        {tableOfContents.length > 0 && (
          <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                {/* 当前章节显示 */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="flex-1 flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span className="font-medium text-gray-900 dark:text-white truncate">
                      {tableOfContents.find(item => item.id === activeHeading)?.text || tableOfContents[0]?.text || '目录'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.round(readingProgress)}%
                    </span>
                    <svg 
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        mobileMenuOpen ? 'rotate-180' : ''
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
              </div>
              
              {/* 进度条 */}
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                <div 
                  className="bg-blue-600 dark:bg-blue-400 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${readingProgress}%` }}
                />
              </div>
            </div>
            
            {/* 移动端展开的目录 */}
            {mobileMenuOpen && (
              <div className="mobile-toc-menu border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 max-h-80 overflow-y-auto">
                <nav className="p-4 space-y-1">
                  {tableOfContents.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        handleTocClick(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`block w-full text-left text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        item.level === 1 ? 'font-semibold text-gray-900 dark:text-white' : 
                        item.level === 2 ? 'font-medium text-gray-700 dark:text-gray-300 pl-4' : 
                        'text-gray-600 dark:text-gray-400 pl-8'
                      } ${activeHeading === item.id ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : ''}`}
                    >
                      {item.text}
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </div>
        )}
        
        {/* 移动端内容 */}
        <div className="p-4 sm:p-6">
          <article className="prose prose-gray dark:prose-invert max-w-none prose-lg">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
              components={components}
            >
              {content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
      
      {/* PC端布局 */}
      <div className="hidden lg:flex h-screen">
        {/* 左侧固定目录侧边栏 */}
        {tableOfContents.length > 0 && (
          <div className={`bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex-shrink-0 ${
            sidebarCollapsed ? 'w-12' : 'w-80'
          }`}>
            <div className="h-full flex flex-col">
              {/* 侧边栏头部 */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                {!sidebarCollapsed && (
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      文章目录
                    </h3>
                  </div>
                )}
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors group"
                  title={`${sidebarCollapsed ? '展开目录' : '收起目录'} (Ctrl+B)`}
                >
                  <svg 
                    className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${
                      sidebarCollapsed ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
              
              {/* 目录内容 */}
              {!sidebarCollapsed && (
                <div className="flex-1 overflow-y-auto p-4">
                  <nav className="space-y-1">
                    {tableOfContents.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleTocClick(item.id)}
                        className={`block w-full text-left text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer p-2 rounded hover:bg-white dark:hover:bg-gray-700 ${
                          item.level === 1 ? 'font-semibold text-gray-900 dark:text-white' : 
                          item.level === 2 ? 'font-medium text-gray-700 dark:text-gray-300 pl-4' : 
                          'text-gray-600 dark:text-gray-400 pl-8'
                        } ${activeHeading === item.id ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : ''}`}
                      >
                        {item.text}
                      </button>
                    ))}
                  </nav>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* PC端主内容区域 */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* PC端可滚动内容区域 */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-8" id="main-content-container">
            <div className="max-w-4xl mx-auto">
              <article className="prose prose-gray dark:prose-invert max-w-none prose-lg">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  components={components}
                >
                  {content}
                </ReactMarkdown>
              </article>
            </div>
          </div>
        </div>
      </div>
      
      {/* 移动端浮动操作按钮 */}
      <div className="block lg:hidden">
        {tableOfContents.length > 0 && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            aria-label="目录导航"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// 自定义比较函数，优化重渲染
const areEqual = (prevProps: MarkdownViewerProps, nextProps: MarkdownViewerProps) => {
  return (
    prevProps.content === nextProps.content &&
    prevProps.title === nextProps.title &&
    prevProps.type === nextProps.type
  );
};

export const MarkdownViewer = memo(MarkdownViewerComponent, areEqual);