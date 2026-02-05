import { createClient } from '@sanity/client'
import { projectId, dataset, apiVersion, token } from '@/lib/sanity.config'

// Set up the client for fetching data in the getProps page functions
export const sanityClient = createClient({
  projectId: projectId || '',
  dataset: dataset || '',
  apiVersion,
  token: typeof window === 'undefined' ? token || undefined : undefined, // Only use token in server-side code
  useCdn: true, // Set to true for public content to improve performance
  perspective: 'published', // Only fetch published content
})

// Set up a preview client
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: typeof window === 'undefined' ? token : undefined, // Only use token in server-side code
  useCdn: false,
})