// lib/markdown.ts

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

export async function getAllPosts() {
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt || "",
      image: data.image || null,
      readingTime: data.readingTime || null,
      ogImage: data.ogImage || null,
    };
  });

  const featuredSlugs = [
    "rape-laws-and-womens-rights-in-india",
    "divorce-law-in-india",
    "constitutional-law-in-india",
    "criminal-law-in-india",
  ];

  const featuredPosts = posts.filter((post) => featuredSlugs.includes(post.slug));
  const otherPosts = posts.filter((post) => !featuredSlugs.includes(post.slug));

  return [...featuredPosts, ...otherPosts];
}

export async function getPostBySlug(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const processedContent = await remark().use(html).process(content);

  return {
    slug,
    contentHtml: processedContent.toString(),
    title: data.title,
    date: data.date,
    excerpt: data.excerpt || "",
    image: data.image || null,
    readingTime: data.readingTime || null,
    ogImage: data.ogImage || null,
    sections: data.sections || [],
  };
}
