// src/app/faq/faq.page.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
  standalone: false
})
export class FaqPage {

  // Nilai awal search bar sesuai gambar
  searchQuery: string = 'apakah sewa tank?';
  
  // Status untuk menampilkan pesan "No results"
  showNoResults: boolean = false; 
  
  // Data dummy untuk daftar FAQ
  allFaqs = [
    {
      question: 'Apa itu GoRentall?',
      answer: 'GoRentall adalah platform marketplace online yang mempertemukan pemilik barang yang tidak terpakai dengan orang-orang yang membutuhkan barang tersebut untuk disewa. Misi kami adalah membuat proses sewa-menyewa menjadi lebih mudah, aman, dan efisien bagi semua orang.'
    },
    {
      question: 'Apakah aman bertransaksi di GoRentall?',
      answer: 'Keamanan Anda adalah prioritas kami. Kami memastikan setiap transaksi aman dengan sistem verifikasi pengguna, ulasan dan rating, serta gerbang pembayaran yang terenkripsi. Kami juga menyediakan Jaminan GoRentall untuk melindungi barang Anda dari kerusakan atau kehilangan.'
    },
    {
      question: 'Bagaimana cara menghubungi Layanan Pelanggan?',
      answer: 'Tim kami siap membantu Anda. Anda bisa menghubungi kami melalui email di dukungan@gorentall.com, melalui WhatsApp di nomor +62 812-3456-7890, atau melalui fitur "Hubungi Kami" yang ada di dalam aplikasi.'
    },
    {
      question: 'Bagaimana cara saya menyewa barang?',
      answer: 'Sangat mudah! Ikuti 4 langkah berikut:\n1. Cari & Temukan: Gunakan kolom pencarian untuk menemukan barang yang Anda butuhkan.\n2. Pesan & Atur Jadwal: Pilih tanggal mulai dan selesai sewa, lalu ajukan pemesanan.\n3. Lakukan Pembayaran: Bayar pesanan Anda melalui metode pembayaran yang tersedia.\n4. Ambil Barang: Ambil barang sewaan Anda di lokasi pemilik atau sesuai kesepakatan pengantaran.'
    },
    {
      question: 'Metode pembayaran apa saja yang diterima?',
      answer: 'Kami menerima berbagai metode pembayaran populer, termasuk:\n- Transfer Virtual Account (VA) semua bank besar.\n- Dompet Digital (GoPay, OVO, Dana, ShopeePay).\n- Kartu Kredit & Debit.\n- Pembayaran di gerai retail (Indomaret & Alfamart).'
    },
    {
      question: 'Apa yang harus saya lakukan jika barang yang saya sewa rusak saat saya gunakan?',
      answer: 'Tetap tenang. Segera dokumentasikan kerusakan dengan foto atau video yang jelas. Kemudian, langsung hubungi pemilik barang melalui fitur chat di aplikasi untuk memberitahukan situasinya. Jika tidak ada titik temu, tim Customer Support kami akan membantu mediasi. Uang jaminan (deposit) mungkin akan digunakan untuk perbaikan sesuai kesepakatan.'
    },
    {
      question: 'Bagaimana cara saya menyewakan barang saya di GoRentall?',
      answer: 'Anda bisa mulai menghasilkan uang dari barang Anda dengan mudah:\n1. Pilih menu "Mulai Menyewakan" di profil Anda.\n2. Unggah foto-foto barang yang jelas dari berbagai sisi.\n3. Tulis judul, deskripsi yang menarik, dan spesifikasi barang.\n4. Tentukan harga sewa harian, mingguan, atau bulanan.\n5. Publikasikan, dan barang Anda siap untuk disewa!'
    },
    {
      question: 'Apakah ada biaya untuk mendaftarkan barang?',
      answer: 'Tidak ada biaya sama sekali untuk mendaftarkan barang Anda. Mendaftar dan menampilkan barang di GoRentall sepenuhnya GRATIS. Kami hanya akan memotong biaya layanan (komisi) dalam persentase kecil dari setiap transaksi sewa yang berhasil.'
    },
    {
      question: 'Bagaimana saya dilindungi jika barang saya rusak atau tidak kembali?',
      answer: 'Kami melindungi pemilik barang dengan beberapa lapis keamanan:\n- Uang Jaminan (Deposit): Anda bisa menetapkan uang jaminan yang harus dibayar oleh penyewa, yang akan dikembalikan setelah barang kembali dengan aman.\n- Verifikasi Pengguna: Kami memverifikasi identitas penyewa untuk mengurangi risiko.\n- Jaminan GoRentall: Untuk kasus tertentu, program Jaminan GoRentall kami dapat memberikan kompensasi atas kerusakan atau kehilangan sesuai syarat dan ketentuan yang berlaku.'
    },
    {
    question: 'Bisakah saya membatalkan pesanan sewa yang sudah saya bayar?',
    answer: 'Ya, Anda bisa membatalkan pesanan. Kebijakan pengembalian dana kami adalah sebagai berikut:\n- Pembatalan > 24 jam sebelum waktu sewa dimulai: Pengembalian dana 100%.\n- Pembatalan < 24 jam sebelum waktu sewa dimulai: Pengembalian dana 50%.\n- Pembatalan setelah waktu sewa dimulai: Tidak ada pengembalian dana.\nProses pengembalian dana mungkin memerlukan waktu 3-5 hari kerja.'
  },
  {
    question: 'Bagaimana jika saya ingin memperpanjang masa sewa?',
    answer: 'Jika Anda ingin memperpanjang sewa, pertama periksa ketersediaan barang pada kalender pemilik. Kemudian, hubungi pemilik melalui fitur chat untuk konfirmasi. Jika pemilik setuju, Anda bisa melakukan pemesanan baru untuk periode perpanjangan melalui aplikasi.'
  },
  {
    question: 'Bagaimana sistem pengiriman dan pengembalian barang?',
    answer: 'Metode pengiriman dan pengembalian didasarkan pada kesepakatan antara penyewa dan pemilik. Opsi yang umum adalah:\n- Ambil di Tempat (COD): Penyewa datang langsung ke lokasi pemilik.\n- Diantar Pemilik: Pemilik dapat menawarkan jasa antar dengan kemungkinan biaya tambahan.\n- Kurir Pihak Ketiga: Menggunakan jasa ojek online atau kurir lain yang biayanya ditanggung sesuai kesepakatan.'
  },
  {
    question: 'Kapan saya akan menerima pembayaran dari hasil sewa?',
    answer: 'Untuk keamanan bersama, pembayaran dari penyewa akan ditahan sementara oleh sistem GoRentall (sistem escrow). Dana akan diteruskan ke Saldo GoRentall Anda dalam waktu 1x24 jam setelah periode sewa dimulai. Anda kemudian dapat menarik dana tersebut ke rekening bank Anda.'
  },
  {
    question: 'Mengapa saya harus melakukan verifikasi identitas (KTP)?',
    answer: 'Verifikasi identitas adalah langkah penting untuk membangun kepercayaan dan keamanan di komunitas GoRentall. Ini membantu kami memastikan semua pengguna adalah orang yang sah, mencegah penipuan, dan merupakan syarat agar Jaminan GoRentall dapat berlaku bagi kedua belah pihak. Data Anda kami jamin kerahasiaannya.'
  },
  {
    question: 'Bagaimana cara kerja sistem ulasan dan rating?',
    answer: 'Setelah masa sewa berakhir, baik penyewa maupun pemilik akan diminta untuk memberikan ulasan dan rating (1-5 bintang) satu sama lain. Sistem ini membantu membangun reputasi dan memberikan informasi berharga bagi pengguna lain saat akan bertransaksi.'
  },
  {
    question: 'Saya lupa kata sandi akun saya, bagaimana cara mengaturnya ulang?',
    answer: 'Pada halaman login, klik tautan "Lupa Kata Sandi?". Masukkan alamat email yang terdaftar dengan akun Anda. Kami akan mengirimkan email berisi tautan dan instruksi untuk mengatur ulang kata sandi Anda.'
  }
  ];

  // Array untuk menampung hasil filter
  filteredFaqs = [...this.allFaqs];

  constructor() { }

  // Fungsi yang dipanggil setiap kali ada input di search bar
  onSearchChange(event: any) {
    const query = event.target.value.toLowerCase();
    
    // Logika filter sederhana
    this.filteredFaqs = this.allFaqs.filter(faq => 
      faq.question.toLowerCase().includes(query) || 
      faq.answer.toLowerCase().includes(query)
    );
    
    // Tampilkan "No Results" jika hasil filter kosong
    this.showNoResults = this.filteredFaqs.length === 0;
  }
}