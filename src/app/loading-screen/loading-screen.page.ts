import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen'; // Import untuk menyembunyikan splash screen native

@Component({
  selector: 'app-loading-screen', // Pastikan selector ini cocok dengan nama komponen Anda
  templateUrl: './loading-screen.page.html',
  styleUrls: ['./loading-screen.page.scss'],
  standalone: false
})
export class LoadingScreenPage implements OnInit {

  constructor(
    private router: Router,
    private platform: Platform // Digunakan untuk mendeteksi kapan platform siap
  ) { }

  ngOnInit() {
    this.platform.ready().then(async () => {
      // Pastikan Splash Screen native disembunyikan setelah platform siap
      // Ini penting jika launchAutoHide di capacitor.config.ts disetel false
      await SplashScreen.hide();

      // Logika inisialisasi aplikasi Anda di sini.
      // Contoh: memeriksa token autentikasi, memuat konfigurasi awal, dll.
      // Untuk tujuan demonstrasi, kita hanya akan menggunakan setTimeout.

      const loadingDuration = 3000; // Durasi custom loading screen (3 detik)

      setTimeout(() => {
        // Setelah durasi loading, navigasi ke halaman login
        // Gunakan replaceUrl: true agar pengguna tidak bisa kembali ke loading screen
        this.router.navigateByUrl('/login', { replaceUrl: true });

        // Atau, jika Anda ingin ada logika cek sesi login sebelum ke login:
        // this.checkUserSession(); // Panggil method untuk cek sesi
      }, loadingDuration);
    });
  }

  // Opsi: Method untuk memeriksa sesi pengguna (jika Anda ingin ini di loading screen)
  /*
  checkUserSession() {
    const isLoggedIn = localStorage.getItem('isLoggedIn'); // Contoh sederhana
    if (isLoggedIn === 'true') {
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } else {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }
  }
  */
}