import { groq } from 'next-sanity';
import { sanityClient } from '@/lib/sanity.client';
import { Member } from '@/types/sanity';
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

// Query to fetch all members
const ALL_MEMBERS_QUERY = groq`
  *[_type == "member"] | order(name asc) {
    _id,
    name,
    position,
    country,
    bio[],
    photo {
      asset->{
        _id,
        url
      },
      alt
    },
    email,
    socialLinks[]
  }
`;

export default async function MembersPage() {
  const members: Member[] = await sanityClient.fetch(ALL_MEMBERS_QUERY);

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Our Team</h1>
      
      {members.length === 0 ? (
        <p className="text-lg">No members found. Please add some members in Sanity Studio.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member) => (
            <div 
              key={member._id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  {member.photo && (
                    <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                      <img 
                        src={urlForImage(member.photo).width(100).height(100).url()} 
                        alt={member.photo.alt || member.name}
                        className="w-full h-full object-cover"
                        width={100}
                        height={100}
                      />
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold">{member.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{member.position}</p>
                    {member.country && (
                      <p className="text-sm text-gray-500 dark:text-gray-500">{member.country}</p>
                    )}
                  </div>
                </div>
                
                {member.bio && member.bio.length > 0 && (
                  <div className="mb-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      {extractPlainTextFromPortableText(member.bio).substring(0, 150) + '...'}
                    </p>
                  </div>
                )}
                
                {member.email && (
                  <div className="mb-2">
                    <a 
                      href={`mailto:${member.email}`} 
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      {member.email}
                    </a>
                  </div>
                )}
                
                {member.socialLinks && member.socialLinks.length > 0 && (
                  <div className="flex space-x-3">
                    {member.socialLinks.map((link, index) => (
                      <a 
                        key={index}
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        title={link.platform}
                      >
                        {link.platform}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}