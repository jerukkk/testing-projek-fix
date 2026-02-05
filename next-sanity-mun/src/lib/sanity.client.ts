import { createClient } from '@sanity/client'
import { projectId, dataset, apiVersion } from '@/lib/sanity.config'

// Set up the client for fetching data in the getProps page functions
// Using public access without token for read operations
export const sanityClient = createClient({
  projectId: projectId || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ny2z8d3s',
  dataset: dataset || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion,
  // No token needed for public dataset
  useCdn: true, // Set to true for public content to improve performance
  perspective: 'published', // Only fetch published content
  timeout: 60000, // 60 second timeout for slower networks
})

// Set up a preview client (still requires token for draft content)
export const previewClient = createClient({
  projectId: projectId || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ny2z8d3s',
  dataset: dataset || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion,
  token: process.env.SANITY_API_TOKEN || undefined, // Only for preview mode
  useCdn: false,
  timeout: 60000, // 60 second timeout for slower networks
})