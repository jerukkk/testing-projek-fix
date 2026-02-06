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
    position,
    bio,
    email,
    socialLinks,
    photo {
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {members.map((member: any) => (
              <div
                key={member._id}
                className="bg-gray-50 rounded-lg shadow-sm overflow-hidden flex flex-col h-[500px]"
              >
                {/* Profile Image - Top portion */}
                <div className="relative flex-shrink-0 h-2/3 overflow-hidden">
                  {member.photo && (
                    <img
                      src={urlForImage(member.photo).width(400).height(500).url()}
                      alt={member.photo.alt || member.name}
                      className="w-full h-full object-cover"
                      width={400}
                      height={500}
                    />
                  )}
                  {!member.photo && (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Photo</span>
                    </div>
                  )}
                </div>

                {/* Name and Role - Middle portion */}
                <div className="p-4 flex-grow flex flex-col">
                  <h2 className="text-lg font-semibold mb-1 text-gray-900 text-center">{member.name}</h2>
                  <p className="text-gray-600 mb-3 text-center">{member.position}</p>
                  
                  {/* Social Media Icons - Bottom portion */}
                  {member.socialLinks && member.socialLinks.length > 0 && (
                    <div className="mt-auto flex justify-center space-x-4">
                      {member.socialLinks.map((social: any, index: number) => (
                        <a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 transition duration-300"
                          title={social.platform}
                        >
                          {social.platform.toLowerCase().includes('linkedin') ? (
                            <div className="w-6 h-6 flex items-center justify-center">
                              <img 
                                src="/icons/linkedin-icon.jpg" 
                                alt="LinkedIn" 
                                width={24} 
                                height={24}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ) : social.platform.toLowerCase().includes('instagram') ? (
                            <div className="w-6 h-6 flex items-center justify-center">
                              <img 
                                src="/icons/instagram-icon" 
                                alt="Instagram" 
                                width={24} 
                                height={24}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-6 h-6 flex items-center justify-center">
                              {social.platform.charAt(0).toUpperCase()}
                            </div>
                          )}
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