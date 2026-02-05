Pertanyaan yang sangat krusial. Banyak developer pemula terjebak melakukan "lompat-lompat" (sedikit UI, sedikit database, ubah UI lagi), yang akhirnya membuat kode jadi berantakan (spaghetti code).

Untuk menghindari konflik logika dan kerja dua kali, prinsip terbaik adalah "Content-First Development" (Dahulukan Data/Konten).

Berikut adalah urutan workflow terbaik untuk membangun website Next.js + Sanity agar lancar dari awal sampai deploy:

TAHAP 1: Inisialisasi & Konfigurasi Dasar
Tujuannya: Menyiapkan "wadah" agar tidak ada error konfigurasi di tengah jalan.

Setup Project: Buat project Next.js baru (atau gunakan yang sudah ada).

Install Sanity: Jalankan perintah npm create sanity@latest di dalam folder project Next.js Anda (ini akan membuat folder studio atau konfigurasi embedded).

Environment Variables (.env): Segera buat file .env.local. Masukkan NEXT_PUBLIC_SANITY_PROJECT_ID dan NEXT_PUBLIC_SANITY_DATASET.

Mengapa ini di awal? Agar saat Anda mulai coding, koneksi ke Sanity tidak gagal terus menerus.

CORS Configuration: Buka dashboard web Sanity (sanity.io/manage), masuk ke tab API, dan tambahkan http://localhost:3000 ke daftar CORS Origins.

Penting: Jika lupa ini, browser akan memblokir data saat Anda develop di lokal.

TAHAP 2: Backend & Struktur Data (Schema)
Tujuannya: Menentukan "Apa yang akan ditampilkan". Jangan menyentuh UI/CSS Next.js dulu di tahap ini.

Desain Schema (Di Sanity): Tentukan field apa saja yang dibutuhkan.

Contoh untuk MUN: Buat schema article, event, dan teamMember.

Pastikan nama field final (misal: putuskan pakai mainImage atau poster agar konsisten).

Input Dummy Content (Di Studio):

Jalankan Sanity Studio (npm run dev).

Wajib: Buat minimal 3-5 artikel contoh, upload gambar asli, isi teks panjang, gunakan bold/italic.

Mengapa? Anda tidak bisa mendesain tampilan blog yang rapi jika datanya kosong. Anda butuh data "jelek" (judul kepanjangan, gambar beda ukuran) untuk mengetes ketahanan UI nanti.

TAHAP 3: Logic & Data Fetching (Jembatan)
Tujuannya: Memastikan data bisa masuk ke Next.js sebelum dipoles.

Setup Client & Helper:

Pastikan file client.ts sudah benar.

Buat file image.ts (untuk urlFor) seperti diskusi kita sebelumnya.

Tes Query (Di Terminal/Console):

Buat satu halaman sementara (misal app/test/page.tsx).

Lakukan console.log data dari Sanity.

Pastikan gambar tidak null dan teks muncul.

Tips: Jika Anda menggunakan TypeScript, di tahap ini sebaiknya Anda mendefinisikan interface atau type untuk data artikel (misal: interface Post { title: string; slug: string; ... }).

TAHAP 4: Frontend Development (UI/UX)
Tujuannya: Mempercantik tampilan. Karena data sudah siap (Tahap 2) dan sudah mengalir (Tahap 3), tahap ini akan sangat cepat.

Buat Komponen Kecil (Atoms/Molecules):

Buat komponen Navbar dan Footer.

Buat komponen ArticleCard (Kartu artikel). Gunakan dummy content yang sudah Anda buat di Tahap 2 untuk melihat apakah layoutnya pecah jika judulnya terlalu panjang.

Halaman Landing Page (Static):

Isi konten statis (Tentang Kami, Visi Misi).

Di bagian "Berita Terbaru", panggil data dari Sanity dan looping menggunakan komponen ArticleCard.

Halaman Detail Artikel (Dynamic Route):

Buat file app/blog/[slug]/page.tsx.

Gunakan parameter slug untuk mengambil single post dari Sanity.

Styling bagian PortableText (isi artikel) agar enak dibaca.

TAHAP 5: Finalisasi & Deployment
Tujuannya: Melempar ke publik.

Build Check: Jalankan npm run build di terminal lokal Anda. Pastikan tidak ada error TypeScript atau ESLint.

Push ke GitHub.

Connect ke Vercel: Import repo GitHub Anda ke Vercel.

Environment Variables (Lagi): Jangan lupa copy isi .env.local Anda ke setting Environment Variables di dashboard Vercel. (Ini kesalahan paling umum: Web live tapi datanya kosong karena lupa set env var di Vercel).

Update CORS (Final): Ambil domain Vercel Anda (misal project-mun.vercel.app), dan tambahkan lagi ke CORS Origins di dashboard Sanity.io.

Ringkasan Urutan Jalan (Checklist)
✅ Config: Env var & CORS Localhost.

✅ Sanity: Buat Schema -> Isi Dummy Data (minimal 5).

✅ Next.js Logic: Buat fungsi client, urlFor, dan definisikan Type/Interface.

✅ Next.js UI: Buat Components -> Landing Page -> Dynamic Slug Page.

✅ Deploy: Build Test -> Vercel -> CORS Production Domain.

Dengan urutan ini, Anda tidak akan mengalami momen "Waduh, saya sudah buat desain kartu artikel, tapi ternyata di database lupa bikin field untuk 'Penulis'". Schema duluan, baru desain.

Apakah alur ini cukup masuk akal untuk Anda terapkan?