# Aplikasi Sewa Kendaraan "GoRentAll"

Aplikasi "GoRentAll" adalah sistem informasi sewa kendaraan lengkap yang dikembangkan sebagai Final Project. Proyek ini dibangun oleh tim dengan pembagian tugas yang jelas antara pengembangan backend dan frontend.

Sistem ini terdiri dari **Aplikasi Mobile** untuk penyewa (dibangun dengan Ionic/Angular) dan **Backend RESTful API** (dibangun dengan Laravel) yang juga melayani panel admin berbasis web.

---

## 🚀 Arsitektur & Pembagian Tugas

Proyek ini dibagi menjadi dua repositori utama yang saling terintegrasi:

* **Repositori Frontend (Ionic/Angular):** [https://github.com/Yusronaritama/FinalProjectV5]
* **Repositori Backend (Laravel):** [https://github.com/akhdansubagja/fpbackendv2]


---

## 💻 Teknologi yang Digunakan

* **Backend:** Laravel, PHP, MySQL
* **Frontend:** Ionic, Angular, TypeScript, SCSS
* **API & Autentikasi:** RESTful API, Laravel Sanctum (untuk API Token & Sesi Web)
* **Fitur Tambahan:** Firebase Cloud Messaging (FCM) untuk Push Notification
* **Tools:** Git, GitHub, Composer, Postman

---

## ✨ Fitur Unggulan Sistem

* **Autentikasi Ganda:** Sistem keamanan yang menangani otentikasi *stateless* (API Token) untuk aplikasi mobile dan *stateful* (Sesi/Cookie) untuk panel admin secara bersamaan.
* **Manajemen Ketersediaan:** Logika backend untuk memblokir tanggal sewa secara dinamis, termasuk masa tenggang untuk pemeliharaan kendaraan.
* **Notifikasi Real-Time:** Pengiriman notifikasi *push* dan email kepada pengguna saat status pembayaran dan pesanan berubah.
* **Manajemen Deposit & Keuangan:** Fitur khusus bagi admin untuk mengelola pengembalian *security deposit* dan dashboard yang menampilkan laporan keuangan akurat (Pendapatan Bersih, Total Uang Masuk, dll).
* **Proses Rental End-to-End:** Alur bisnis lengkap mulai dari pencarian, pemesanan, pembayaran multi-metode (`transfer`, `qris`, `bayar_di_tempat`), hingga riwayat transaksi.
