import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/markdown";

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-10 border-b pb-4">
          Nyagrik Blog
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="bg-gray-50 rounded-xl overflow-hidden shadow hover:shadow-md transition-all duration-300"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="relative h-52 w-full">
                  <Image
                    src={post.image || "/images/default.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>

              <div className="p-6">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xl font-semibold text-blue-600 hover:underline"
                >
                  {post.title}
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  {post.date} · {post.readingTime || "3 min read"}
                </p>
                <p className="text-gray-700 mt-3 line-clamp-3">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-block text-blue-600 text-sm hover:underline font-medium"
                >
                  Read more →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
