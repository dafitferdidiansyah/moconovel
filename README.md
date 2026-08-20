# 🍅 Moconovel - Web Novel Reader

<p align="left">
  <img src="https://img.shields.io/github/stars/dafitferdidiansyah/moconovel?style=for-the-badge&color=yellow" alt="Stars">
  <img src="https://img.shields.io/github/license/dafitferdidiansyah/moconovel?style=for-the-badge&color=green" alt="License">
  <img src="https://img.shields.io/badge/Original%20Creator-Dennie%20Mok-blueviolet.svg?style=for-the-badge" alt="Original Creator">
  <img src="https://img.shields.io/badge/Customized%20By-Dafit%20Fernandus-blue.svg?style=for-the-badge" alt="Customizer">
  <img src="https://img.shields.io/badge/Backend-Django%20REST-orange.svg?style=for-the-badge" alt="Backend">
  <img src="https://img.shields.io/badge/Hosting-Proxmox%20VE-red.svg?style=for-the-badge" alt="Hosting">
</p>

### 🌟 Aplikasi Pembaca Novel Web Bebas Iklan & Responsif

**Moconovel** adalah aplikasi web pembaca novel (*web novel reader*) bebas iklan yang di-fork dari proyek open-source luar biasa [fanqie-novel-reader](https://github.com/denniemok/fanqie-novel-reader) yang dibuat oleh **[Dennie Mok](https://github.com/denniemok)**.

Proyek ini dimodifikasi dan disesuaikan secara kustom oleh **[Dafit Fernandus (Dapet)](https://dafitferdidiansyah.github.io)** untuk diintegrasikan secara penuh dengan API Server pribadi berbasis Django.

---

## 🚀 Fitur Hasil Kustomisasi

- **☁️ Integrasi Django REST API (Self-Hosted):** Mengganti mock API bawaan agar terhubung ke server backend Django di **Proxmox VE (LXC Ubuntu)** melalui tunnel publik Ngrok.
- **📥 EPUB Direct Import System:** Backend Django admin dilengkapi parser EPUB otomatis untuk memasukkan judul, penulis, deskripsi, gambar cover, dan bab novel ke database SQLite secara instan.
- **🌐 Lokalisasi Bahasa:** Antarmuka dasar dan metadata SEO disesuaikan ke Bahasa Indonesia agar lebih ramah bagi pembaca lokal.
- **⚡ HashRouter Deployment:** Mengubah sistem routing React Router ke HashRouter untuk mencegah error 404 (Page Not Found) saat halaman di-refresh di GitHub Pages.

---

## 🏗️ Arsitektur Proyek

```
[ FRONTEND CLIENT (Forked) ] ──( HTTPS via Ngrok )──► [ BACKEND SERVER ]
(React, Vite, HashRouter)                            (Django REST API)
                                                             │
                                                     [ PROXMOX VE LXC ]
                                                     (Ubuntu Container)
```

- **Frontend Client (Repository ini):** Dikembangkan berbasis React 18 + Vite, menggunakan kode dasar dari `fanqie-novel-reader`.
- **Backend Server:** API Django kustom untuk parser buku, serving chapter, dan manajemen database admin.

---

## 🛠️ Pembangunan & Pengembangan Lokal

```bash
# Clone repositori
git clone https://github.com/dafitferdidiansyah/moconovel.git
cd moconovel

# Instalasi dependensi
npm install

# Jalankan server pengembangan lokal (http://localhost:5173)
npm run dev
```

---

## 📝 Lisensi & Kredit Asli

- **Pembuat Kode Asli (Original Author):** **[Dennie Mok](https://github.com/denniemok)** (Lisensi MIT).
- **Kustomisasi & Integrasi Backend:** **[Dafit Fernandus (Dapet)](https://dafitferdidiansyah.github.io)**.
