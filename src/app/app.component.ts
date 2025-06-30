// src/app/app.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
// --- TAMBAHAN 1: Impor Platform dan StatusBar ---
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false
})
export class AppComponent {
  
  // --- TAMBAHAN 2: Inject Platform ke dalam constructor ---
  constructor(
    private router: Router,
    private platform: Platform 
  ) {
    // Panggil fungsi inisialisasi aplikasi
    this.initializeApp();
  }

  // --- TAMBAHAN 3: Buat fungsi initializeApp untuk logika awal ---
  initializeApp() {
    this.platform.ready().then(async () => { // Tambahkan async di sini
      if (this.platform.is('capacitor')) {
        // ... (kode StatusBar Anda tetap di sini)
        

        // --- TAMBAHAN: Sembunyikan SplashScreen setelah semua siap ---
        await SplashScreen.hide();
      }
    });
  }
  
  // Fungsi logout Anda tetap ada dan tidak diubah
  doLogout() {
    console.log('User logged out');
    // Implementasi logika logout di sini:
    // - Hapus token autentikasi (dari localStorage, sessionStorage, atau service)
    // - Arahkan pengguna ke halaman login
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}