Gemini said
Itu wajar, karena fitur Presentation (tab preview) tidak aktif secara otomatis. Anda harus menambahkannya secara manual ke dalam konfigurasi Sanity.

Tab "Structure" adalah bawaan untuk edit konten, dan "Vision" untuk tes query database. "Presentation" adalah plugin terpisah.

Berikut langkah-langkah agar tab tersebut muncul:

1. Cek File sanity.config.ts
Buka file sanity.config.ts (biasanya ada di root folder projek Anda).

2. Import & Tambahkan Plugin
Anda perlu meng-import presentationTool dan memasukkannya ke dalam array plugins.

Ubah kodenya menjadi seperti ini:

TypeScript
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
// 1. IMPORT INI
import { presentationTool } from 'sanity/presentation' 

export default defineConfig({
  // ... (config lain seperti projectId, dataset) ...

  plugins: [
    structureTool(),
    visionTool(),

    // 2. TAMBAHKAN BAGIAN INI
    presentationTool({
      previewUrl: {
        // Ini memberi tahu Sanity: "Tolong load website Next.js saya di sebelah kanan"
        origin: typeof location === 'undefined' || location.hostname === 'localhost' 
          ? 'http://localhost:3000' 
          : 'https://domain-vercel-anda.vercel.app', 
          
        previewMode: {
          enable: '/api/draft', // Route API yang nanti kita buat (biarkan dulu)
        },
      },
    }),
  ],
})
3. Restart Server
Setelah menyimpan file di atas, matikan terminal (Ctrl + C) lalu jalankan ulang:

Bash
npm run dev
4. Cek Browser
Buka kembali http://localhost:3000/studio (atau di mana studio Anda berada). Sekarang seharusnya sudah muncul Tab Presentation di samping Structure dan Vision.

Catatan: Saat Anda klik tab Presentation, mungkin preview-nya masih Blank atau Error karena kita belum membuat API Route /api/draft di Next.js (Langkah yang saya jelaskan sebelumnya). Tapi setidaknya tab-nya sudah muncul dulu.

Coba lakukan langkah di atas, apakah tab-nya sudah muncul?