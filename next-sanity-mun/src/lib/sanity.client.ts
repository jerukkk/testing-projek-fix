import { createClient } from '@sanity/client'
import { projectId, dataset, apiVersion, token } from '@/lib/sanity.config'

// Set up the client for fetching data in the getProps page functions
// Attempt to use token if available, but gracefully handle cases where it's not
export const sanityClient = createClient({
  projectId: projectId || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: dataset || process.env.NEXT_PUBLIC_SANITY_DATASET || '',
  apiVersion,
  // Use token if available, but don't throw error if missing
  token: token || process.env.SANITY_API_TOKEN || undefined,
  useCdn: true, // Set to true for public content to improve performance
  perspective: 'published', // Only fetch published content
  ignoreBrowserConfig: true, // Ignore browser config to prevent conflicts
  timeout: 60000, // 60 second timeout for slower networks
  // Add retry mechanism
  maxRetries: 3,
})

// Set up a preview client
export const previewClient = createClient({
  projectId: projectId || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: dataset || process.env.NEXT_PUBLIC_SANITY_DATASET || '',
  apiVersion,
  token: token || process.env.SANITY_API_TOKEN || undefined,
  useCdn: false,
  ignoreBrowserConfig: true, // Ignore browser config to prevent conflicts
  timeout: 60000, // 60 second timeout for slower networks
  maxRetries: 3, // Add retry mechanism
})