import { groq } from 'next-sanity';
import { sanityClient } from '@/lib/sanity.client';
import Link from 'next/link';
import { urlForImage } from '@/lib/sanity.image';
import { PortableText } from '@portabletext/react';
import { notFound } from 'next/navigation';

// Define how to render PortableText blocks for excerpts
const portableTextComponents = {
  block: {
    normal: ({ children }: any) => <span>{children}</span>,
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc pl-5">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal pl-5">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li>{children}</li>,
    number: ({ children }: any) => <li>{children}</li>,
  },
};

// Number of articles to show per page in the latest section
const ARTICLES_PER_PAGE = 6;

// Query to fetch all articles for counting total
const TOTAL_ARTICLES_QUERY = groq`
  count(*[_type == "article"])
`;

// Query to fetch articles for a specific page
const ARTICLES_BY_PAGE_QUERY = (start: number, end: number) => groq`
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
  } | order(publishedAt desc)[${start}..${end}]
`;

// Query to fetch all articles for popular section (we'll slice after shuffling)
const POPULAR_ARTICLES_QUERY = groq`
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
export const revalidate = 60; // Revalidate every 60 seconds

interface Props {
  searchParams?: {
    page?: string;
  };
}

export default async function ArticlesPage({ searchParams }: Props) {
  const currentPage = Number(searchParams?.page) || 1;
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const endIndex = startIndex + ARTICLES_PER_PAGE - 1;

  let latestArticles: any[] = [];
  let popularArticles: any[] = [];
  let totalArticles = 0;

  try {
    // Fetch total number of articles
    totalArticles = await sanityClient.fetch(TOTAL_ARTICLES_QUERY);

    // Fetch latest articles for current page
    const latestArticlesQuery = ARTICLES_BY_PAGE_QUERY(startIndex, endIndex);
    latestArticles = await sanityClient.fetch(latestArticlesQuery);

    // Fetch all articles for popular section
    const allArticles = await sanityClient.fetch(POPULAR_ARTICLES_QUERY);
    
    // Randomize all articles for now (until we implement traffic-based sorting)
    const shuffledArticles = allArticles.sort(() => Math.random() - 0.5);
    
    // Get IDs of latest articles to exclude them from popular
    const latestArticleIds = new Set(latestArticles.map((article: any) => article._id));
    
    // Filter out latest articles from all articles to get potential popular articles
    const potentialPopularArticles = shuffledArticles.filter((article: any) => !latestArticleIds.has(article._id));
    
    // Take first few articles as popular (adjust number as needed)
    // If we have articles that are not in the current latest articles, use those
    // Otherwise, just take the first 10 from shuffled (fallback to avoid empty popular section)
    popularArticles = potentialPopularArticles.length > 0 
      ? potentialPopularArticles.slice(0, 10) 
      : shuffledArticles.slice(0, 10);
  } catch (error) {
    console.error('Error fetching articles:', error);
  }

  // Calculate pagination values
  const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);

  // If current page is greater than total pages, show 404
  if (currentPage > totalPages && totalArticles > 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">Latest Articles</h1>

        {(latestArticles.length > 0 || popularArticles.length > 0) ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Latest Articles - 80% width */}
            <div className="lg:w-4/5">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Latest</h2>
                {totalPages > 1 && (
                  <div className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                  </div>
                )}
              </div>
              
              <div className="space-y-8">
                {latestArticles.map((article: any, index: number) => (
                  <div
                    key={article._id}
                    className={`bg-gray-50 rounded-lg shadow-sm overflow-hidden ${index !== latestArticles.length - 1 ? 'mb-6' : ''}`}
                  >
                    {article.mainImage && (
                      <div className="h-64 md:h-80 overflow-hidden">
                        <img
                          src={urlForImage(article.mainImage).width(800).height(600).url()}
                          alt={article.mainImage.alt || article.title}
                          className="w-full h-full object-cover"
                          width={800}
                          height={600}
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h2 className="text-2xl font-semibold mb-3 text-gray-900">
                        <Link href={`/articles/${article.slug}`} className="hover:underline">
                          {article.title}
                        </Link>
                      </h2>
                      {article.excerpt && Array.isArray(article.excerpt) && (
                        <div className="text-gray-600 mb-4">
                          <PortableText value={article.excerpt} components={portableTextComponents} />
                        </div>
                      )}
                      {!Array.isArray(article.excerpt) && article.excerpt && (
                        <p className="text-gray-600 mb-4">
                          {article.excerpt}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        {new Date(article.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12 space-x-2">
                  {currentPage > 1 && (
                    <Link
                      href={`/articles?page=${currentPage - 1}`}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300"
                    >
                      Previous
                    </Link>
                  )}

                  {/* Show page numbers with ellipsis for large page counts */}
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      // Show all pages if total is 5 or less
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      // Show first 4 pages and last page
                      if (i < 4) pageNum = i + 1;
                      else if (i === 4) pageNum = totalPages;
                    } else if (currentPage >= totalPages - 2) {
                      // Show last 4 pages and first page
                      if (i === 0) pageNum = 1;
                      else pageNum = totalPages - 4 + i;
                    } else {
                      // Show current page with 2 on each side and first/last pages
                      if (i === 0) pageNum = 1;
                      else if (i === 4) pageNum = totalPages;
                      else pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Link
                        key={pageNum}
                        href={`/articles?page=${pageNum}`}
                        className={`px-4 py-2 rounded-lg transition duration-300 ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                      >
                        {pageNum}
                      </Link>
                    );
                  }).filter((_, i, arr) => {
                    // Filter out ellipsis placeholders (represented as null elements)
                    return arr[i] !== null;
                  })}

                  {currentPage < totalPages && (
                    <Link
                      href={`/articles?page=${currentPage + 1}`}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300"
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Popular Articles - 20% width */}
            <div className="lg:w-1/5">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2">Popular</h2>
              <div className="space-y-6">
                {popularArticles.map((article: any) => (
                  <div
                    key={article._id}
                    className="bg-gray-50 rounded-lg shadow-sm overflow-hidden"
                  >
                    {article.mainImage && (
                      <div className="h-32 overflow-hidden">
                        <img
                          src={urlForImage(article.mainImage).width(400).height(300).url()}
                          alt={article.mainImage.alt || article.title}
                          className="w-full h-full object-cover"
                          width={400}
                          height={300}
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 line-clamp-2">
                        <Link href={`/articles/${article.slug}`} className="hover:underline">
                          {article.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-gray-500">
                        {new Date(article.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">No Articles Yet</h2>
              <p className="text-gray-600 mb-6">
                Our articles section is currently empty. Check back later for the latest news and updates from our Model United Nations community.
              </p>
              <Link
                href="/"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
              >
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}