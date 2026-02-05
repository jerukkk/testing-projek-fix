// Basic types for Sanity content
export interface SanityImage {
  _type: string;
  asset: {
    _ref: string;
    _type: string;
  };
  alt?: string;
}

export interface SanityImageWithUrl {
  asset: {
    _id: string;
    url: string;
  };
  alt?: string;
}

export interface SanityBlock {
  _key: string;
  _type: string;
  children: {
    _key: string;
    _type: string;
    marks: string[];
    text: string;
  }[];
  markDefs: any[];
  style: string;
}

export interface Author {
  _id: string;
  name: string;
  avatar?: string;
}

export interface Article {
  _id: string;
  _type: string;
  title: string;
  slug: {
    current: string;
  };
  publishedAt: string;
  excerpt?: string;
  body: any[]; // Using any for PortableText compatibility
  mainImage?: SanityImageWithUrl;
  author?: Author;
  categories?: Array<{
    _ref: string;
    _type: 'reference';
  }>;
}

export interface Event {
  _id: string;
  _type: string;
  title: string;
  slug: {
    current: string;
  };
  startDate: string;
  endDate?: string;
  location?: string;
  description?: any[]; // Using any for PortableText compatibility
  featuredImage?: SanityImageWithUrl;
  eventType?: string;
}

export interface Member {
  _id: string;
  _type: string;
  name: string;
  position: string;
  country?: string;
  bio?: any[]; // Using any for PortableText compatibility
  photo?: SanityImageWithUrl;
  email?: string;
  socialLinks?: Array<{
    platform: string;
    url: string;
  }>;
}