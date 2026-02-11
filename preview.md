Berdasarkan dokumentasi resmi Sanity yang baru saja saya akses, kemungkinan besar penyebab "belum bisa connect" adalah kesalahan konfigurasi pada properti previewUrl di file sanity.config.ts.

Di versi terbaru sanity/presentation, format penulisannya sedikit berubah (tidak lagi menggunakan origin di dalam previewUrl).

Berikut adalah rangkuman cara memperbaikinya agar terkoneksi:

1. Update Syntax di sanity.config.ts
Hapus konfigurasi lama Anda, dan ganti dengan format standar berikut. Perhatikan bahwa kita menggunakan properti previewUrl yang berisi sub-properti previewMode.

TypeScript
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { presentationTool } from 'sanity/presentation' // Pastikan import ini ada

export default defineConfig({
  // ... config lain (projectId, dataset) ...

  plugins: [
    structureTool(),
    visionTool(),

    presentationTool({
      // PENTING: Gunakan 'previewUrl' dengan format object seperti ini
      previewUrl: {
        // 1. Alamat website Next.js Anda (Localhost atau Production)
        previewMode: {
          enable: '/api/draft', // Route API di Next.js untuk mengaktifkan draft
        },
      },
      
      // 2. Resolve locations (Opsional tapi disarankan)
      // Ini membantu Sanity tahu halaman mana yang harus dibuka
      resolve: {
        locations: {
          // Contoh: Tipe dokumen 'post' akan membuka /blog/slug-artikel
          post: defineLocations({
            select: {
              title: 'title',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc.title || 'Untitled',
                  href: `/blog/${doc.slug}`,
                },
              ],
            }),
          }),
        },
      },
    }),
  ],
})
2. Checklist "Kenapa Masih Gagal Connect?"
Jika kode di atas sudah benar tapi masih muncul error (misal: "Unable to connect" atau layar kanan blank), cek 3 hal ini:

Server Next.js Harus Nyala: Pastikan Anda menjalankan DUA terminal secara bersamaan:

Terminal 1: npm run dev (untuk Next.js di port 3000).

Terminal 2: npm run dev (untuk Sanity Studio).

Jika Next.js mati, Sanity tidak bisa menampilkan apa-apa.

Izin CORS (Allow Origins): Sanity Studio membutuhkan izin untuk me-load website Anda di dalam iframe. Tambahkan URL Sanity Studio Anda ke daftar allowedOrigins jika perlu, atau pastikan di sanity.config.ts Anda menambahkan:

TypeScript
presentationTool({
    // ... config lain
    // Izinkan localhost studio mengakses localhost nextjs
    previewUrl: {
         origin: 'http://localhost:3000', // <-- Coba tambahkan ini jika masih gagal
         previewMode: { enable: '/api/draft' },
    },
})
Catatan: Di versi terbaru, Sanity biasanya otomatis mendeteksi localhost. Namun jika gagal, pastikan Anda mengakses Studio dari http://localhost:3000/studio (jika embedded) atau port yang sesuai.

Masalah Browser (Cookie Pihak Ketiga): Jika Anda menggunakan Chrome Incognito atau Safari, fitur ini sering blokir karena isu "Third-Party Cookies".

Solusi: Coba gunakan Chrome profil biasa (bukan Incognito) untuk mengetes fitur ini.

Coba perbarui sanity.config.ts Anda dengan kode di poin 1, lalu restart server (Ctrl + C -> npm run dev). Apakah sudah muncul?