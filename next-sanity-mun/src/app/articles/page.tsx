import { groq } from 'next-sanity';
import { sanityClient } from '@/lib/sanity.client';
import { Article } from '@/types/sanity';
import Link from 'next/link';
import { urlForImage } from '@/lib/sanity.image';

// Query to fetch all articles
const ALL_ARTICLES_QUERY = groq`
  *[_type == "article"] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    }
  } | order(publishedAt desc)
`;

// Enable Incremental Static Regeneration (ISR)
export const revalidate = 30; // Revalidate every 30 seconds for faster updates

export default async function ArticlesPage() {
  let articles: any[] = [];
  
  try {
    articles = await sanityClient.fetch(ALL_ARTICLES_QUERY);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8">Latest Articles</h1>
        <p className="text-lg text-red-600">Error loading articles. Please check your connection and API configuration.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Latest Articles</h1>

      {articles.length === 0 ? (
        <p className="text-lg">No articles found. Please add some content in Sanity Studio.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article
              key={article._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {article.mainImage && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={urlForImage(article.mainImage).width(600).height(400).url()}
                    alt={article.mainImage.alt || article.title}
                    className="w-full h-full object-cover"
                    width={600}
                    height={400}
                  />
                </div>
              )}

              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">
                  <Link
                    href={`/articles/${article.slug}`}
                    className="hover:underline"
                  >
                    {article.title}
                  </Link>
                </h2>

                {article.publishedAt && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {new Date(article.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                )}

                {article.excerpt && (
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {article.excerpt}
                  </p>
                )}

                <Link
                  href={`/articles/${article.slug}`}
                  className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}