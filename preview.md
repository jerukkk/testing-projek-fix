Tampilannya akan muncul langsung di dalam Dashboard Sanity Studio, bukan di tab browser terpisah.

Fitur ini disebut "Split Pane" (Layar Terbelah).

Visualisasinya Seperti Ini:
Bayangkan layar laptop klien Anda terbagi dua secara vertikal:

Sebelah KIRI (Panel Editor): Tempat mereka mengetik judul, upload gambar, isi body artikel, dll (Form input Sanity biasa).

Sebelah KANAN (Panel Preview): Website Next.js Anda yang asli dimuat di sini (menggunakan iframe).

Keajaibannya (Real-time Sync):
Saat klien mengetik satu huruf di panel KIRI, tampilan website di panel KANAN akan berubah secara instan (Real-time) tanpa perlu menekan tombol Save atau Publish.

Cara Mengaksesnya Nanti (Untuk Klien)
Setelah Anda setup kodenya, begini cara klien melihatnya:

Login ke Sanity Studio (/studio atau domain studio Anda).

Di menu navigasi atas (biasanya ada "Structure" dan "Vision"), akan muncul tab baru bernama "Presentation".

Klik tab Presentation.

Layar langsung berubah jadi mode Split Screen.

Mereka bisa klik artikel mana saja di list, dan preview-nya akan muncul di kanan.

⚠️ PENTING: Masalah "Localhost" vs "Production"
Ini bagian yang sering bikin bingung pemula.

Karena website Next.js Anda ada di dua tempat (Laptop Anda/Localhost dan Vercel/Production), Anda harus mengatur Sanity agar tahu harus menampilkan yang mana.

Di file sanity.config.ts, pastikan setting previewUrl-nya dinamis seperti ini:

TypeScript
import { defineConfig } from 'sanity'
import { presentationTool } from 'sanity/presentation'

export default defineConfig({
  // ...
  plugins: [
    presentationTool({
      previewUrl: {
        // Logika: 
        // Kalau sedang di komputer Anda (development), pakai localhost:3000
        // Kalau sudah dideploy (production), pakai URL Vercel asli
        origin: typeof location === 'undefined' || location.hostname === 'localhost' 
          ? 'http://localhost:3000' 
          : 'https://nama-project-mun.vercel.app', // Ganti dengan domain Vercel Anda
          
        previewMode: {
          enable: '/api/draft', // Rute API yang tadi kita buat
        },
      },
    }),
  ],
})
Kenapa setting ini penting? Jika Anda lupa setting ini, saat klien membuka Sanity Studio dari rumah mereka, Sanity akan mencoba memanggil http://localhost:3000. Karena di laptop klien tidak ada server Next.js yang jalan, preview-nya akan ERROR / BLANK.

Dengan setting di atas, Sanity akan otomatis memanggil website Vercel (https://...) saat klien mengaksesnya.

Jadi, outputnya sangat rapi dan terintegrasi di satu layar. Klien pasti suka!