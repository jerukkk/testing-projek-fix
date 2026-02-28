import { Analytics } from "@vercel/analytics/react"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        {children}
        <Analytics /> {/* <--- Cukup di sini */}
      </body>
    </html>
  )
}