import { groq } from 'next-sanity';
import { sanityClient } from '@/lib/sanity.client';
import Link from 'next/link';
import { urlForImage } from '@/lib/sanity.image';
import { PortableText } from '@portabletext/react';

// Define how to render PortableText blocks for bios
const portableTextComponents = {
  block: {
    normal: ({ children }: any) => <span className="text-gray-600 text-sm">{children}</span>,
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc pl-5 text-gray-600 text-sm">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal pl-5 text-gray-600 text-sm">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li>{children}</li>,
    number: ({ children }: any) => <li>{children}</li>,
  },
};

// Query to fetch all members
const ALL_MEMBERS_QUERY = groq`
  *[_type == "member"] {
    _id,
    name,
    role,
    bio,
    email,
    socialLinks,
    profileImage {
      asset->{
        _id,
        url
      },
      alt
    }
  } | order(name asc)
`;

// Enable Incremental Static Regeneration (ISR)
export const revalidate = 60; // Revalidate every 60 seconds

export default async function MembersPage() {
  let members: any[] = [];

  try {
    members = await sanityClient.fetch(ALL_MEMBERS_QUERY);
  } catch (error) {
    console.error('Error fetching members:', error);
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">Our Team</h1>
        
        {members.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member: any) => (
              <div
                key={member._id}
                className="bg-gray-50 rounded-lg shadow-sm overflow-hidden"
              >
                {member.profileImage && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={urlForImage(member.profileImage).width(400).height(400).url()}
                      alt={member.profileImage.alt || member.name}
                      className="w-full h-full object-cover"
                      width={400}
                      height={400}
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-1 text-gray-900">{member.name}</h2>
                  <p className="text-gray-600 mb-3">{member.role}</p>
                  {member.bio && Array.isArray(member.bio) && (
                    <div className="text-gray-600 text-sm mb-4 line-clamp-3">
                      <PortableText value={member.bio} components={portableTextComponents} />
                    </div>
                  )}
                  {!Array.isArray(member.bio) && member.bio && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {member.bio}
                    </p>
                  )}
                  {member.email && (
                    <p className="text-gray-600 text-sm mb-2">
                      <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">
                        {member.email}
                      </a>
                    </p>
                  )}
                  {member.socialLinks && member.socialLinks.length > 0 && (
                    <div className="flex space-x-3">
                      {member.socialLinks.map((social: any, index: number) => (
                        <a 
                          key={index}
                          href={social.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          {social.platform}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Team Members Unavailable</h2>
              <p className="text-gray-600 mb-6">
                Meet our dedicated team of organizers, coordinators, and volunteers who make our Model United Nations events possible.
              </p>
              <Link 
                href="/" 
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
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