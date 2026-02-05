import { PortableTextComponents } from '@portabletext/react';
import { urlForImage } from '@/lib/sanity.image';
import Image from 'next/image';
import { SanityImageWithUrl } from '@/types/sanity';

// Define custom components for Portable Text
export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return <></>;
      }
      
      const imageUrl = urlForImage(value).width(800).height(600).url();
      
      return (
        <div className="my-8">
          <Image
            src={imageUrl}
            alt={value.alt || ''}
            width={800}
            height={600}
            className="w-full h-auto rounded-lg shadow-md"
          />
          {value.caption && (
            <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-2">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
  },
  block: {
    h1: ({ children }) => <h1 className="text-3xl font-bold my-6">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-bold my-5">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-bold my-4">{children}</h3>,
    h4: ({ children }) => <h4 className="text-lg font-bold my-3">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 italic my-6 text-gray-700 dark:text-gray-300">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    code: ({ children }) => (
      <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href = value?.href || '';
      return (
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline"
        >
          {children}
        </a>
      );
    },
  },
};