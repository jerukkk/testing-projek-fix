import { type NextRequest } from 'next/server'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  // Parse the request to get the secret, slug, and type
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')
  const type = searchParams.get('type') // Document type like 'post', 'article', etc.

  // Check if the secret is correct
  if (!secret || secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 })
  }

  // Enable Draft Mode
  await draftMode().enable()

  // Redirect to the correct path based on document type
  let redirectTo = '/'
  
  if (type === 'post' && slug) {
    redirectTo = `/articles/${slug}`
  } else if (type === 'article' && slug) {
    redirectTo = `/articles/${slug}`
  } else if (type === 'event' && slug) {
    redirectTo = `/events/${slug}`
  } else if (type === 'member' && slug) {
    redirectTo = `/members/${slug}`
  } else if (slug) {
    // Default to using the slug directly if no specific type is matched
    redirectTo = `/articles/${slug}` // Default to articles route
  }

  // Redirect to the path
  return redirect(redirectTo)
}