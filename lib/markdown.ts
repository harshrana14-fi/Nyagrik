import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import { rehype } from 'rehype';
import rehypePrism from 'rehype-prism-plus';
import rehypeStringify from 'rehype-stringify';

export async function markdownToHtml(markdown: string): Promise<string> {
  try {
    const result = await remark()
      .use(remarkGfm)
      .use(html, { sanitize: false })
      .process(markdown);

    const enhancedResult = await rehype()
      .use(rehypePrism, {
        ignoreMissing: true,
        showLineNumbers: true,
        defaultLanguage: 'text',
      })
      .use(rehypeStringify)
      .process(result.toString());

    return enhancedResult.toString();
  } catch (error) {
    console.error('Error converting markdown to HTML:', error);
    const basicResult = await remark()
      .use(remarkGfm)
      .use(html, { sanitize: false })
      .process(markdown);

    return basicResult.toString();
  }
}

// ✅ Reading Time
export function getReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

// ✅ Excerpt Generator
export function getExcerpt(content: string, maxLength: number = 150): string {
  const cleanContent = content
    .replace(/#+\s/g, '') // Remove headings
    .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
    .replace(/\*(.*?)\*/g, '$1') // Italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1') // Inline code
    .replace(/```[\s\S]*?```/g, '') // Code blocks
    .replace(/\n/g, ' ') // Newlines to space
    .trim();

  if (cleanContent.length <= maxLength) return cleanContent;
  return cleanContent.substring(0, maxLength).trim() + '...';
}

// ✅ Slugify
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ✅ Format Date
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ✅ Frontmatter Interface
interface FrontMatterData {
  title?: string;
  date?: string;
  excerpt?: string;
  author?: string;
  tags?: string[] | string;
  [key: string]: unknown;
}

// ✅ Validate Frontmatter
export function validateFrontMatter(frontMatter: FrontMatterData): {
  title: string;
  date: string;
  excerpt?: string;
  author?: string;
  tags?: string[];
} {
  return {
    title: frontMatter.title || 'Untitled',
    date: frontMatter.date || new Date().toISOString().split('T')[0],
    excerpt: frontMatter.excerpt,
    author: frontMatter.author,
    tags: Array.isArray(frontMatter.tags)
      ? frontMatter.tags
      : typeof frontMatter.tags === 'string'
      ? [frontMatter.tags]
      : [],
  };
}
