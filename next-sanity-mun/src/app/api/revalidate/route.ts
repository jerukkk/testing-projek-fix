import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  // Validasi secret opsional untuk keamanan
  const secret = request.nextUrl.searchParams.get('secret');
  // const expectedSecret = process.env.SANITY_REVALIDATE_SECRET;
  // if (secret !== expectedSecret) {
  //   return new Response('Invalid secret', { status: 401 });
  // }

  try {
    // Di Next.js App Router, kita hanya bisa mengembalikan respons sukses
    // Revalidasi sebenarnya terjadi melalui revalidate properti di halaman
    // atau melalui Vercel's on-demand revalidation jika diaktifkan
    
    return new Response('Revalidation request received', { status: 200 });
  } catch (err) {
    console.error('Error processing revalidation request:', err);
    return new Response('Error processing request', { status: 500 });
  }
}