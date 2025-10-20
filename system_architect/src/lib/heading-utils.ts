/**
 * 统一的标题ID生成工具
 * 确保目录解析和DOM渲染使用完全一致的ID生成逻辑
 */

export interface HeadingInfo {
  id: string;
  text: string;
  level: number;
  index: number;
}

/**
 * 生成标题ID的统一函数
 * @param text 标题文本
 * @param level 标题级别 (1-6)
 * @param index 在文档中的索引位置
 * @returns 生成的唯一ID
 */
export function generateHeadingId(text: string, level: number, index: number): string {
  if (!text.trim()) {
    return `heading-h${level}-${index}`;
  }
  
  const baseId = text
    .trim()
    .toLowerCase()
    .replace(/[^\u4e00-\u9fa5a-z0-9\s]/g, '') // 保留中文、英文、数字和空格
    .replace(/\s+/g, '-') // 空格转换为连字符
    .replace(/-+/g, '-') // 多个连字符合并为一个
    .replace(/^-|-$/g, ''); // 去除首尾连字符
  
  return baseId || `heading-h${level}-${index}`;
}

/**
 * 从Markdown内容中解析标题结构
 * @param content Markdown内容
 * @returns 标题信息数组
 */
export function parseHeadingsFromMarkdown(content: string): HeadingInfo[] {
  const lines = content.split('\n');
  const headings: HeadingInfo[] = [];
  let globalIndex = 0;
  
  lines.forEach((line, lineIndex) => {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = generateHeadingId(text, level, globalIndex);
      
      headings.push({
        id,
        text,
        level,
        index: globalIndex
      });
      
      globalIndex++;
    }
  });
  
  return headings;
}