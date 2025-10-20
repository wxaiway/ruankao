import { readdir, readFile, stat } from 'fs/promises';
import { join, extname, basename } from 'path';
import matter from 'gray-matter';
import { platformConfig } from '@/config/platform.config';
import { generateEnglishSlug, getChapterTitle, slugToChapterMapping } from '@/config/slug-mapping';
import { getCurrentYear, isValidYear, getYearConfig } from '@/config/years';

// 材料元数据类型
export interface MaterialMetadata {
  title?: string;
  description?: string;
  author?: string;
  date?: string;
  tags?: string[];
  difficulty?: 'basic' | 'intermediate' | 'advanced';
  estimatedMinutes?: number;
  [key: string]: any;
}

// 材料类型配置
export interface MaterialTypeConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  defaultFormat: 'markdown' | 'ppt' | 'quiz';
  filePattern?: string;
  priority: number;
}

// 章节元数据类型
export interface ChapterMetadata {
  status?: 'draft' | 'published' | 'archived';
  estimatedMinutes?: number;
  difficulty?: 'basic' | 'intermediate' | 'advanced';
  tags?: string[];
  lastUpdated?: string;
  [key: string]: any;
}

// 分类元数据类型
export interface CategoryMetadata {
  order?: number;
  description?: string;
  lastUpdated?: string;
  [key: string]: any;
}

// 内容系统类型定义
export interface Material {
  id: string;
  filename: string;
  title: string;
  type: string;
  format: 'markdown' | 'ppt' | 'quiz';
  content: string;
  metadata: MaterialMetadata;
  path: string;
  materialType?: MaterialTypeConfig;
}

export interface Chapter {
  id: string;
  title: string;
  description?: string;
  materials: Material[];
  metadata: ChapterMetadata;
  path: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  chapters: Chapter[];
  metadata: CategoryMetadata;
  path: string;
  slug: string;
  year?: number;
}

const contentRoot = join(process.cwd(), 'content');

// Year-aware content path helpers
function getYearContentPath(year: number = getCurrentYear()): string {
  return join(contentRoot, year.toString());
}

// Utility functions
function generateSlug(text: string): string {
  return generateEnglishSlug(text);
}

function extractTitleFromDirName(dirName: string): string {
  // 尝试从映射中获取中文标题
  const title = getChapterTitle(generateEnglishSlug(dirName));
  return title || dirName.replace(/^\d+-/, '').replace(/-/g, ' ');
}

function extractTitleFromFilename(filename: string): string {
  const name = basename(filename, '.md');
  const typeMap: Record<string, string> = {
    'lecture': '基础讲义',
    'textbook': '精编教材',
    'notes': '速记卡片',
    'guide': '冲刺宝典'
  };
  return typeMap[name] || name.replace(/-/g, ' ');
}

