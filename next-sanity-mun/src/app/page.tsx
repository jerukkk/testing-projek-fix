import { groq } from 'next-sanity';
import { sanityClient } from '@/lib/sanity.client';
import Link from "next/link";
import { urlForImage } from '@/lib/sanity.image';

// Query to fetch latest articles
const LATEST_ARTICLES_QUERY = groq`
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
  } | order(publishedAt desc)[0..2]
`;

// Query to fetch upcoming events
const UPCOMING_EVENTS_QUERY = groq`
  *[_type == "event" && dateTime(startDate) >= dateTime(now())] {
    _id,
    title,
    "slug": slug.current,
    startDate,
    endDate,
    location,
    eventType,
    featuredImage {
      asset->{
        _id,
        url
      },
      alt
    }
  } | order(startDate asc)[0..1]
`;

// Enable Incremental Static Regeneration (ISR)
export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  let latestArticles: any[] = [];
  let upcomingEvents: any[] = [];

  try {
    const results = await Promise.allSettled([
      sanityClient.fetch(LATEST_ARTICLES_QUERY),
      sanityClient.fetch(UPCOMING_EVENTS_QUERY)
    ]);

    if (results[0].status === 'fulfilled') {
      latestArticles = results[0].value;
    } else {
      console.error('Error fetching articles:', results[0].reason);
    }

    if (results[1].status === 'fulfilled') {
      upcomingEvents = results[1].value;
    } else {
      console.error('Error fetching events:', results[1].reason);
    }
  } catch (error) {
    console.error('Error fetching homepage content:', error);
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
            Model United Nations
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
            Empowering students through diplomatic simulation and international relations education
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/articles"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
            >
              Latest News
            </Link>
            <Link
              href="/events"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
            >
              Upcoming Events
            </Link>
            <Link
              href="/members"
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
            >
              Our Team
            </Link>
          </div>
        </section>

        {/* Featured Content Preview */}
        <section className="py-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Latest Articles</h2>
            <Link
              href="/articles"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All Articles →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestArticles.length > 0 ? (
              latestArticles.map((article: any) => (
                <div 
                  key={article._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                >
                  {article.mainImage && (
                    <div className="h-48 overflow-hidden rounded mb-4">
                      <img
                        src={urlForImage(article.mainImage).width(600).height(400).url()}
                        alt={article.mainImage.alt || article.title}
                        className="w-full h-full object-cover"
                        width={600}
                        height={400}
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                  {article.excerpt && (
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                  )}
                  <Link href={`/articles/${article.slug}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                    Read more →
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">No articles available at the moment.</p>
              </div>
            )}
          </div>
        </section>

        <section className="py-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Upcoming Events</h2>
            <Link
              href="/events"
              className="text-green-600 dark:text-green-400 hover:underline"
            >
              View All Events →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event: any) => (
                <div 
                  key={event._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                >
                  <div className="flex items-center mb-4">
                    {event.eventType && (
                      <div className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mr-3 uppercase">
                        {event.eventType}
                      </div>
                    )}
                    <span className="text-gray-600 dark:text-gray-400">
                      {new Date(event.startDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {event.location || 'Location TBD'}
                  </p>
                  <Link href={`/events/${event.slug}`} className="text-green-600 dark:text-green-400 hover:underline">
                    Learn more →
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">No upcoming events at the moment.</p>
              </div>
            )}
          </div>
        </section>

        {/* About Section */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">About Our Organization</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Our Model United Nations organization brings together students from around the world to simulate
              the debates and decision-making processes of the actual United Nations. Through these simulations,
              participants develop critical thinking, public speaking, and negotiation skills while learning about
              international relations and global issues.
            </p>
            <Link
              href="/about"
              className="inline-block bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
            >
              Learn More About Us
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
