import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, ModalController } from '@ionic/angular'; 
import { LocationPermissionModalComponent } from '../location-permission-modal/location-permission-modal.component'; 
import html2canvas from 'html2canvas';

interface CarType {
  id: string;
  name: string;
  imageUrl: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false 
})
export class HomePage implements OnInit, OnDestroy {

  userId: string | null = null;
  
  carTypes: CarType[] = [
    { id: 'tesla', name: 'TESLA', imageUrl: 'https://placehold.co/80x80/E0E0E0/white?text=TESLA' },
    { id: 'nissan', name: 'NISSAN', imageUrl: 'https://placehold.co/80x80/E0E0E0/white?text=NISSAN' },
    { id: 'toyota', name: 'TOYOTA', imageUrl: 'https://placehold.co/80x80/E0E0E0/white?text=TOYOTA' },
    { id: 'bmw', name: 'BMW', imageUrl: 'https://placehold.co/80x80/E0E0E0/white?text=BMW' },
  ];
  selectedCarType: string | null = null;

  // Properti baru untuk menampilkan lokasi di UI
  displayedLocation: string = 'Aktifkan locationmu'; 

  @ViewChild('appRoot', { static: true }) appRoot!: ElementRef;

  constructor(
    private router: Router,
    private toastController: ToastController, 
    private modalController: ModalController,
    private elementRef: ElementRef
  ) { }

  ngOnInit() { }

  /**
   * Mengambil screenshot dari tampilan aplikasi saat ini,
   * menerapkan efek blur, dan mengembalikannya sebagai data URL.
   * Ini digunakan sebagai fallback untuk `backdrop-filter` di lingkungan
   * di mana itu tidak didukung dengan baik.
   * @returns Promise<string | null> Data URL dari gambar yang diblur atau null jika gagal.
   */
  async captureAndBlurBackground(): Promise<string | null> {
    const appElement = document.querySelector('ion-app');

    if (!appElement) {
      console.error('Elemen ion-app tidak ditemukan.');
      return null;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 100)); 
      
      const canvas = await html2canvas(appElement as HTMLElement, {
        allowTaint: true,
        useCORS: true,   
        ignoreElements: (element) => {
          return element.classList.contains('location-permission-modal');
        }
      });

      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = canvas.width;
      offscreenCanvas.height = canvas.height;
      const ctx = offscreenCanvas.getContext('2d');
      if (ctx) {
        ctx.filter = 'blur(10px)'; 
        ctx.drawImage(canvas, 0, 0); 
        return offscreenCanvas.toDataURL('image/png'); 
      }
      return null;

    } catch (error) {
      console.error('Gagal mengambil atau mengaburkan screenshot:', error);
      this.presentToast('Gagal memuat latar belakang.', 'danger');
      return null;
    }
  }

  /**
   * Menampilkan modal izin lokasi kustom.
   * Ini pertama-tama mengambil screenshot latar belakang yang diblur dan meneruskannya ke modal.
   */
  async requestLocationPermission() {
    if (!navigator.geolocation) {
      this.presentToast('Geolocation tidak didukung oleh browser ini.', 'danger');
      return;
    }

    const blurredBgImage = await this.captureAndBlurBackground();

    const modal = await this.modalController.create({
      component: LocationPermissionModalComponent, 
      cssClass: 'location-permission-modal', 
      backdropDismiss: false,
      componentProps: {
        blurredBackgroundImage: blurredBgImage
      }
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log('Pengguna mengkonfirmasi izin lokasi dari modal.');
      this.getCurrentLocation();
    } else if (role === 'cancel') {
      console.log('Pengguna menolak izin lokasi dari modal.');
      this.presentToast('Izin lokasi ditolak.', 'warning');
      this.displayedLocation = 'Izin lokasi ditolak'; // Perbarui teks saat penolakan
    }
  }

  /**
   * Mencoba mendapatkan geolokasi perangkat saat ini.
   */
  getCurrentLocation() {
    this.displayedLocation = 'Mencari lokasi akurat...'; // Perbarui teks saat mencari
    this.presentToast('Mencoba mendapatkan lokasi Anda...', 'primary');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const locationString = `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`;
        console.log(`Lokasi didapatkan: ${locationString}`);
        
        // Simulasikan atau panggil reverse geocoding API di sini
        // Misalnya, jika Anda memiliki API untuk mendapatkan nama kota/provinsi
        // Untuk tujuan demo, kita akan menggunakan string placeholder yang lebih deskriptif
        this.displayedLocation = 'Karawang, Jawa Barat'; // Contoh: nama kota dan provinsi
        this.presentToast(`Lokasi didapatkan: Karawang, Jawa Barat`, 'success');

        // Opsional: Jika Anda ingin menyimpan lokasi lengkap ke localStorage (misalnya untuk halaman profil)
        // localStorage.setItem('currentDetailedLocation', 'Karawang, Jawa Barat');
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
        this.displayedLocation = 'Gagal mendapatkan lokasi'; // Perbarui teks saat error
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  /**
   * Metode pembantu untuk menampilkan pesan Toast.
   * @param message Pesan yang akan ditampilkan di toast.
   * @param color Warna toast (misalnya, 'dark', 'primary', 'success', 'danger').
   */
  async presentToast(message: string, color: string = 'dark') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: color,
    });
    toast.present();
  }

  /**
   * Menangani pemilihan jenis mobil untuk tujuan pemfilteran.
   * @param carTypeName Nama jenis mobil yang dipilih.
   */
  selectCarType(carTypeName: string) {
    this.selectedCarType = carTypeName;
    console.log('Selected car type:', this.selectedCarType);
  }

  ngOnDestroy() {
    // Cleanup jika ada langganan atau listener (saat ini tidak ada dari Firestore)
  }

  /**
   * Navigasi ke halaman profil pengguna.
   */
  goToProfile() {
    this.router.navigateByUrl('/profile');
  }

}
