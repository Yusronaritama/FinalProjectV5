// GANTI SELURUH ISI FILE DENGAN KODE INI
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleService } from '../services/vehicle.service';

@Component({
  selector: 'app-waiting-confirmation',
  templateUrl: './waiting-confirmation.page.html',
  styleUrls: ['./waiting-confirmation.page.scss'],
  standalone: false
})
export class WaitingConfirmationPage implements OnInit, OnDestroy {

  private rental: any;
  private pollingInterval: any;

  constructor(
    private router: Router,
    private rentalService: VehicleService // Inject service Anda
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['rental']) {
      this.rental = navigation.extras.state['rental'];
    } else {
      console.error('Data rental tidak ditemukan, kembali ke home.');
      this.router.navigateByUrl('/home', { replaceUrl: true });
    }
  }

  ngOnInit() {
    if (this.rental && this.rental.id) {
      // Mulai memeriksa status setiap 5 detik
      this.pollingInterval = setInterval(() => {
        this.checkPaymentStatus();
      }, 5000);
    }
  }

  checkPaymentStatus() {
    console.log(`Mengecek status untuk rental ID: ${this.rental.id}`);
    this.rentalService.getRentalStatus(this.rental.id).subscribe({
      next: (response) => {
        // Asumsikan backend mengembalikan status 'lunas' atau 'paid'
        if (response.status_pembayaran === 'lunas' || response.status_pembayaran === 'paid') {
          console.log('Pembayaran terkonfirmasi!');
          this.stopPollingAndNavigate();
        } else {
          console.log('Status masih:', response.status_pembayaran);
        }
      },
      error: (err) => {
        console.error('Gagal mengecek status:', err);
      }
    });
  }

  stopPollingAndNavigate() {
    clearInterval(this.pollingInterval);
    this.router.navigate(['/transaction-success'], { replaceUrl: true });
  }

  // Pastikan interval berhenti jika pengguna meninggalkan halaman
  ngOnDestroy() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  // --- FUNGSI BARU UNTUK TOMBOL KEMBALI ---
  goToHome() {
    // 1. Hentikan polling agar tidak berjalan di latar belakang
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
    // 2. Arahkan pengguna ke halaman Beranda
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }
}