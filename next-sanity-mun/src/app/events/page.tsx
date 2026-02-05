import { groq } from 'next-sanity';
import { sanityClient } from '@/lib/sanity.client';
import { Event } from '@/types/sanity';
import Link from 'next/link';
import { urlForImage } from '@/lib/sanity.image';

// Helper function to extract plain text from PortableText
function extractPlainTextFromPortableText(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return '';
  
  return blocks
    .map((block: any) => {
      if (block._type === 'block' && block.children) {
        return block.children.map((child: any) => child.text || '').join('');
      }
      return '';
    })
    .join(' ')
    .trim();
}

// Query to fetch all events
const ALL_EVENTS_QUERY = groq`
  *[_type == "event"] {
    _id,
    title,
    "slug": slug.current,
    startDate,
    endDate,
    location,
    eventType,
    description[],
    featuredImage {
      asset->{
        _id,
        url
      },
      alt
    }
  } | order(startDate asc)
`;

// Enable Incremental Static Regeneration (ISR)
export const revalidate = 60; // Revalidate every 60 seconds

export default async function EventsPage() {
  let events: any[] = [];
  
  try {
    events = await sanityClient.fetch(ALL_EVENTS_QUERY);
  } catch (error) {
    console.error('Error fetching events:', error);
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8">Upcoming Events</h1>
        <p className="text-lg text-red-600">Error loading events. Please check your connection and API configuration.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Upcoming Events</h1>

      {events.length === 0 ? (
        <p className="text-lg">No events found. Please add some events in Sanity Studio.</p>
      ) : (
        <div className="space-y-10">
          {events.map((event) => (
            <article
              key={event._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="md:flex">
                {event.featuredImage && (
                  <div className="md:w-1/3">
                    <img
                      src={urlForImage(event.featuredImage).width(400).height(300).url()}
                      alt={event.featuredImage.alt || event.title}
                      className="w-full h-64 md:h-full object-cover"
                      width={400}
                      height={300}
                    />
                  </div>
                )}

                <div className={`p-6 ${event.featuredImage ? 'md:w-2/3' : 'w-full'}`}>
                  <div className="flex flex-wrap items-center mb-3">
                    <h2 className="text-2xl font-bold mr-4">
                      <Link
                        href={`/events/${event.slug}`}
                        className="hover:underline"
                      >
                        {event.title}
                      </Link>
                    </h2>

                    {event.eventType && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase tracking-wide">
                        {event.eventType}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span>
                      {new Date(event.startDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                      {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}`}
                    </span>
                  </div>

                  {event.location && (
                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-4">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span>{event.location}</span>
                    </div>
                  )}

                  {event.description && event.description.length > 0 && (
                    <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                      {/* Extract text from PortableText array for preview */}
                      {extractPlainTextFromPortableText(event.description).substring(0, 150) + '...'}
                    </p>
                  )}

                  <Link
                    href={`/events/${event.slug}`}
                    className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center"
                  >
                    View details
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}