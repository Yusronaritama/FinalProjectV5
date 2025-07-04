import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, Platform } from '@ionic/angular';
import html2canvas from 'html2canvas';

// --- PERBAIKAN: Impor plugin Capacitor ---
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.page.html',
  styleUrls: ['./receipt.page.scss'],
  standalone: false,
})
export class ReceiptPage implements OnInit {
  
  public rentalData: any;
  public transactionDetails: any = {};

  constructor(
    private router: Router,
    private toastController: ToastController,
    // --- PERBAIKAN: Inject Platform untuk memastikan perangkat siap ---
    private platform: Platform,
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
        status: this.rentalData.payment.status_pembayaran === 'lunas' ? 'Paid' : 'Pending',
        statusColor: this.rentalData.payment.status_pembayaran === 'lunas' ? 'success' : 'warning',
      };
    }
  }

  /**
   * --- PERBAIKAN: Fungsi helper untuk mengambil screenshot elemen struk ---
   * Mengembalikan data gambar dalam format base64.
   */
  private async captureReceiptAsBase64(): Promise<string> {
    await this.platform.ready(); // Pastikan DOM sudah siap
    const element = document.getElementById('receipt-to-print');
    if (!element) {
      throw new Error('Elemen struk tidak ditemukan!');
    }
    const canvas = await html2canvas(element, { scale: 2 });
    // Kembalikan data base64 saja, tanpa prefix
    return canvas.toDataURL('image/png').split(',')[1];
  }


  /**
   * --- PERBAIKAN: Fungsi untuk menyimpan struk menggunakan Capacitor Filesystem ---
   */
  async saveReceipt() {
    // Hanya berjalan di perangkat mobile
    if (!this.platform.is('capacitor')) {
      this.presentToast('Fitur ini hanya tersedia di aplikasi mobile.', 'warning');
      return;
    }
    
    try {
      this.presentToast('Menyiapkan struk...', 'primary');
      const base64Data = await this.captureReceiptAsBase64();
      const fileName = `receipt-${this.transactionDetails.orderId.replace('#', '')}.png`;

      // Simpan file ke folder Downloads
      await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Documents,
      });

      this.presentToast(`Struk disimpan di folder Documents!`, 'success');
    } catch (error) {
      console.error('Gagal menyimpan struk:', error);
      this.presentToast('Oops! Gagal menyimpan struk.', 'danger');
    }
  }

  /**
   * --- PERBAIKAN: Fungsi untuk membagikan struk menggunakan Capacitor Share ---
   */
  async shareReceipt() {
    // Hanya berjalan di perangkat mobile
    if (!this.platform.is('capacitor')) {
      this.presentToast('Fitur ini hanya tersedia di aplikasi mobile.', 'warning');
      return;
    }

    try {
      this.presentToast('Menyiapkan struk...', 'primary');
      const base64Data = await this.captureReceiptAsBase64();
      const fileName = `receipt-share.png`;

      // Simpan file ke direktori sementara (Cache) agar bisa di-share
      const result = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Cache,
      });

      // Bagikan file menggunakan URI yang didapat
      await Share.share({
        title: 'Bukti Pembayaran GoRent',
        text: `Berikut adalah bukti pembayaran sewa mobil ${this.rentalData.vehicle.nama}.`,
        url: result.uri, // Path ke file di cache
      });
    } catch (error) {
      // Jangan tampilkan error jika pengguna sengaja membatalkan dialog share
      if ((error as Error).message !== 'Share canceled') {
        console.error('Gagal membagikan struk:', error);
        this.presentToast('Oops! Gagal membagikan struk.', 'danger');
      }
    }
  }

  // Fungsi bantuan untuk menampilkan pesan toast (tidak diubah)
  async presentToast(message: string, color: 'primary' | 'success' | 'warning' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top',
    });
    toast.present();
  }

  // Fungsi navigasi (tidak diubah)
  navigateToSuccessPage() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }
}