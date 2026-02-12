import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    // Get the secret from the request header or query parameter
    const secret = request.nextUrl.searchParams.get('secret')
    
    // Verify the secret matches the one in environment variables
    if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
      return NextResponse.json({ 
        message: 'Invalid secret' 
      }, { status: 401 })
    }

    // Revalidate the 'content' tag which is used in your pages
    revalidateTag('content')
    
    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now() 
    })
  } catch (err) {
    return NextResponse.json({ 
      revalidated: false, 
      error: err.message 
    }, { status: 500 })
  }
}