function getMaterialType(materialId: string): MaterialTypeConfig {
  const types = platformConfig.defaultMaterialTypes as MaterialTypeConfig[];
  
  // 特殊处理 index.md 文件
  if (materialId === 'index') {
    return types.find(t => t.id === 'overview') || types[0];
  }
  
  // 根据文件名匹配类型
  const type = types.find(t => t.filePattern && materialId.includes(t.filePattern.replace('.md', '')));
  return type || types.find(t => t.id === 'textbook') || types[0];
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

// Main content loading functions - now year-aware
export async function getCategories(year: number = getCurrentYear()): Promise<Category[]> {
  if (!isValidYear(year)) {
    year = getCurrentYear();
  }

  const categories: Category[] = [];
  const yearContentPath = getYearContentPath(year);
  
  // Check if year directory exists
  const yearExists = await pathExists(yearContentPath);
  if (!yearExists) {
    return [];
  }
  
  for (const categoryConfig of platformConfig.categories) {
    try {
      const categoryPath = join(yearContentPath, categoryConfig.contentDir);
      const categoryExists = await pathExists(categoryPath);
      
      if (!categoryExists) {
        continue;
      }

      const chapters = await getChaptersForCategory(categoryConfig.id, year);
      
      const category: Category = {
        id: categoryConfig.id,
        name: categoryConfig.name,
        description: categoryConfig.description,
        chapters,
        metadata: {},
        path: categoryConfig.path,
        slug: categoryConfig.slug,
        year
      };
      
      categories.push(category);
    } catch (error) {
      console.error(`Error scanning category ${categoryConfig.id}:`, error);
    }
  }
  
  return categories;
}

export async function getChaptersForCategory(categoryId: string, year: number = getCurrentYear()): Promise<Chapter[]> {
  const categoryConfig = platformConfig.categories.find(c => c.id === categoryId);
  if (!categoryConfig) {
    throw new Error(`Category not found: ${categoryId}`);
  }

  const yearContentPath = getYearContentPath(year);
  const categoryPath = join(yearContentPath, categoryConfig.contentDir);
  const chapters: Chapter[] = [];
  
  try {
    const entries = await readdir(categoryPath, { withFileTypes: true });
    const chapterDirs = entries.filter(entry => entry.isDirectory() && !entry.name.startsWith('.'));
    
    for (const chapterDir of chapterDirs) {
      try {
        const chapterPath = join(categoryPath, chapterDir.name);
        const materials = await getMaterialsForChapter(categoryId, chapterDir.name, year);
        
        const slug = generateSlug(chapterDir.name);
        
        const chapter: Chapter = {
          id: chapterDir.name,
          title: extractTitleFromDirName(chapterDir.name),
          description: undefined,
          materials,
          metadata: {},
          path: `${categoryConfig.path}/${slug}`,
          slug
        };
        
        chapters.push(chapter);
      } catch (error) {
        console.error(`Error scanning chapter ${chapterDir.name}:`, error);
      }
    }
    
    // Sort chapters by name
    chapters.sort((a, b) => a.id.localeCompare(b.id));
    
  } catch (error) {
    console.error(`Error reading category directory: ${categoryPath}`, error);
  }
  
  return chapters;
}

export async function getMaterialsForChapter(categoryId: string, chapterId: string, year: number = getCurrentYear()): Promise<Material[]> {
  const categoryConfig = platformConfig.categories.find(c => c.id === categoryId);
  if (!categoryConfig) {
    throw new Error(`Category not found: ${categoryId}`);
  }

  const yearContentPath = getYearContentPath(year);
  const chapterPath = join(yearContentPath, categoryConfig.contentDir, chapterId);
  const materials: Material[] = [];
  
  try {
    const entries = await readdir(chapterPath, { withFileTypes: true });
    const materialFiles = entries.filter(entry => 
      entry.isFile() && 
      extname(entry.name) === '.md' && 
      !entry.name.startsWith('_') &&
      !entry.name.startsWith('.')
    );
    
    for (const materialFile of materialFiles) {
      try {
        const materialPath = join(chapterPath, materialFile.name);
        const fileContent = await readFile(materialPath, 'utf-8');
        const { data: frontmatter, content } = matter(fileContent);
        
        const filename = materialFile.name;
        const materialId = basename(filename, '.md');
        const materialType = getMaterialType(materialId);
        
        const material: Material = {
          id: materialId,
          filename,
          title: frontmatter.title || extractTitleFromFilename(filename),
          type: materialType.name,
          format: materialType.defaultFormat,
          content,
          metadata: frontmatter,
          path: `${categoryConfig.path}/${generateSlug(chapterId)}/${materialId}`,
          materialType // 保存材料类型信息用于排序
        };
        
        materials.push(material);
      } catch (error) {
        console.error(`Error processing material ${materialFile.name}:`, error);
      }
    }
    
  } catch (error) {
    console.error(`Error reading chapter directory: ${chapterPath}`, error);
  }
  
  // 按照priority排序，章节简介（index.md）默认显示在第一位
  materials.sort((a, b) => {
    const priorityA = a.materialType?.priority ?? 999;
    const priorityB = b.materialType?.priority ?? 999;
    return priorityA - priorityB;
  });
  
  return materials;
}

export async function getCategoryBySlug(slug: string, year: number = getCurrentYear()): Promise<Category | null> {
  try {
    const categories = await getCategories(year);
    return categories.find(c => c.slug === slug) || null;
  } catch {
    return null;
  }
}

export async function getChapterByPath(categorySlug: string, chapterSlug: string, year: number = getCurrentYear()): Promise<Chapter | null> {
  try {
    const category = await getCategoryBySlug(categorySlug, year);
    if (!category) return null;
    
    // 支持英文slug查找
    const chapter = category.chapters.find(ch => ch.slug === chapterSlug);
    return chapter || null;
  } catch {
    return null;
  }
}

export async function getMaterialByPath(categorySlug: string, chapterSlug: string, materialId: string, year: number = getCurrentYear()): Promise<Material | null> {
  try {
    const chapter = await getChapterByPath(categorySlug, chapterSlug, year);
    if (!chapter) return null;
    
    const material = chapter.materials.find(m => m.id === materialId);
    return material || null;
  } catch {
    return null;
  }
}

// 教材相关类型定义
export interface TextbookMetadata {
  id: string;
  title: string;
  description: string;
  author?: string;
  estimatedHours?: number;
  totalChapters?: number;
  difficulty?: string;
  tags?: string[];
  version?: string;
  publishDate?: string;
  coverImage?: string;
  sections?: {
    id: string;
    title: string;
    chapters: string[];
  }[];
}

export interface Textbook {
  id: string;
  title: string;
  description: string;
  metadata: TextbookMetadata;
  content: string;
  path: string;
  slug: string;
}

// 教材相关功能
export async function getTextbooks(year: number = getCurrentYear()): Promise<Textbook[]> {
  const textbooks: Textbook[] = [];
  const textbooksPath = join(getYearContentPath(year), '05-精品教材');
  
  try {
    const exists = await pathExists(textbooksPath);
    if (!exists) return textbooks;

    const items = await readdir(textbooksPath, { withFileTypes: true });
    
    for (const item of items) {
      if (item.isDirectory()) {
        try {
          const textbook = await loadTextbook(item.name, year);
          if (textbook) {
            textbooks.push(textbook);
          }
        } catch (error) {
          console.error(`Error loading textbook ${item.name}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Error reading textbooks directory:', error);
  }

  return textbooks;
}

async function loadTextbook(dirName: string, year: number): Promise<Textbook | null> {
  const textbookDir = join(getYearContentPath(year), '05-精品教材', dirName);
  const metadataPath = join(textbookDir, 'metadata.json');
  const contentPath = join(textbookDir, 'content.md');

  try {
    // 加载元数据
    let metadata: TextbookMetadata;
    if (await pathExists(metadataPath)) {
      const metadataContent = await readFile(metadataPath, 'utf-8');
      metadata = JSON.parse(metadataContent);
      // 确保id字段存在，如果不存在则生成一个
      if (!metadata.id) {
        metadata.id = generateSlug(dirName);
      }
    } else {
      // 如果没有元数据文件，使用默认值
      metadata = {
        id: generateSlug(dirName),
        title: dirName,
        description: `${dirName}学习教材`
      };
    }

    // 加载内容
    let content = '';
    if (await pathExists(contentPath)) {
      content = await readFile(contentPath, 'utf-8');
    }

    return {
      id: metadata.id,
      title: metadata.title,
      description: metadata.description,
      metadata,
      content,
      path: `/textbooks/${metadata.id}`,
      slug: metadata.id
    };
  } catch (error) {
    console.error(`Error loading textbook ${dirName}:`, error);
    return null;
  }
}

export async function getTextbookBySlug(slug: string, year: number = getCurrentYear()): Promise<Textbook | null> {
  try {
    const textbooks = await getTextbooks(year);
    return textbooks.find(t => t.slug === slug) || null;
  } catch {
    return null;
  }
}