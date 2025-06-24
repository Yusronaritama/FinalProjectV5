import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction-success',
  templateUrl: './transaction-success.page.html',
  styleUrls: ['./transaction-success.page.scss'],
  standalone: false
})
export class TransactionSuccessPage {

  constructor(private router: Router) { }

  goToActivity() {
    // Arahkan ke halaman riwayat aktivitas/transaksi
    this.router.navigateByUrl('/activity', { replaceUrl: true });
  }

  goToHome() {
    // Arahkan kembali ke halaman utama
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }
}