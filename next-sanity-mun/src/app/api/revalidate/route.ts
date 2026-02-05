import { NextRequest } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  // Anda bisa menambahkan validasi secret di sini untuk keamanan
  const secret = request.nextUrl.searchParams.get('secret');
  
  // Jika Anda ingin menambahkan secret untuk keamanan
  // const expectedSecret = process.env.SANITY_REVALIDATE_SECRET;
  // if (secret !== expectedSecret) {
  //   return new Response('Invalid secret', { status: 401 });
  // }

  try {
    // Revalidate semua halaman yang menggunakan data Sanity
    revalidateTag('sanity-content');
    
    // Atau revalidate path tertentu
    // await revalidatePath('/articles');
    // await revalidatePath('/');

    return new Response('Revalidation triggered', { status: 200 });
  } catch (err) {
    console.error('Error revalidating content:', err);
    return new Response('Error revalidating content', { status: 500 });
  }
}