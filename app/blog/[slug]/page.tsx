import { getPostBySlug } from "@/lib/markdown";
import { notFound } from "next/navigation";
import Image from "next/image";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: `${post.title} | Nyagrik Blog`,
    description: post.excerpt || post.title,
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) return notFound();

  return (
    <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900">{post.title}</h1>
          <p className="text-sm text-gray-500 mt-2">
            {post.date} · {post.readingTime || "3 min read"} · By <span className="font-medium">Nyagrik Team</span>
          </p>
        </div>

        {post.image && (
          <div className="relative w-full h-64 rounded-lg overflow-hidden mb-8">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <article
          className="prose prose-lg prose-blue max-w-none"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </div>
    </div>
  );
}
