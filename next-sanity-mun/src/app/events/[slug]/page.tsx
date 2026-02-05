import { groq } from 'next-sanity';
import { sanityClient } from '@/lib/sanity.client';
import { Event } from '@/types/sanity';
import { urlForImage } from '@/lib/sanity.image';
import { PortableText } from '@portabletext/react';
import { portableTextComponents } from '@/components/PortableTextComponents';

// Define the query to fetch a single event by slug
const EVENT_QUERY = groq`
  *[_type == "event" && slug.current == $slug][0]{
    _id,
    _type,
    title,
    slug,
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
  }
`;

// Define the query to fetch all events for the listing page
const ALL_EVENTS_QUERY = groq`
  *[_type == "event"] {
    _id,
    title,
    "slug": slug.current,
    startDate
  } | order(startDate asc)
`;

// Fetch the event data
export async function generateStaticParams() {
  try {
    const events: any[] = await sanityClient.fetch(ALL_EVENTS_QUERY);

    return events.map((event) => ({
      slug: event.slug, // Now it's already a string due to the alias
    }));
  } catch (error) {
    console.error('Error fetching events for static params:', error);
    return []; // Return empty array if there's an error
  }
}

// Enable Incremental Static Regeneration (ISR)
export const revalidate = 60; // Revalidate every 60 seconds

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let event: any = null;

  try {
    event = await sanityClient.fetch(EVENT_QUERY, { slug });
  } catch (error) {
    console.error(`Error fetching event with slug "${slug}":`, error);
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-red-600">Error loading event</h1>
        <p>There was an error loading the event with slug "{slug}".</p>
        <p className="mt-4 text-gray-600">Please check your API configuration and try again later.</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-red-600">Event not found</h1>
        <p>The event with slug "{slug}" could not be found.</p>
      </div>
    );
  }

  return (
    <article className="container mx-auto py-12 px-4 max-w-4xl">
      <header className="mb-8">
        <div className="flex flex-wrap items-center mb-4">
          <h1 className="text-4xl font-bold mr-4">{event.title}</h1>

          {event.eventType && (
            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full uppercase tracking-wide">
              {event.eventType}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-6 text-gray-600 dark:text-gray-400 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span>
              {new Date(event.startDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}`}
            </span>
          </div>

          {event.location && (
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>{event.location}</span>
            </div>
          )}
        </div>

        {event.featuredImage && (
          <div className="my-6">
            <img
              src={urlForImage(event.featuredImage).width(1200).height(630).url()}
              alt={event.featuredImage.alt || event.title}
              className="w-full h-auto rounded-lg shadow-lg"
              width={1200}
              height={630}
            />
          </div>
        )}
      </header>

      <section className="prose prose-lg dark:prose-invert max-w-none">
        {event.description && <PortableText value={event.description} components={portableTextComponents} />}
      </section>
    </article>
  );
}