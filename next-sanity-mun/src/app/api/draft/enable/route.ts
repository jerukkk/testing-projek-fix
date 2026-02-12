import { type NextRequest } from 'next/server'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  // Parse the request to get the secret and slug
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  // Check if the secret is correct
  if (!secret || secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 })
  }

  // Enable Draft Mode
  await draftMode().enable()

  // Redirect to the slug path or home if no slug is provided
  const redirectTo = slug ? `/articles/${slug}` : '/'
  return redirect(redirectTo)
}