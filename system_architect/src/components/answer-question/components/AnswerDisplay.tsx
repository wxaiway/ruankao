/**
 * 通用答案展示组件
 * 支持展开/收起、渐变动画等交互效果
 */

'use client';

import React, { useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff, BookOpen, Target, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnswerDisplayProps, AnswerQuestion, isCaseAnalysis, isEssayGuidance } from '@/lib/answer-questions';

export function AnswerDisplay({ 
  question, 
  isVisible, 
  onToggle, 
  config,
  className 
}: AnswerDisplayProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    keyPoints: true,
    grading: false,
    references: false
  });

  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  const renderAnswerToggle = () => (
    <button
      onClick={onToggle}
      className={cn(
        "w-full p-4 border-2 border-dashed rounded-xl transition-all duration-200",
        "hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10",
        "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
        isVisible ? "border-blue-300 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-600"
      )}
    >
      <div className="flex items-center justify-center gap-3 text-blue-600 dark:text-blue-400">
        {isVisible ? (
          <>
            <EyeOff className="w-5 h-5" />
            <span className="font-medium">隐藏答案解析</span>
            <ChevronUp className="w-4 h-4" />
          </>
        ) : (
          <>
            <Eye className="w-5 h-5" />
            <span className="font-medium">查看答案解析</span>
            <ChevronDown className="w-4 h-4" />
          </>
        )}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {isVisible ? "点击隐藏详细答案和评分标准" : "点击查看标准答案、关键要点和评分标准"}
      </div>
    </button>
  );

  const renderCaseAnalysisAnswer = (caseQuestion: Extract<AnswerQuestion, { type: 'case-analysis' }>) => (
    <div className="space-y-6">
      {/* 标准答案 */}
      <div className="prose dark:prose-invert max-w-none">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 m-0">标准答案</h3>
        </div>
        <div 
          className="answer-content"
          dangerouslySetInnerHTML={{ __html: caseQuestion.answer.content }} 
        />
      </div>

      {/* 关键要点 */}
      {config.showKeyPoints && caseQuestion.answer.keyPoints.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
          <button
            onClick={() => toggleSection('keyPoints')}
            className="flex items-center gap-2 w-full text-left mb-3 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
          >
            <Target className="w-4 h-4 text-amber-600" />
            <span className="font-medium text-amber-800 dark:text-amber-200">关键分析点</span>
            {expandedSections.keyPoints ? (
              <ChevronUp className="w-4 h-4 ml-auto" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-auto" />
            )}
          </button>
          
          {expandedSections.keyPoints && (
            <div className="space-y-2 animate-fade-in">
              {caseQuestion.answer.keyPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span className="text-amber-700 dark:text-amber-300">{point}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 评分标准 */}
      {config.showGradingCriteria && caseQuestion.answer.gradingRubric.length > 0 && (
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
          <button
            onClick={() => toggleSection('grading')}
            className="flex items-center gap-2 w-full text-left mb-3 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
          >
            <AlertCircle className="w-4 h-4 text-purple-600" />
            <span className="font-medium text-purple-800 dark:text-purple-200">评分标准</span>
            <span className="text-xs text-purple-600 dark:text-purple-400 ml-1">
              (总计 {caseQuestion.answer.gradingRubric.reduce((sum, item) => sum + item.points, 0)} 分)
            </span>
            {expandedSections.grading ? (
              <ChevronUp className="w-4 h-4 ml-auto" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-auto" />
            )}
          </button>
          
          {expandedSections.grading && (
            <div className="space-y-3 animate-fade-in">
              {caseQuestion.answer.gradingRubric.map((rubric, index) => (
                <div key={index} className="bg-white dark:bg-purple-800/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-purple-800 dark:text-purple-200">{rubric.criteria}</span>
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 text-xs rounded-full font-medium">
                      {rubric.points} 分
                    </span>
                  </div>
                  {rubric.description && (
                    <p className="text-sm text-purple-600 dark:text-purple-400">{rubric.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 参考资料 */}
      {config.showReferences && caseQuestion.answer.references && caseQuestion.answer.references.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <button
            onClick={() => toggleSection('references')}
            className="flex items-center gap-2 w-full text-left mb-3 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-800 dark:text-blue-200">参考资料</span>
            {expandedSections.references ? (
              <ChevronUp className="w-4 h-4 ml-auto" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-auto" />
            )}
          </button>
          
          {expandedSections.references && (
            <div className="space-y-2 animate-fade-in">
              {caseQuestion.answer.references.map((ref, index) => (
                <div key={index} className="text-sm text-blue-700 dark:text-blue-300 pl-6 relative">
                  <span className="absolute left-2 text-blue-500">{index + 1}.</span>
                  {ref}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderEssayGuidanceAnswer = (essayQuestion: Extract<AnswerQuestion, { type: 'essay-guidance' }>) => (
    <div className="space-y-6">
      {/* 论文结构指导 */}
      <div className="prose dark:prose-invert max-w-none">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 m-0">写作指导</h3>
        </div>
        <div 
          className="guidance-content"
          dangerouslySetInnerHTML={{ __html: essayQuestion.guidance.structure }} 
        />
      </div>

      {/* 关键要点 */}
      {config.showKeyPoints && essayQuestion.guidance.keyPoints.length > 0 && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
          <button
            onClick={() => toggleSection('keyPoints')}
            className="flex items-center gap-2 w-full text-left mb-3 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
          >
            <Target className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-emerald-800 dark:text-emerald-200">写作要点</span>
            {expandedSections.keyPoints ? (
              <ChevronUp className="w-4 h-4 ml-auto" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-auto" />
            )}
          </button>
          
          {expandedSections.keyPoints && (
            <div className="space-y-2 animate-fade-in">
              {essayQuestion.guidance.keyPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-emerald-700 dark:text-emerald-300">{point}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 参考示例 */}
      {essayQuestion.guidance.examples && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span className="font-medium text-indigo-800 dark:text-indigo-200">参考示例</span>
          </div>
          <div 
            className="prose dark:prose-invert prose-sm max-w-none text-indigo-700 dark:text-indigo-300"
            dangerouslySetInnerHTML={{ __html: essayQuestion.guidance.examples }} 
          />
        </div>
      )}

      {/* 常见问题 */}
      {essayQuestion.guidance.commonMistakes.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="font-medium text-red-800 dark:text-red-200">常见问题</span>
          </div>
          <div className="space-y-2">
            {essayQuestion.guidance.commonMistakes.map((mistake, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <span className="w-4 h-4 bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                  !
                </span>
                <span className="text-red-700 dark:text-red-300">{mistake}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 评分标准 */}
      {config.showGradingCriteria && essayQuestion.guidance.gradingCriteria.length > 0 && (
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
          <button
            onClick={() => toggleSection('grading')}
            className="flex items-center gap-2 w-full text-left mb-3 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
          >
            <AlertCircle className="w-4 h-4 text-purple-600" />
            <span className="font-medium text-purple-800 dark:text-purple-200">评分标准</span>
            <span className="text-xs text-purple-600 dark:text-purple-400 ml-1">
              (总分 {essayQuestion.guidance.gradingCriteria.reduce((sum, item) => sum + item.points, 0)}分)
            </span>
            {expandedSections.grading ? (
              <ChevronUp className="w-4 h-4 ml-auto" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-auto" />
            )}
          </button>
          
          {expandedSections.grading && (
            <div className="space-y-3 animate-fade-in">
              {essayQuestion.guidance.gradingCriteria.map((criteria, index) => (
                <div key={index} className="bg-white dark:bg-purple-800/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-purple-800 dark:text-purple-200">{criteria.criteria}</span>
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 text-xs rounded-full font-medium">
                      {criteria.points}分
                    </span>
                  </div>
                  <p className="text-sm text-purple-600 dark:text-purple-400">{criteria.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className={cn("mt-8 mb-12", className)}>
      {!isVisible ? (
        renderAnswerToggle()
      ) : (
        <div className="space-y-6 animate-fade-in mb-8">
          {/* 收起按钮 */}
          <div className="flex justify-end">
            <button
              onClick={onToggle}
              className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <EyeOff className="w-4 h-4" />
              隐藏答案
            </button>
          </div>

          {/* 答案内容 */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            {isCaseAnalysis(question) 
              ? renderCaseAnalysisAnswer(question)
              : isEssayGuidance(question)
                ? renderEssayGuidanceAnswer(question)
                : null
            }
          </div>
        </div>
      )}
    </div>
  );
}