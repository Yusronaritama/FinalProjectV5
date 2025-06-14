import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular'; // Impor AlertController dan ToastController

// Define interface for CarType
interface CarType {
  id: string;
  name: string;
  imageUrl: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false // Assuming it's a non-standalone component
})
export class HomePage implements OnInit, OnDestroy {

  userId: string | null = null;
  
  // carTypes sekarang menjadi array statis (data placeholder seperti di HTML awal)
  carTypes: CarType[] = [
    { id: 'tesla', name: 'TESLA', imageUrl: 'https://placehold.co/80x80/E0E0E0/white?text=TESLA' },
    { id: 'nissan', name: 'NISSAN', imageUrl: 'https://placehold.co/80x80/E0E0E0/white?text=NISSAN' },
    { id: 'toyota', name: 'TOYOTA', imageUrl: 'https://placehold.co/80x80/E0E0E0/white?text=TOYOTA' },
    { id: 'bmw', name: 'BMW', imageUrl: 'https://placehold.co/80x80/E0E0E0/white?text=BMW' },
    // Tambahkan lebih banyak tipe mobil statis di sini jika diinginkan
  ];
  selectedCarType: string | null = null; // To manage the active filter

  constructor(
    private router: Router,
    private alertController: AlertController, // Inject AlertController
    private toastController: ToastController // Inject ToastController
  ) { }

  ngOnInit() {
    // Initial logic for home page
  }

  // Method to request location permission and show popup
  async requestLocationPermission() {
    // Periksa apakah Geolocation API tersedia di browser
    if (!navigator.geolocation) {
      this.presentToast('Geolocation tidak didukung oleh browser ini.', 'danger');
      return;
    }

    const alert = await this.alertController.create({
      header: '', // Mengosongkan header bawaan Ionic
      message: `
        <div class="alert-custom-content">
          <div class="alert-location-icon-container">
            <ion-icon name="location" class="alert-location-icon"></ion-icon>
          </div>
          <h2 class="alert-title-custom">Izinkan Akses Lokasi</h2>
          <p class="alert-message-custom">Aktifkan GPS pada perangkat Anda untuk menikmati fitur lengkap dan keamanan selama pemesanan.</p>
        </div>
      `,
      // Menambahkan class CSS kustom untuk styling tambahan
      cssClass: 'custom-location-alert',
      buttons: [
        {
          text: 'Lain Kali', // Tombol "Lain Kali"
          role: 'cancel',
          handler: () => {
            console.log('User denied location permission from custom alert');
            this.presentToast('Izin lokasi ditolak.', 'warning');
          },
          cssClass: 'alert-button-secondary' // Class untuk tombol Lain Kali
        },
        {
          text: 'Izinkan', // Tombol "Izinkan"
          handler: () => {
            console.log('User allowed location permission from custom alert');
            this.getCurrentLocation(); // Lanjutkan untuk mendapatkan lokasi
          },
          cssClass: 'alert-button-primary' // Class untuk tombol Izinkan
        },
      ],
    });

    await alert.present();
  }

  // Method to get the current location after permission is granted
  getCurrentLocation() {
    this.presentToast('Mencoba mendapatkan lokasi Anda...', 'primary');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(`Lokasi didapatkan: Latitude ${latitude}, Longitude ${longitude}`);
        this.presentToast(`Lokasi didapatkan: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, 'success');
        // Di sini Anda bisa menyimpan lokasi atau memprosesnya lebih lanjut
        // Contoh: this.currentLocation = `Lat: ${latitude}, Lon: ${longitude}`;
      },
      (error) => {
        console.error('Error mendapatkan lokasi:', error);
        let errorMessage = 'Gagal mendapatkan lokasi.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Izin lokasi ditolak oleh pengguna.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Informasi lokasi tidak tersedia.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Waktu permintaan lokasi habis.';
            break;
          default:
            errorMessage = 'Terjadi kesalahan tidak dikenal saat mendapatkan lokasi.';
            break;
        }
        this.presentToast(errorMessage, 'danger');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  // Helper method to present a Toast message
  async presentToast(message: string, color: string = 'dark') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: color,
    });
    toast.present();
  }


  // Method to handle car type selection (for active state)
  selectCarType(carTypeName: string) {
    this.selectedCarType = carTypeName;
    console.log('Selected car type:', this.selectedCarType);
    // Logika untuk memfilter popular cars sekarang harus bergantung pada data lokal
    // atau sumber data lain.
  }

  ngOnDestroy() {
    // Cleanup if any subscriptions exist (currently none from Firestore)
  }

  // Header button actions
  goToProfile() {
    this.router.navigateByUrl('/profile');
  }

}
