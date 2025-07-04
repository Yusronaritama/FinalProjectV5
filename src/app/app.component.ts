// GANTI SELURUH ISI FILE DENGAN KODE INI
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
// Impor Platform dan StatusBar
import { Platform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';
import { PushNotifications } from '@capacitor/push-notifications';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs'; // Impor Subscription

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false, // Pastikan ini false jika menggunakan module
})
export class AppComponent {
  // Properti untuk menyimpan status login saat ini
  private isLoggedIn: boolean = false;
  private authSubscription!: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService, // Inject AuthService
    private platform: Platform,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    // Atur status bar agar tidak menimpa konten
    StatusBar.setOverlaysWebView({ overlay: false }); // Capacitor
    StatusBar.setStyle({ style: Style.Dark }); // Opsional: atur gaya

    this.initPushNotifications();
  }

  doLogout() {
    console.log('User logged out');
    // ... logika logout ...
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  ngOnInit() {
    // Berlangganan perubahan status login dan simpan di properti lokal
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      (status) => {
        this.isLoggedIn = status;
      },
    );
  }

  initPushNotifications() {
    // Minta izin ke pengguna untuk menampilkan notifikasi
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        // Jika diizinkan, daftarkan perangkat ke FCM
        PushNotifications.register();
      } else {
        // Tangani kasus jika pengguna tidak mengizinkan
        console.warn('Izin notifikasi tidak diberikan.');
      }
    });

    // Listener saat registrasi berhasil dan token didapatkan
    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration success, token: ' + token.value);

      // --- PERBAIKAN UTAMA: Gunakan properti lokal 'isLoggedIn' ---
      this.authService.setFcmToken(token.value);
      // -----------------------------------------------------------
    });

    // Listener saat registrasi gagal
    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error on registration: ' + JSON.stringify(error));
    });

    // Listener saat notifikasi diterima ketika aplikasi sedang berjalan (di foreground)
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification) => {
        console.log('Push received: ', notification);
        // Anda bisa menampilkan alert atau toast di sini
      },
    );

    // Listener saat notifikasi di-tap oleh pengguna
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification) => {
        console.log('Push action performed: ', notification);
        // Arahkan pengguna ke halaman yang relevan, misalnya halaman aktivitas
        // const redirectUrl = notification.notification.data.redirectUrl || '/activity';
        // this.router.navigateByUrl(redirectUrl);
      },
    );
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
