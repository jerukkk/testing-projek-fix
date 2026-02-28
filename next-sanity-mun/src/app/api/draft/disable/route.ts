import { draftMode } from 'next/headers'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET() {
  // Hapus cookie draft mode untuk menonaktifkan draft mode
  const draft = await draftMode()
  if (draft.isEnabled) {
    // Hapus cookie draft mode
    cookies().delete('NEXT_PREVIEW_DATA')
    cookies().delete('__prerender_bypass')
  }

  // Redirect to home
  return redirect('/')
}