// GANTI SELURUH ISI FILE DENGAN KODE INI

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
// Impor Platform dan StatusBar
import { Platform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false // Pastikan ini false jika menggunakan module
})
export class AppComponent {
  
  constructor(
    private router: Router,
    private platform: Platform 
  ) {
    this.initializeApp();
  }

  initializeApp() {
    // Atur status bar agar tidak menimpa konten
    StatusBar.setOverlaysWebView({ overlay: false }); // Capacitor
    StatusBar.setStyle({ style: Style.Dark }); // Opsional: atur gaya
  }
  
  doLogout() {
    console.log('User logged out');
    // ... logika logout ...
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}