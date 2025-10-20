'use client';

import { useState, useEffect, memo, useMemo, useCallback } from 'react';
import { Material } from '@/lib/content';
import { MarkdownViewer } from '../ui/MarkdownViewer';
import { PPTViewer } from '../ui/PPTViewer';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { BookOpen, Play, Clock, TrendingUp, Info } from 'lucide-react';

interface UniversalViewerProps {
  materials: Material[];
  categorySlug: string;
  chapterSlug: string;
  initialMaterialId?: string;
}

function UniversalViewerComponent({ 
  materials, 
  categorySlug, 
  chapterSlug, 
  initialMaterialId 
}: UniversalViewerProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  useEffect(() => {
    if (materials.length > 0) {
      const initial = initialMaterialId 
        ? materials.find(m => m.id === initialMaterialId)
        : materials[0];
      setSelectedMaterial(initial || materials[0]);
    }
  }, [materials, initialMaterialId]);

  // 使用 useMemo 缓存图标映射
  const getIcon = useMemo(() => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      '章节简介': Info,
      '基础讲义': Play,
      '精编教材': BookOpen,
      '速记卡片': Clock,
      '冲刺宝典': TrendingUp,
      '理论基础': BookOpen,
      '实践练习': BookOpen,
      '案例分析': BookOpen,
      '练习题': BookOpen
    };
    return (typeName: string) => iconMap[typeName] || BookOpen;
  }, []);

  // 使用 useMemo 缓存渲染内容
  const renderContent = useMemo(() => {
    if (!selectedMaterial) return null;
    
    switch (selectedMaterial.format) {
      case 'ppt':
        return (
          <PPTViewer 
            content={selectedMaterial.content}
            title={selectedMaterial.title}
          />
        );
      case 'markdown':
      default:
        return (
          <MarkdownViewer 
            content={selectedMaterial.content}
            title={selectedMaterial.title}
            type={selectedMaterial.type}
          />
        );
    }
  }, [selectedMaterial]);

  // 使用 useCallback 缓存材料选择函数
  const handleMaterialSelect = useCallback((material: Material) => {
    setSelectedMaterial(material);
  }, []);

  // 渲染组件内容，避免条件性早期返回
  return (
    <div className="space-y-4">
      {!selectedMaterial ? (
        <Card className="p-8 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">没有可用的学习材料</p>
        </Card>
      ) : (
        <>
          {/* Material Tabs - Enhanced for better UX */}
          {materials.length > 1 && (
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-1 px-1">
                {materials.map((material) => {
                  const Icon = getIcon(material.type);
                  const isSelected = material.id === selectedMaterial.id;
                  
                  return (
                    <button
                      key={material.id}
                      onClick={() => handleMaterialSelect(material)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-medium text-sm transition-all ${
                        isSelected
                          ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 -mb-px'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {material.type}
                      {material.metadata.estimatedMinutes && (
                        <span className="text-xs opacity-75">
                          {material.metadata.estimatedMinutes}分钟
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="w-full">
              {renderContent}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// 自定义比较函数，优化重渲染
const areEqual = (prevProps: UniversalViewerProps, nextProps: UniversalViewerProps) => {
  return (
    prevProps.materials.length === nextProps.materials.length &&
    prevProps.materials.every((material, index) => 
      material.id === nextProps.materials[index]?.id &&
      material.content === nextProps.materials[index]?.content
    ) &&
    prevProps.categorySlug === nextProps.categorySlug &&
    prevProps.chapterSlug === nextProps.chapterSlug &&
    prevProps.initialMaterialId === nextProps.initialMaterialId
  );
};

export const UniversalViewer = memo(UniversalViewerComponent, areEqual);