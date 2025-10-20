'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Material } from '@/lib/content';
import { BookOpen, Play, Clock, TrendingUp, FileText, HelpCircle, Code } from 'lucide-react';

interface MaterialSelectorProps {
  materials: Material[];
  currentPath: string;
}

export function MaterialSelector({ materials, currentPath }: MaterialSelectorProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);

  const getIcon = (typeName: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      '基础讲义': Play,
      '精编教材': BookOpen,
      '速记卡片': Clock,
      '冲刺宝典': TrendingUp,
      '理论基础': BookOpen,
      '实践练习': Code,
      '案例分析': FileText,
      '练习题': HelpCircle
    };
    return iconMap[typeName] || BookOpen;
  };

  const getTypeColor = (typeName: string) => {
    const colorMap: Record<string, string> = {
      '基础讲义': 'blue',
      '精编教材': 'green',
      '速记卡片': 'yellow',
      '冲刺宝典': 'red',
      '理论基础': 'purple',
      '实践练习': 'indigo',
      '案例分析': 'orange',
      '练习题': 'pink'
    };
    return colorMap[typeName] || 'gray';
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        学习材料
      </h3>
      
      <div className="space-y-2">
        {materials.map((material) => {
          const Icon = getIcon(material.type);
          const color = getTypeColor(material.type);
          const isSelected = selectedMaterial === material.id;
          
          const colorClasses = {
            blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
            green: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
            yellow: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
            red: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
            purple: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
            indigo: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800',
            orange: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
            pink: 'text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800',
            gray: 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800'
          };
          
          return (
            <div
              key={material.id}
              className={`p-3 rounded-lg border-2 transition-all cursor-pointer hover:shadow-sm ${
                isSelected 
                  ? colorClasses[color as keyof typeof colorClasses]
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              onClick={() => setSelectedMaterial(isSelected ? null : material.id)}
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 mt-0.5 ${
                  isSelected 
                    ? 'text-current' 
                    : 'text-gray-500 dark:text-gray-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium ${
                    isSelected 
                      ? 'text-current' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {material.title}
                  </h4>
                  
                  {material.metadata.description && (
                    <p className={`text-sm mt-1 ${
                      isSelected 
                        ? 'text-current opacity-80' 
                        : 'text-gray-600 dark:text-gray-300'
                    }`}>
                      {String(material.metadata.description)}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className={`px-2 py-1 rounded-full ${
                      isSelected 
                        ? 'bg-current bg-opacity-20 text-current' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}>
                      {material.type}
                    </span>
                    
                    {material.metadata.estimatedMinutes && (
                      <span className={
                        isSelected 
                          ? 'text-current opacity-80' 
                          : 'text-gray-500 dark:text-gray-400'
                      }>
                        {material.metadata.estimatedMinutes} 分钟
                      </span>
                    )}
                    
                    {material.metadata.difficulty && (
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        material.metadata.difficulty === 'basic' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : material.metadata.difficulty === 'intermediate'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {material.metadata.difficulty === 'basic' ? '基础' :
                         material.metadata.difficulty === 'intermediate' ? '中级' : '高级'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start" asChild>
            <Link href="#toc">
              <BookOpen className="w-4 h-4 mr-2" />
              目录导航
            </Link>
          </Button>
          
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Clock className="w-4 h-4 mr-2" />
            学习进度
          </Button>
        </div>
      </div>
    </Card>
  );
}