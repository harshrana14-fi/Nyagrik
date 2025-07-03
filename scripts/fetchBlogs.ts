import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";
import slugify from "slugify";

const FORCE = process.argv.includes("--force");
const postsDir = path.join(process.cwd(), "posts");
const imagesDir = path.join(process.cwd(), "public", "images");

if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir);
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

function estimateReadingTime(text: string): string {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

async function saveMarkdownPost({
  title,
  date,
  excerpt,
  imageUrl,
  sections,
  baseSlug = "",
}: {
  title: string;
  date: string;
  excerpt: string;
  imageUrl?: string | null;
  sections: { title: string; content: string }[];
  baseSlug?: string;
}) {
  const slug = baseSlug || slugify(title, { lower: true, strict: true });
  const mdPath = path.join(postsDir, `${slug}.md`);
  if (fs.existsSync(mdPath) && !FORCE) {
    console.log(`⚠️ Skipping existing post: ${slug}.md`);
    return;
  }

  const imageFilename = imageUrl ? slug + path.extname(imageUrl) : "default.jpg";
  if (imageUrl) {
    try {
      const imgRes = await axios.get(imageUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(path.join(imagesDir, imageFilename), imgRes.data);
    } catch {
      console.warn(`⚠️ Failed to download image: ${imageUrl}`);
    }
  }

  const allText = sections.map((s) => s.content).join(" ");
  const readingTime = estimateReadingTime(allText);

  const sectionYaml = sections
    .map(
      (s) => `  - title: "${s.title.replace(/"/g, "'")}"
    content: |
      ${s.content.replace(/\r?\n/g, "\n      ").replace(/"/g, "'")}`
    )
    .join("\n");

  const frontmatter = `---\ntitle: "${title.replace(/"/g, "'")}"
date: "${date}"
excerpt: "${excerpt}"
image: "/images/${imageFilename}"
ogImage: "https://nyay.legal/images/${imageFilename}"
readingTime: "${readingTime}"
sections:
${sectionYaml}
---`;

  const markdownBody = sections.map((s) => `## ${s.title}\n\n${s.content}`).join("\n\n");

  fs.writeFileSync(mdPath, frontmatter + "\n\n" + markdownBody);
  console.log(`✅ Saved: ${slug}.md`);
}

// -------------------- PRS India --------------------

async function fetchFromPRS() {
  const BASE_URL = "https://prsindia.org";
  const res = await axios.get(`${BASE_URL}/theprsblog`);
  const $ = cheerio.load(res.data);
  const links: string[] = [];

  $("h3 a").each((_, el) => {
    const href = $(el).attr("href");
    if (href && !href.startsWith("http")) {
      links.push(BASE_URL + href);
    }
  });

  for (const url of links.slice(0, 5)) {
    try {
      const res = await axios.get(url);
      const $ = cheerio.load(res.data);
      const title = $("meta[property='og:title']").attr("content") || $("h1").text().trim();
      const date = $("meta[property='article:published_time']").attr("content") || new Date().toISOString().split("T")[0];
      const excerpt = $("p").first().text().trim();
      const imageUrl = $(".field-image img").first().attr("src") ? BASE_URL + $(".field-image img").first().attr("src") : null;

      const sections: { title: string; content: string }[] = [];
      $("h2, h3").each((_, el) => {
        const title = $(el).text().trim();
        const contentParts: string[] = [];
        let next = $(el).next();
        while (next.length && !/h2|h3/.test(next[0].tagName)) {
          const text = next.text().trim();
          if (text) contentParts.push(text);
          next = next.next();
        }
        if (title && contentParts.length > 0) {
          sections.push({ title, content: contentParts.join("\n\n") });
        }
      });

      await saveMarkdownPost({ title, date, excerpt, imageUrl, sections });
    } catch (err) {
      console.error(`❌ PRS Error:`, err instanceof Error ? err.message : err);
    }
  }
}

// -------------------- The Leaflet --------------------

async function fetchFromLeaflet() {
  const BASE_URL = "https://theleaflet.in";
  const res = await axios.get(`${BASE_URL}/category/opinion`);
  const $ = cheerio.load(res.data);
  const links: string[] = [];

  $("h2.entry-title a").each((_, el) => {
    const href = $(el).attr("href");
    if (href) links.push(href);
  });

  for (const url of links.slice(0, 5)) {
    try {
      const res = await axios.get(url);
      const $ = cheerio.load(res.data);
      const title = $("meta[property='og:title']").attr("content") || $("h1").text().trim();
      const date = $("meta[property='article:published_time']").attr("content") || new Date().toISOString().split("T")[0];
      const excerpt = $("meta[name='description']").attr("content") || $("p").first().text().trim();
      const imageUrl = $("meta[property='og:image']").attr("content");

      const contentParts: string[] = [];
$(".elementor-widget-container p").each((_, p) => {
  const text = $(p).text().trim();
  if (text) contentParts.push(text);
});
const content = contentParts.join("\n\n") || "Content not available.";
const sections = [{ title: "Main", content }];


      await saveMarkdownPost({ title, date, excerpt, imageUrl, sections });
    } catch (err) {
      console.error(`❌ Leaflet Error:`, err instanceof Error ? err.message : err);
    }
  }
}

// -------------------- SpicyIP --------------------

async function fetchFromSpicyIP() {
  const BASE_URL = "https://spicyip.com";
  const res = await axios.get(BASE_URL);
  const $ = cheerio.load(res.data);
  const links: string[] = [];

  $("h2.entry-title a").each((_, el) => {
    const href = $(el).attr("href");
    if (href) links.push(href);
  });

  for (const url of links.slice(0, 5)) {
    try {
      const res = await axios.get(url);
      const $ = cheerio.load(res.data);
      const title = $("meta[property='og:title']").attr("content") || $("h1").text().trim();
      const date = $("meta[property='article:published_time']").attr("content") || new Date().toISOString().split("T")[0];
      const excerpt = $("meta[name='description']").attr("content") || $("p").first().text().trim();
      const imageUrl = $("meta[property='og:image']").attr("content");

      const contentParts: string[] = [];
$(".entry-content p").each((_, p) => {
  const text = $(p).text().trim();
  if (text) contentParts.push(text);
});
const content = contentParts.join("\n\n") || "Content not available.";
const sections = [{ title: "Main", content }];


      await saveMarkdownPost({ title, date, excerpt, imageUrl, sections });
    } catch (err) {
      console.error(`❌ SpicyIP Error:`, err instanceof Error ? err.message : err);
    }
  }
}

// -------------------- Run All --------------------

async function main() {
  await fetchFromPRS();
  await fetchFromLeaflet();
  await fetchFromSpicyIP();
  console.log("✅ All blog sources scraped.");
}

main().catch(console.error);
