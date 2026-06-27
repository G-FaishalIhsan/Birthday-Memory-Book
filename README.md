# 🌸 Soft Pastel Memory Book — Cute Interactive Birthday Web App 🎂

Website ulang tahun interaktif berdesain *soft pastel* estetik yang dirancang khusus untuk merayakan hari spesial orang terdekat Anda. Dilengkapi dengan berbagai gimmick interaktif seperti meniup lilin menggunakan mic, chat WhatsApp imut, album foto scrapbook digital yang bisa dibalik halamannya, hingga bilik foto (digital photobooth) webcam!

---

## 🧸 Maskot Karakter Lucu (Cute Mascots)
Aplikasi ini ditemani oleh tiga karakter lucu bergaya *nano banana* pastel yang akan menemani perjalanan pembaca:
- **Boni si Beruang 🐻**: Memberikan pesan apresiasi yang tulus dan menenangkan.
- **Kiko si Kucing 🐱**: Kucing asisten setia yang memandu halaman chat WhatsApp dan selalu tersenyum di pojok layar.
- **Lili si Bunga 🌸**: Memberikan harapan-harapan indah yang mekar untuk masa depan.

---

## ✨ Fitur-Fitur Utama (Key Features)

### 1. 🕯️ Tiup Lilin Interaktif (Interactive Candle Blow)
- **Sensor Suara Asli**: Lilin ulang tahun pada kue digital dapat ditiup menggunakan mikrofon perangkat secara *real-time* memanfaatkan **Web Audio API**.
- **Efek Meriah**: Ketika ditiup, lilin akan padam diikuti dengan efek getar layar (*screen shake*), melodi lonceng chime sintetis, dan semburan confetti meriah multi-gelombang.
- *Fallback*: Jika akses mic tidak diizinkan, tombol manual cantik tetap tersedia agar lilin tetap bisa padam dengan sempurna.

### 2. 💬 Gimmick Obrolan WhatsApp (WhatsApp Chat Mockup)
- Antarmuka obrolan bertema merah muda yang menyerupai aplikasi chat seluler.
- Gelembung pesan muncul secara bertahap disertai efek suara notifikasi centang masuk (`soundeffect.mp3`).
- Dilengkapi dengan *typing indicator* ("sedang mengetik...") animasi tiga titik melayang yang menggemaskan.

### 3. 📖 Album Polaroid 12 Halaman (Scrapbook Book)
- Album kenangan berbasis efek membalik halaman kertas nyata memanfaatkan pustaka `react-pageflip`.
- Setiap foto memori yang diunggah diposisikan pada bingkai foto polaroid besar dengan orientasi sedikit berputar estetik dan hiasan selotip pastel.
- Menyajikan playlist musik mengalir yang berputar secara berurutan (`lagu1.mp3` dan `lagu2.mp3`) lengkap dengan transisi *fade-in* (volume memudar naik) saat halaman dibuka agar tidak mengejutkan telinga.
- Dilengkapi kontrol volume mini (slider) di bagian bawah halaman.

### 4. 📸 Bilik Foto Digital (Digital Photobooth Webcam)
- Integrasi langsung dengan kamera depan perangkat (*webcam*) menggunakan `getUserMedia`.
- Tombol **"Ambil Foto 📸"** akan membekukan (*freeze frame*) kamera ke dalam bingkai polaroid instan—sangat pas untuk di-screenshot dan dibagikan ke media sosial!
- *Graceful Fallback*: Jika kamera tidak diizinkan atau tidak tersedia, sistem otomatis menampilkan ilustrasi lambaian kucing lucu sebagai latar foto.

### 5. 🎁 Kejutan Penuh Layar (Surprise Modal Overlay)
- Tombol aksi akhir untuk "Tutup Mata & Hitung Sampai 3" yang akan menyemburkan confetti tanpa henti dan memunculkan modal kejutan penutup dengan balon-balon udara serta ilustrasi kelinci ulang tahun yang imut (`birthday_bunny.jpg`).
- Tombol navigasi balik untuk membaca ulang Scrapbook kapan saja tanpa menghapus foto yang telah diunggah.

---

## 🛠️ Teknologi & Pustaka (Tech Stack)

- **Inti & Logic**: React (Hooks, Portals)
- **Build Tool**: Vite (Sangat cepat dan ringan)
- **Styling**: Vanilla CSS (Menggunakan variabel warna HSL kustom, tata letak Grid & Flexbox, serta transisi animasi halus)
- **Efek Partikel**: `canvas-confetti`
- **Animasi Kertas**: `react-pageflip`
- **Audio**: HTML5 Audio & Web Audio API (untuk sintesis melodi chime)

---

## 🚀 Cara Menjalankan Proyek Secara Lokal (Installation)

1. **Clone repositori** ini atau unduh folder proyek.
2. Pastikan Anda telah menginstal **Node.js** di komputer Anda.
3. Buka terminal di direktori proyek dan instal semua ketergantungan (dependencies):
   ```bash
   npm install
   ```
4. Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```
5. Buka alamat `http://localhost:5173` (atau port yang tertera) di browser Anda.

---

## ☁️ Cara Deploy ke Internet Secara Gratis

### Pilihan 1: Netlify Drag & Drop (Paling Instan)
1. Lakukan kompilasi produksi di terminal:
   ```bash
   npm run build
   ```
2. Buka folder proyek Anda, temukan folder baru bernama `dist`.
3. Buka situs [Netlify Drop](https://app.netlify.com/drop) di browser.
4. Seret (drag) folder `dist` tersebut dan letakkan ke area unggah Netlify. Website Anda langsung online dalam hitungan detik!

### Pilihan 2: Vercel CLI (Lewat Command Line)
1. Instal Vercel secara global: `npm install -g vercel`.
2. Jalankan perintah `vercel` di dalam folder proyek Anda.
3. Masuk dengan akun Anda, tekan Enter untuk menyetujui opsi default, dan proyek akan langsung terunggah secara otomatis.
