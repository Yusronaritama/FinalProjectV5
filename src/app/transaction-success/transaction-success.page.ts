import { Component, OnInit } from '@angular/core'; // Impor OnInit
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction-success',
  templateUrl: './transaction-success.page.html',
  styleUrls: ['./transaction-success.page.scss'],
  standalone: false
})
export class TransactionSuccessPage implements OnInit {

  public message: string = 'Terima kasih telah melakukan pembayaran. Transaksi Anda akan segera kami proses.';

  constructor(private router: Router) {
    // Ambil state dari navigasi
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['message']) {
      this.message = navigation.extras.state['message'];
    }
  }

  ngOnInit() { } // ngOnInit bisa dikosongkan

  goToActivity() {
    // Arahkan ke halaman riwayat aktivitas/transaksi
    this.router.navigateByUrl('/activity', { replaceUrl: true });
  }

  goToHome() {
    // Arahkan kembali ke halaman utama
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }
}