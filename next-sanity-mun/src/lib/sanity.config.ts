// sanity.config.ts
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-03-19'
export const token = process.env.SANITY_API_TOKEN || ''  // Make token optional

// Validate that the required environment variables are set
if (!projectId || !dataset) {
  throw new Error('Missing required Sanity environment variables')
}