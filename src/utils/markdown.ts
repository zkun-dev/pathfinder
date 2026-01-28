/**
 * Markdown 渲染工具
 */
import { marked } from 'marked';

// 配置 marked
marked.setOptions({
  breaks: true, // 支持 GitHub 风格的换行
  gfm: true, // 启用 GitHub Flavored Markdown
});

/**
 * 将 Markdown 文本转换为 HTML
 */
export function renderMarkdown(content: string): string {
  if (!content) return '';
  
  try {
    // 使用 marked 解析 Markdown
    const html = marked.parse(content) as string;
    
    // 添加自定义样式类
    return html
      .replace(/<h1>/g, '<h1 class="text-3xl font-bold mb-4 mt-6">')
      .replace(/<h2>/g, '<h2 class="text-2xl font-bold mb-4 mt-6">')
      .replace(/<h3>/g, '<h3 class="text-xl font-bold mb-3 mt-5">')
      .replace(/<h4>/g, '<h4 class="text-lg font-bold mb-2 mt-4">')
      .replace(/<h5>/g, '<h5 class="text-base font-bold mb-2 mt-3">')
      .replace(/<h6>/g, '<h6 class="text-sm font-bold mb-2 mt-3">')
      .replace(/<p>/g, '<p class="mb-4 leading-relaxed">')
      .replace(/<ul>/g, '<ul class="list-disc list-inside mb-4 space-y-2">')
      .replace(/<ol>/g, '<ol class="list-decimal list-inside mb-4 space-y-2">')
      .replace(/<li>/g, '<li class="ml-4">')
      .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-4 italic">')
      .replace(/<code>/g, '<code class="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm font-mono">')
      .replace(/<pre>/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4"><code class="text-sm">')
      .replace(/<\/pre>/g, '</code></pre>')
      .replace(/<a /g, '<a class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer" ')
      .replace(/<strong>/g, '<strong class="font-bold">')
      .replace(/<em>/g, '<em class="italic">')
      .replace(/<hr>/g, '<hr class="my-6 border-gray-300 dark:border-gray-600">')
      .replace(/<table>/g, '<table class="w-full border-collapse border border-gray-300 dark:border-gray-600 mb-4">')
      .replace(/<thead>/g, '<thead class="bg-gray-100 dark:bg-gray-800">')
      .replace(/<th>/g, '<th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-bold">')
      .replace(/<td>/g, '<td class="border border-gray-300 dark:border-gray-600 px-4 py-2">')
      .replace(/<img /g, '<img class="max-w-full h-auto rounded-lg my-4" ');
  } catch (error) {
    console.error('Markdown 解析失败:', error);
    // 如果解析失败，返回转义后的原始内容
    return content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  }
}
