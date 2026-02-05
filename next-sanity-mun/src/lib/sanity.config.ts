// sanity.config.ts
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ny2z8d3s' // Provide fallback value for build
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production' // Provide fallback value for build
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-03-19'
export const token = process.env.SANITY_API_TOKEN || ''  // Make token optional

// Validate that the required environment variables are set (only in development)
if (typeof window === 'undefined' && process.env.NODE_ENV === 'development' && (!projectId || !dataset)) {
  console.warn('Missing required Sanity environment variables. Some features may not work.')
}