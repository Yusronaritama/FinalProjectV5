// 1. IMPORT ScrollDetail dari @ionic/angular
import { Component, OnInit } from '@angular/core';
import { ScrollDetail } from '@ionic/angular';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
  standalone: false
  // standalone: false  // Anda bisa hapus baris ini jika tidak yakin, biasanya tidak diperlukan
})
export class FaqPage implements OnInit {

  public logoUrl: string = 'assets/icon/Icon.png'; // Pastikan path logo Anda sudah benar

  public faqList = [
    {
      question: 'Bagaimana cara menyewa kendaraan?',
      answer: 'Anda dapat menyewa kendaraan dengan mudah melalui aplikasi kami. Cari kendaraan yang Anda inginkan, pilih tanggal dan waktu sewa, lalu selesaikan pembayaran. Setelah konfirmasi, Anda bisa mengambil kendaraan di lokasi yang telah ditentukan.',
      isOpen: false
    },
    // ... sisa data FAQ Anda ...
    {
      question: 'Apakah bisa mengubah jadwal sewa?',
      answer: 'Perubahan jadwal (reschedule) dapat dilakukan maksimal 24 jam sebelum waktu penjemputan awal, tergantung ketersediaan kendaraan. Silakan akses menu \'Pemesanan Saya\' untuk melihat opsi perubahan jadwal.',
      isOpen: false
    }
    
  ];

  // --- TAMBAHKAN VARIABEL UNTUK FITUR SCROLL DI SINI ---
  public isHeaderHidden = false;
  private lastScrollTop = 0;
  private scrollThreshold = 10;
  // --------------------------------------------------------

  constructor() { }

  ngOnInit() {
  }

  toggleFaq(selectedFaq: any) {
    this.faqList.forEach(faq => {
      if (faq !== selectedFaq) {
        faq.isOpen = false;
      }
    });
    selectedFaq.isOpen = !selectedFaq.isOpen;
  }

  // --- TAMBAHKAN FUNGSI onScroll DI SINI ---
  onScroll(event: CustomEvent<ScrollDetail>) {
    const scrollTop = event.detail.scrollTop;

    if (scrollTop < 0) {
      return;
    }

    if (Math.abs(scrollTop - this.lastScrollTop) < this.scrollThreshold) {
      return;
    }

    if (scrollTop > this.lastScrollTop && scrollTop > 50) {
      this.isHeaderHidden = true;
    } else {
      this.isHeaderHidden = false;
    }

    this.lastScrollTop = scrollTop;
  }
  // ---------------------------------------------
}