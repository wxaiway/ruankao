import { NextRequest, NextResponse } from 'next/server';
import { parseYearFromPath, generateYearPath, getAvailableYears, getCurrentYear, isValidYear } from '@/config/years';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 跳过静态资源和API路由
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/imgs') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 特殊路径重定向：将问答型内容路径统一重定向到专用路由
  
  // paper-guide -> essay-guidance (301永久重定向)
  if (pathname.startsWith('/paper-guide')) {
    const newPath = pathname.replace('/paper-guide', '/essay-guidance');
    const response = NextResponse.redirect(new URL(newPath, request.url), 301);
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable'); // 1年缓存
    return response;
  }


  // 解析路径中的年份
  const { year, cleanPath } = parseYearFromPath(pathname);
  
  // 生成标准化的路径
  const correctPath = generateYearPath(year, cleanPath);
  
  // 如果路径需要标准化，进行重定向
  if (pathname !== correctPath) {
    return NextResponse.redirect(new URL(correctPath, request.url));
  }
  
  // 添加年份信息到请求头，供页面组件使用
  const response = NextResponse.next();
  response.headers.set('x-current-year', year.toString());
  response.headers.set('x-clean-path', cleanPath);
  
  return response;
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images and other static assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|imgs).*)',
  ],
};