import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import { rehype } from 'rehype';
import rehypePrism from 'rehype-prism-plus';
import rehypeStringify from 'rehype-stringify';

export async function markdownToHtml(markdown: string): Promise<string> {
  try {
    // First, convert markdown to HTML using remark
    const result = await remark()
      .use(remarkGfm) // Support for GitHub Flavored Markdown (tables, strikethrough, etc.)
      .use(html, { sanitize: false }) // Convert to HTML without sanitization
      .process(markdown);

    // Then, enhance the HTML with syntax highlighting using rehype
    const enhancedResult = await rehype()
      .use(rehypePrism, {
        ignoreMissing: true,
        showLineNumbers: true,
        defaultLanguage: 'text'
      })
      .use(rehypeStringify)
      .process(result.toString());

    return enhancedResult.toString();
  } catch (error) {
    console.error('Error converting markdown to HTML:', error);
    // Fallback to basic conversion without syntax highlighting
    const basicResult = await remark()
      .use(remarkGfm)
      .use(html, { sanitize: false })
      .process(markdown);
    
    return basicResult.toString();
  }
}

// Helper function to extract reading time from content
export function getReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

// Helper function to extract excerpt from content
export function getExcerpt(content: string, maxLength: number = 150): string {
  // Remove markdown syntax for a cleaner excerpt
  const cleanContent = content
    .replace(/#+\s/g, '') // Remove headings
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
    .replace(/`(.*?)`/g, '$1') // Remove code blocks
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .trim();

  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }

  return cleanContent.substring(0, maxLength).trim() + '...';
}

// Helper function to slugify text (useful for generating slugs from titles)
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper function to format date
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Interface for front matter data
interface FrontMatterData {
  title?: string;
  date?: string;
  excerpt?: string;
  author?: string;
  tags?: string[] | string;
  [key: string]: unknown;
}

// Helper function to validate front matter
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
        : []
  };
}