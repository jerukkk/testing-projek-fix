import { createClient } from '@sanity/client'
import { projectId, dataset, apiVersion, token } from '@/lib/sanity.config'

// Set up the client for fetching data in the getProps page functions
export const sanityClient = createClient({
  projectId: projectId || '',
  dataset: dataset || '',
  apiVersion,
  token: token || undefined, // Use token if available, regardless of client/server
  useCdn: true, // Set to true for public content to improve performance
  perspective: 'published', // Only fetch published content
  ignoreBrowserConfig: true, // Ignore browser config to prevent conflicts
  timeout: 30000, // 30 second timeout
})

// Set up a preview client
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: token || undefined, // Use token if available, regardless of client/server
  useCdn: false,
  ignoreBrowserConfig: true, // Ignore browser config to prevent conflicts
  timeout: 30000, // 30 second timeout
})