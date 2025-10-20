'use client';

import { useState, useEffect } from 'react';
import { getNextExamInfo, formatExamDate } from '@/config/years';
import { Calendar, Clock } from 'lucide-react';

interface ExamCountdownProps {
  className?: string;
}

export function ExamCountdown({ className = '' }: ExamCountdownProps) {
  const [examInfo, setExamInfo] = useState<{
    examDate: string;
    daysRemaining: number;
    examType: 'spring' | 'autumn';
    examName: string;
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateExamInfo = () => {
      try {
        const info = getNextExamInfo();
        setExamInfo(info);
      } catch (error) {
        console.error('Failed to get exam info:', error);
      }
    };

    updateExamInfo();
    
    // 每天更新一次倒计时
    const interval = setInterval(updateExamInfo, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // 避免服务端渲染不一致
  if (!mounted || !examInfo) {
    return (
      <div className={`flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 ${className}`}>
        <Calendar className="w-4 h-4" />
        <span>加载中...</span>
      </div>
    );
  }

  const { daysRemaining, examType, examName } = examInfo;

  // 根据剩余天数选择显示样式
  const getCountdownStyle = () => {
    if (daysRemaining <= 7) {
      return 'text-red-600 dark:text-red-400'; // 一周内 - 紧急
    } else if (daysRemaining <= 30) {
      return 'text-orange-600 dark:text-orange-400'; // 一个月内 - 警告
    } else if (daysRemaining <= 90) {
      return 'text-yellow-600 dark:text-yellow-400'; // 三个月内 - 注意
    } else {
      return 'text-blue-600 dark:text-blue-400'; // 充足时间 - 正常
    }
  };

  const countdownColor = getCountdownStyle();

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <Calendar className={`w-4 h-4 ${countdownColor}`} />
      <div className="flex items-center gap-1">
        <span className="text-gray-600 dark:text-gray-300">距离考试还有</span>
        <span className={`font-semibold ${countdownColor}`}>
          {daysRemaining}
        </span>
        <span className="text-gray-600 dark:text-gray-300">天</span>
      </div>
      
      {/* 鼠标悬停显示详细信息 */}
      <div className="group relative">
        <Clock className="w-3 h-3 text-gray-400 cursor-help" />
        <div className="absolute top-full right-0 mt-2 hidden group-hover:block z-50">
          <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
            <div className="font-medium">{examName}</div>
            <div className="text-gray-200 dark:text-gray-300 mt-1">
              {formatExamDate(examInfo.examDate)}
            </div>
            <div className="text-gray-300 dark:text-gray-400 text-xs mt-1">
              {examType === 'spring' ? '上半年' : '下半年'}考试
            </div>
            {/* 小三角形 - 调整到顶部 */}
            <div className="absolute bottom-full right-3 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900 dark:border-b-gray-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamCountdown;