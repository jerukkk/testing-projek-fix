import { groq } from 'next-sanity';
import { sanityClient } from '@/lib/sanity.client';
import { Article } from '@/types/sanity';
import { urlForImage } from '@/lib/sanity.image';
import { PortableText } from '@portabletext/react';
import { portableTextComponents } from '@/components/PortableTextComponents';

// Define the query to fetch a single article by slug
const ARTICLE_QUERY = groq`
  *[_type == "article" && slug.current == $slug][0]{
    _id,
    _type,
    title,
    slug,
    publishedAt,
    excerpt,
    body,
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    },
    author->{
      _id,
      name,
      "avatar": image.asset->url
    }
  }
`;

// Define the query to fetch all articles for the listing page
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

// Fetch the article data
export async function generateStaticParams() {
  try {
    const articles: any[] = await sanityClient.fetch(ALL_ARTICLES_QUERY);

    return articles.map((article) => ({
      slug: article.slug, // Now it's already a string due to the alias
    }));
  } catch (error) {
    console.error('Error fetching articles for static params:', error);
    return []; // Return empty array if there's an error
  }
}

// Enable Incremental Static Regeneration (ISR)
export const revalidate = 60; // Revalidate every 60 seconds

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let article: any = null;

  try {
    article = await sanityClient.fetch(ARTICLE_QUERY, { slug });
  } catch (error) {
    console.error(`Error fetching article with slug "${slug}":`, error);
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-red-600">Error loading article</h1>
        <p>There was an error loading the article with slug "{slug}".</p>
        <p className="mt-4 text-gray-600">Please check your API configuration and try again later.</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-red-600">Article not found</h1>
        <p>The article with slug "{slug}" could not be found.</p>
      </div>
    );
  }

  return (
    <article className="container mx-auto py-12 px-4 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-4">
          {article.author && (
            <span className="mr-4">
              By {article.author.name}
            </span>
          )}
          {article.publishedAt && (
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          )}
        </div>

        {article.mainImage && (
          <div className="my-6">
            <img
              src={urlForImage(article.mainImage).width(1200).height(630).url()}
              alt={article.mainImage.alt || article.title}
              className="w-full h-auto rounded-lg shadow-lg"
              width={1200}
              height={630}
            />
          </div>
        )}
      </header>

      <section className="prose prose-lg dark:prose-invert max-w-none">
        {article.body && <PortableText value={article.body} components={portableTextComponents} />}
      </section>
    </article>
  );
}