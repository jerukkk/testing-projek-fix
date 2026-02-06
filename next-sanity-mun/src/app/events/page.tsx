import { groq } from 'next-sanity';
import { sanityClient } from '@/lib/sanity.client';
import Link from 'next/link';
import { urlForImage } from '@/lib/sanity.image';
import { PortableText } from '@portabletext/react';

// Define how to render PortableText blocks
const portableTextComponents = {
  block: {
    normal: ({ children }: any) => <p className="text-gray-600 text-sm line-clamp-2 mb-2">{children}</p>,
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc pl-5 text-gray-600 text-sm mb-2">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal pl-5 text-gray-600 text-sm mb-2">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li className="mb-1">{children}</li>,
    number: ({ children }: any) => <li className="mb-1">{children}</li>,
  },
};

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
    description,
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
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">Upcoming Events</h1>
        
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event: any) => (
              <div
                key={event._id}
                className="bg-gray-50 rounded-lg shadow-sm overflow-hidden"
              >
                {event.featuredImage && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={urlForImage(event.featuredImage).width(600).height(400).url()}
                      alt={event.featuredImage.alt || event.title}
                      className="w-full h-full object-cover"
                      width={600}
                      height={400}
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    {event.eventType && (
                      <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-3 uppercase">
                        {event.eventType}
                      </div>
                    )}
                    <span className="text-sm text-gray-600">
                      {new Date(event.startDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                      {event.endDate && event.endDate !== event.startDate && (
                        <> - {new Date(event.endDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}</>
                      )}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold mb-2 text-gray-900">
                    <Link href={`/events/${event.slug}`} className="hover:underline">
                      {event.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-2">
                    {event.location || 'Location TBD'}
                  </p>
                  {event.description && Array.isArray(event.description) && (
                    <PortableText value={event.description} components={portableTextComponents} />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">No Events Scheduled</h2>
              <p className="text-gray-600 mb-6">
                Our events calendar is currently empty. Stay tuned for exciting Model United Nations conferences, workshops, and networking events.
              </p>
              <Link 
                href="/" 
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
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