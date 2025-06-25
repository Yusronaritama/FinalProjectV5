import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.page.html',
  styleUrls: ['./receipt.page.scss'],
  standalone: false,
})
export class ReceiptPage implements OnInit {
  // Menangkap elemen div struk untuk diubah menjadi gambar
  @ViewChild('receiptCard', { static: false }) receiptCard!: ElementRef;

  public rentalData: any;
  public transactionDetails: any = {}; // Untuk data tambahan

  constructor(
    private router: Router,
    private toastController: ToastController,
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['rental']) {
      this.rentalData = navigation.extras.state['rental'];
    } else {
      this.router.navigateByUrl('/home');
    }
  }

  ngOnInit() {
    if (this.rentalData && this.rentalData.payment) {
      this.transactionDetails = {
        orderId: `#GR${String(this.rentalData.id).padStart(6, '0')}`,
        transactionId: `TXN${this.rentalData.payment.id}`,
        paymentDate: new Date(this.rentalData.payment.updated_at),
        status:
          this.rentalData.payment.status_pembayaran === 'lunas'
            ? 'Paid'
            : 'Pending',
        statusColor:
          this.rentalData.payment.status_pembayaran === 'lunas'
            ? 'success'
            : 'warning',
      };
    }
  }

  // Fungsi untuk menyimpan struk sebagai gambar
  async saveReceipt() {
    const card = this.receiptCard.nativeElement;

    this.presentToast('Menyiapkan struk untuk diunduh...', 'primary');

    try {
      const canvas = await html2canvas(card, { scale: 2, useCORS: true });
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `receipt-${this.transactionDetails.orderId.replace('#', '')}.png`;
      a.click();
    } catch (error) {
      console.error('Gagal menyimpan struk:', error);
      this.presentToast('Gagal menyimpan struk.', 'danger');
    }
  }

  // Fungsi untuk membagikan struk menggunakan Web Share API
  async shareReceipt() {
    // Proses berbagi tetap berjalan di latar belakang jika didukung
    const shareData = {
      title: 'GoRent Payment Receipt',
      // PERBAIKAN: Gunakan `this.rentalData.vehicle.nama` bukan `this.rentalData.car.name`
      text: `Berikut adalah rincian sewa mobil ${this.rentalData.vehicle.nama} dengan Order ID: ${this.transactionDetails.orderId}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // Gagal berbagi tidak perlu menghentikan alur
        console.error('Gagal membagikan:', error);
      }
    } else {
      console.warn('Browser Anda tidak mendukung fitur berbagi.');
    }
  }

  async presentToast(
    message: string,
    color: 'primary' | 'success' | 'warning' | 'danger',
  ) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top',
    });
    toast.present();
  }

  navigateToSuccessPage() {
    // `replaceUrl: true` agar pengguna tidak bisa kembali ke halaman struk dengan tombol back
    this.router.navigate(['/transaction-success'], { replaceUrl: true });
  }
}
