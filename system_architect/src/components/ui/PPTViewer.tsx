'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2,
  Grid3X3,
  List
} from 'lucide-react';

interface PPTViewerProps {
  content: string;
  title: string;
}

interface Slide {
  id: number;
  title: string;
  content: string;
  rawContent: string;
}

export function PPTViewer({ content, title }: PPTViewerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 解析Markdown内容为幻灯片
  const slides = useMemo(() => {
    const lines = content.split('\n');
    const slideData: Slide[] = [];
    let currentSlideContent: string[] = [];
    let slideId = 0;
    let slideTitle = '';

    lines.forEach((line, index) => {
      // 检测一级标题作为幻灯片分隔
      if (line.startsWith('# ') || line.startsWith('## ')) {
        // 保存上一个幻灯片
        if (currentSlideContent.length > 0) {
          slideData.push({
            id: slideId++,
            title: slideTitle || `幻灯片 ${slideId}`,
            content: formatSlideContent(currentSlideContent.join('\n')),
            rawContent: currentSlideContent.join('\n')
          });
          currentSlideContent = [];
        }
        
        // 开始新的幻灯片
        slideTitle = line.replace(/^#{1,2}\s+/, '');
        currentSlideContent.push(line);
      } else if (line.trim() === '---' || line.trim() === '***') {
        // 手动分页符
        if (currentSlideContent.length > 0) {
          slideData.push({
            id: slideId++,
            title: slideTitle || `幻灯片 ${slideId}`,
            content: formatSlideContent(currentSlideContent.join('\n')),
            rawContent: currentSlideContent.join('\n')
          });
          currentSlideContent = [];
          slideTitle = '';
        }
      } else {
        currentSlideContent.push(line);
      }
    });

    // 添加最后一个幻灯片
    if (currentSlideContent.length > 0) {
      slideData.push({
        id: slideId++,
        title: slideTitle || `幻灯片 ${slideId}`,
        content: formatSlideContent(currentSlideContent.join('\n')),
        rawContent: currentSlideContent.join('\n')
      });
    }

    return slideData;
  }, [content]);

  // 格式化幻灯片内容
  function formatSlideContent(rawContent: string): string {
    return rawContent
      .replace(/^#{1,6}\s+(.+)$/gm, '<h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4 sm:mb-6 lg:mb-8 text-blue-600 dark:text-blue-400">$1</h1>')
      .replace(/^- (.+)$/gm, '<li class="text-base sm:text-lg lg:text-xl mb-2 sm:mb-3 flex items-start"><span class="text-blue-500 mr-2 sm:mr-3 flex-shrink-0">•</span><span>$1</span></li>')
      .replace(/^\d+\.\s+(.+)$/gm, '<li class="text-base sm:text-lg lg:text-xl mb-2 sm:mb-3 flex items-start"><span class="text-blue-500 mr-2 sm:mr-3 font-semibold flex-shrink-0">$1.</span><span>$2</span></li>')
      .replace(/!\[([^\]]*)\]\(\.\/imgs\/([^)]+)\)/g, '<div class="flex justify-center my-4 sm:my-6 lg:my-8"><img src="/imgs/$2" alt="$1" class="max-w-full h-auto rounded-lg shadow-lg" style="max-height: 300px;" /></div>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<div class="flex justify-center my-4 sm:my-6 lg:my-8"><img src="$2" alt="$1" class="max-w-full h-auto rounded-lg shadow-lg" style="max-height: 300px;" /></div>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-blue-600 dark:text-blue-400">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="text-gray-600 dark:text-gray-400">$1</em>')
      .replace(/`(.+?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 sm:px-2 py-1 rounded text-xs sm:text-sm">$1</code>')
      .replace(/\n\n/g, '</p><p class="text-sm sm:text-base lg:text-lg leading-relaxed mb-3 sm:mb-4 lg:mb-6">')
      .replace(/^(?!<[h|l])/gm, '<p class="text-sm sm:text-base lg:text-lg leading-relaxed mb-3 sm:mb-4 lg:mb-6">')
      .replace(/<p class="text-sm sm:text-base lg:text-lg leading-relaxed mb-3 sm:mb-4 lg:mb-6"><\/p>/g, '');
  }

  // 自动播放逻辑
  useEffect(() => {
    if (isAutoPlay && slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide(current => {
          if (current < slides.length - 1) {
            return current + 1;
          } else {
            setIsAutoPlay(false);
            return current;
          }
        });
      }, 5000); // 每5秒切换

      return () => clearInterval(interval);
    }
  }, [isAutoPlay, slides.length]);

  // 键盘控制
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPreviousSlide();
          break;
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          goToNextSlide();
          break;
        case 'Home':
          e.preventDefault();
          setCurrentSlide(0);
          break;
        case 'End':
          e.preventDefault();
          setCurrentSlide(slides.length - 1);
          break;
        case 'Escape':
          e.preventDefault();
          setIsFullscreen(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [slides.length]);

  const goToNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const goToPreviousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  const resetToFirst = () => {
    setCurrentSlide(0);
    setIsAutoPlay(false);
  };

  if (slides.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          无法解析PPT内容
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          请确保内容使用正确的Markdown格式，用一级或二级标题分隔幻灯片。
        </p>
      </Card>
    );
  }

  const containerClass = isFullscreen 
    ? "fixed inset-0 z-50 bg-white dark:bg-gray-900" 
    : "relative";

  return (
    <div className={containerClass}>
      {/* 工具栏 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 gap-3 sm:gap-0">
        <div className="flex items-center gap-2 sm:gap-4">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
            {title} - PPT模式
          </h3>
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowThumbnails(!showThumbnails)}
            className="flex items-center gap-1 sm:gap-2 flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3"
          >
            {showThumbnails ? <List className="w-3 h-3 sm:w-4 sm:h-4" /> : <Grid3X3 className="w-3 h-3 sm:w-4 sm:h-4" />}
            <span className="hidden sm:inline">{showThumbnails ? '列表' : '缩略图'}</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={resetToFirst}
            className="flex items-center gap-1 sm:gap-2 flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3"
          >
            <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">重置</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAutoPlay}
            className="flex items-center gap-1 sm:gap-2 flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3"
          >
            {isAutoPlay ? <Pause className="w-3 h-3 sm:w-4 sm:h-4" /> : <Play className="w-3 h-3 sm:w-4 sm:h-4" />}
            <span className="hidden sm:inline">{isAutoPlay ? '暂停' : '播放'}</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1 sm:gap-2 flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3"
          >
            <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{isFullscreen ? '退出' : '全屏'}</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row h-full">
        {/* 缩略图面板 - 移动端显示为顶部水平滚动 */}
        {showThumbnails && (
          <div className="sm:w-64 bg-gray-50 dark:bg-gray-800 border-b sm:border-r sm:border-b-0 border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-3 sm:p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 sm:mb-4">幻灯片列表</h4>
              <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentSlide(index)}
                    className={`flex-shrink-0 sm:flex-shrink sm:w-full text-left p-2 sm:p-3 rounded-lg border transition-colors min-w-48 sm:min-w-0 ${
                      index === currentSlide
                        ? 'bg-blue-100 border-blue-300 text-blue-900 dark:bg-blue-900/30 dark:border-blue-600 dark:text-blue-300'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-medium mb-1">
                      {index + 1}. {slide.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {slide.rawContent.replace(/[#*`-]/g, '').substring(0, 60)}...
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 主要展示区域 */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* 幻灯片内容 */}
          <div className="flex-1 flex items-center justify-center p-3 sm:p-6 lg:p-8">
            <div className="max-w-6xl w-full">
              <Card className="min-h-[400px] sm:min-h-[500px] p-4 sm:p-8 lg:p-12 flex flex-col justify-center">
                <div 
                  className="slide-content text-center"
                  dangerouslySetInnerHTML={{ 
                    __html: slides[currentSlide]?.content || '' 
                  }}
                />
              </Card>
            </div>
          </div>

          {/* 导航控制 */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 gap-3 sm:gap-4">
            {/* 移动端：标题和指示器在上方 */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left truncate max-w-full sm:max-w-48">
                {slides[currentSlide]?.title}
              </span>
              <div className="flex space-x-1">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentSlide
                        ? 'bg-blue-600 dark:bg-blue-400'
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* 导航按钮 */}
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <Button
                variant="outline"
                onClick={goToPreviousSlide}
                disabled={currentSlide === 0}
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4"
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">上一页</span>
                <span className="xs:hidden">上一页</span>
              </Button>

              <Button
                variant="outline"
                onClick={goToNextSlide}
                disabled={currentSlide === slides.length - 1}
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4"
              >
                <span className="hidden xs:inline">下一页</span>
                <span className="xs:hidden">下一页</span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 键盘提示（全屏模式下显示） */}
      {isFullscreen && (
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded">
          <div>← → 切换幻灯片</div>
          <div>Space 下一页</div>
          <div>ESC 退出全屏</div>
        </div>
      )}
    </div>
  );
}