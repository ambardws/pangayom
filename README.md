# Pangayom - AI Javascript Error Debugger

**Pangayom** adalah ekstensi mandiri untuk peramban (browser) berbasis Chromium yang diciptakan agar para _Web Developer_ bisa melacak JavaScript log error secara diam-diam dari latar belakang, merangkum jejak _Stack Trace_ aslinya, lalu mendapatkan penjelasan (sekaligus baris kode solusinya) menggunakan Kecerdasan Buatan (AI).

## 🚀 Fitur Utama

- **Silent & Native Capture:** Menangkap error Javascript (`window.onerror`, `unhandledrejection`, atau manual `console.error`) langsung dari _MAIN world_ website yang sedang berjalan tanpa merusak tampilan DevTools Anda dengan log ekstensi yang berisik.
- **Smart Response Caching:** Tidak menghabiskan kuota Token AI! Hasil penjelasan dari AI akan di-*cache* diam-diam. Selama letak error-nya masih identik di layar yang belum direfresh, popup akan me-load jawaban AI secara instan tanpa menghubungi server ulang.
- **Auto-Cleared Session:** Memori error selalu disucikan setiap kali Anda melakukan Refresh (F5) pada halaman yang sedang di-debug, menghindari tumpukan pesan error lawas yang nyangkut.
- **Code Context Injector:** Jika AI butuh informasi lebih mendalam, terdapat kolom tambahan *(Opsional)* di dalam ekstensi agar Anda bisa menebeng kode asli file ke dalamnya.
- **Copy-to-Clipboard Mulus:** Desain modern menggunakan properti penterjemah sintaks (*Markdown to HTML Parser*). Jawaban AI diubah otomatis menjadi blok-blok rapi nan presisi ala VScode berhiaskan tombol Copy instan nan cantik di ujung sudut.
- **Bring Your Own Key (BYOK):** Secara gawaan terhubung dengan endpoint AI OpenRouter. Bisa juga diubah/dimodif sewaktu-waktu (misal menggunakan API Z.ai Globa, DeepSeek, dsb).

## 📥 Panduan Instalasi (Chrome / Edge)

1. Buka halaman pengaturan ekstensi browser Anda di `chrome://extensions/` (atau `edge://extensions/`).
2. Aktifkan sakelar **"Developer mode" (Mode Pengembang)** yang terdapat di sudut paling kanan atas halaman.
3. Klik tombol **"Load unpacked"** di kiri atas.
4. Cari dan pilih folder/direktori utuh tempat kode **pangayom** ini tersimpan.
5. Selesai! Ekstensi Pangayom kini menempel mulus bersebelahan dengan kolom tautan browser Anda.

## 🛠️ Cara Penggunaan Harian

1. Buka ekstensi Pangayom.
2. Masukkan **API Key** OpenRouter / Z.ai / penyedia endpoint LLM Anda lainnya, lalu klik **Simpan**.
3. (Opsional) Jika Anda menggunakan penyedia khusus selain OpenRouter, Anda bisa mengganti letak URL Endpoint maupun merubah identitas string `model` di _source code_ `popup.js`.
4. Silakan asyik _ngoding_. Saat tab website Anda menjerit menjatuhkan Uncaught Error di Inspector layarnya, tinggal tekan logo ekstensi ini saja dari pojok layar.
5. Klik **"Explain with AI"**! (Atau bumbui dulu form Code Snippet-nya bila menginginkan keakuratan yang lebih mengerikan).

## 📋 Info Teknis (*Under the Hood*)

Ekstensi ini menggunakan kombinasi _content scripts_ & injeksi _script dynamic_ murni demi menambal batasan Chrome Sandbox tanpa bantuan _tools compiler_ eksternal (100% Vanilla JS):
- `infect.js` : Diterjunkan langsung ke dunia web sesungguhnya (Main World) untuk menjadi maling error.
- `content.js`: Menjadi agen intel yang duduk di kawasan rahasia (Isolated World) yang menampung bisikan `postMessage` sang maling, dan menulis laporannya ke *Storage*.
- `popup.js`  : Antarmuka UI modis plus otak utama yang menjalankan *Regex Parser*, menata tombol, dan melangsungkan obrolan lewat endpoint *fetch* canggih ke Server AI.

---
*Dibuat untuk mempercepat masa depan _Debugging_. Selamat menggunakan Pangayom!*
