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
    { id: 'wuling', name: 'WULING', imageUrl: 'assets/logomobil/wuling.jpg' },
    { id: 'bmw', name: 'BWM', imageUrl: 'assets/logomobil/bmw.jpg' },
    { id: 'hino', name: 'HINO', imageUrl: 'assets/logomobil/hino.jpg' },
    { id: 'honda', name: 'HONDA', imageUrl: 'assets/logomobil/honda.jpg' },
    { id: 'hyundai', name: 'HYUNDAI', imageUrl: 'assets/logomobil/hyundai.jpg' },
    { id: 'isuzu', name: 'ISUZU', imageUrl: 'assets/logomobil/isuzu.png' },
    { id: 'mitsubishi', name: 'MITSUBISHI', imageUrl: 'assets/logomobil/Mitsubishi_.png' },
    { id: 'suzuki', name: 'SUZUKI', imageUrl: 'assets/logomobil/suzuki.jpg' },
    { id: 'toyota', name: 'TOYOTA', imageUrl: 'assets/logomobil/toyota.jpg' },
  ];
  selectedCarType: string | null = 'HINO'; // Default active car type as per your HTML

  displayedLocation: string = 'Aktifkan locationmu'; 
  profileAvatarIcon: string = 'person-circle-outline'; // Ikon default untuk profil di header home
  isLoggedIn: boolean = false; // NEW: Properti untuk melacak status login

  @ViewChild('appRoot', { static: true }) appRoot!: ElementRef;

  constructor(
    private router: Router,
    private toastController: ToastController, 
    private modalController: ModalController,
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
    // ngOnInit hanya dipanggil sekali saat komponen dibuat.
    // Untuk update setiap kali halaman diakses, gunakan ionViewWillEnter.
  }

  // Ionic Lifecycle Hook: Dipanggil setiap kali view akan masuk ke tampilan
  ionViewWillEnter() {
    this.checkLoginStatusAndLoadAvatar(); // NEW: Panggil metode baru ini
  }

  /**
   * Memeriksa status login dan memuat ikon avatar profil dari localStorage.
   */
  checkLoginStatusAndLoadAvatar() {
    const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
    this.isLoggedIn = !!loggedInUserEmail; // Set isLoggedIn berdasarkan keberadaan email

    if (this.isLoggedIn) {
      const storedUsersString = localStorage.getItem('registeredUsers');
      if (storedUsersString) {
        try {
          const registeredUsers = JSON.parse(storedUsersString);
          const user = registeredUsers.find((u: any) => u.email === loggedInUserEmail);
          if (user && user.avatarIcon) {
            this.profileAvatarIcon = user.avatarIcon;
            console.log('Home Page Profile Avatar loaded:', this.profileAvatarIcon);
          } else {
            this.profileAvatarIcon = 'person-circle-outline'; // Fallback jika avatarIcon tidak ada
          }
        } catch (e) {
          console.error('Error loading profile avatar from localStorage:', e);
          this.profileAvatarIcon = 'person-circle-outline'; // Fallback saat terjadi error
        }
      }
    } else {
      this.profileAvatarIcon = 'person-circle-outline'; // Jika tidak login, tampilkan ikon default
      console.log('User is not logged in. Showing default profile icon.');
    }
  }

  /**
   * Mengambil screenshot dari tampilan aplikasi saat ini,
   * menerapkan efek blur, dan mengembalikannya sebagai data URL.
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
   */
  selectCarType(carTypeName: string) {
    this.selectedCarType = carTypeName;
    console.log('Selected car type:', this.selectedCarType);
  }

  ngOnDestroy() { }

  /**
   * Navigasi ke halaman profil pengguna.
   */
  goToProfile() {
    this.router.navigateByUrl('/profile');
  }

  /**
   * Navigasi ke halaman login.
   */
  goToLogin() {
    this.router.navigateByUrl('/login');
  }

}
