import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { BookOpen, Clock, Users, TrendingUp, GraduationCap } from 'lucide-react';
import { getContainerClasses, getPaddingClasses } from '@/lib/layout-config';
import { getTextbooks } from '@/lib/content';

// 软件架构师四大学习板块
const learningModules = [
  {
    id: 'foundation',
    title: '基础知识',
    description: '12个核心章节，系统掌握软件架构理论基础',
    icon: BookOpen,
    color: 'blue',
    path: '/foundation',
    topics: ['考试介绍及备考攻略', '计算机系统基础', '嵌入式系统', '计算机网络', '数据库系统', '系统工程与信息系统基础', '软件工程', '知识产权与标准化', '项目管理', '软件架构设计', '系统可靠性分析与设计', '信息安全技术基础知识'],
    count: '12个章节'
  },
  {
    id: 'case-analysis',
    title: '案例分析',
    description: '6个领域的真实项目架构设计实践案例',
    icon: Users,
    color: 'green',
    path: '/case-analysis',
    topics: ['电商系统架构', '金融系统架构', '社交网络架构', '物联网系统架构', '大数据处理架构', '云原生架构'],
    count: '6个案例'
  },
  {
    id: 'essay-guidance',
    title: '论文指导',
    description: '软件架构师考试论文写作技巧和优秀范例',
    icon: TrendingUp,
    color: 'purple',
    path: '/essay-guidance',
    topics: ['论文写作基础', '架构设计论文模板', '优秀论文范例', '常见问题分析', '评分标准解读'],
    count: '5个指导'
  },
  {
    id: 'practice-tests',
    title: '练习题库',
    description: '选择题、案例分析、模拟试题和历年真题',
    icon: Clock,
    color: 'orange',
    path: '/practice',
    topics: ['选择题练习', '案例分析题', '模拟试题', '历年真题'],
    count: '历年真题'
  }
];

export default async function HomePage() {
  const totalTopics = learningModules.reduce((sum, module) => module.topics.length + sum, 0);
  const moduleCount = learningModules.length;
  const textbooks = await getTextbooks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Hero Section */}
      <section className={`relative py-20 ${getPaddingClasses('horizontal')}`}>
        <div className={getContainerClasses('main')}>
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              软件架构师学习平台
              <span className="block text-2xl font-normal text-blue-600 dark:text-blue-400 mt-2">
                系统化考试备考解决方案
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              基于软件架构师考试大纲，提供基础讲义、精编教材、速记卡片、冲刺宝典四种学习材料，
              助你高效备考通过软件架构师考试。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">
                <Link href="/foundation">
                  开始学习基础知识
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                <Link href="#modules">查看学习板块</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className={`${getContainerClasses('main')} ${getPaddingClasses('horizontal')}`}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{totalTopics}</div>
              <div className="text-gray-600 dark:text-gray-300">知识主题</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{moduleCount}</div>
              <div className="text-gray-600 dark:text-gray-300">学习板块</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">{textbooks.length}</div>
              <div className="text-gray-600 dark:text-gray-300">精品教材</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Textbooks Section */}
      <section className={`py-16 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-900/20 dark:via-gray-800 dark:to-purple-900/20 ${getPaddingClasses('horizontal')}`}>
        <div className={getContainerClasses('main')}>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <GraduationCap className="w-4 h-4" />
              精品教材推荐
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              专业教材助力考试成功
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              系统化的专业教材，完整的知识体系，助你高效备考通过软件架构师考试
            </p>
          </div>
          
          {textbooks.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-8">
              {textbooks.map((textbook, index) => {
                // 主要教材特殊样式（32小时通关教材）
                const isPrimary = textbook.id === '32-hours-guide';
                
                return (
                  <Card 
                    key={textbook.id} 
                    className={`p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 flex-1 ${
                      isPrimary 
                        ? 'border-2 border-indigo-200 dark:border-indigo-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm' 
                        : 'border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className={`${isPrimary ? 'p-5' : 'p-4'} rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white`}>
                          <GraduationCap className={isPrimary ? 'w-14 h-14' : 'w-12 h-12'} />
                        </div>
                      </div>
                      
                      <div className="flex-1 text-center">
                        <h3 className={`${isPrimary ? 'text-xl' : 'text-lg'} font-bold text-gray-900 dark:text-white mb-3`}>
                          {textbook.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed text-sm">
                          {textbook.description}
                        </p>
                        
                        <div className="flex flex-wrap justify-center gap-3 mb-3">
                          {textbook.metadata.estimatedHours && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                              <span>{textbook.metadata.estimatedHours}小时课程</span>
                            </div>
                          )}
                          {textbook.metadata.totalChapters && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                              <span>{textbook.metadata.totalChapters}个章节</span>
                            </div>
                          )}
                          {textbook.metadata.difficulty && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                              <span>{textbook.metadata.difficulty}</span>
                            </div>
                          )}
                        </div>
                        
                        {textbook.metadata.tags && textbook.metadata.tags.length > 0 && (
                          <div className="flex flex-wrap justify-center gap-2 mb-3">
                            {textbook.metadata.tags.slice(0, 5).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-shrink-0">
                        <Button 
                          size="md"
                          className="px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" 
                          asChild
                        >
                          <Link href={textbook.path}>
                            开始学习
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="max-w-2xl mx-auto p-8 text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-50" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                教材内容即将上线
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                精品教材正在制作中，敬请期待。
              </p>
            </Card>
          )}
          
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/textbooks">
                查看所有教材
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Learning Modules Section */}
      <section id="modules" className={`py-20 bg-gray-50 dark:bg-gray-900 ${getPaddingClasses('horizontal')}`}>
        <div className={getContainerClasses('main')}>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              四大学习板块
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              系统化的学习路径，从理论基础到实践应用，从案例分析到考试指导，
              全面覆盖软件架构师考试要求。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {learningModules.map((module) => {
              const ModuleIcon = module.icon;
              const colorClasses = {
                blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
                green: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
                purple: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
                orange: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
              };
              
              return (
                <Card 
                  key={module.id} 
                  className="p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${colorClasses[module.color as keyof typeof colorClasses]}`}>
                        <ModuleIcon className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {module.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {module.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        包含内容 ({module.count})
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {module.topics.slice(0, 4).map((topic, topicIndex) => (
                        <div key={topicIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <div className="w-2 h-2 bg-current rounded-full mr-3 opacity-60"></div>
                          {topic}
                        </div>
                      ))}
                      {module.topics.length > 4 && (
                        <div className="text-sm text-gray-500 dark:text-gray-500 ml-5">
                          ...还有 {module.topics.length - 4} 个主题
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end">
                    <Button className="px-6">
                      <Link href={module.path}>
                        开始学习
                      </Link>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}