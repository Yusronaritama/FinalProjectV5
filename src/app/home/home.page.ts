import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import html2canvas from 'html2canvas';
import { LocationPermissionModalComponent } from '../location-permission-modal/location-permission-modal.component';

// 1. Impor hal-hal yang kita butuhkan untuk state management
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

interface CarType {
  id: string;
  name: string;
  imageUrl: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
<<<<<<< HEAD
  standalone: false // 2. Sesuai permintaan Anda
=======
  standalone: false
>>>>>>> ac753e8de985b86de47c21802e49f6ea95a94089
})
export class HomePage implements OnInit {

<<<<<<< HEAD
  // Semua properti lama Anda tetap aman, tidak ada yang dihapus
  userId: string | null = null;
=======
>>>>>>> ac753e8de985b86de47c21802e49f6ea95a94089
  carTypes: CarType[] = [
    { id: 'wuling', name: 'WULING', imageUrl: 'assets/logomobil/wuling.jpg' },
    { id: 'bmw', name: 'BMW', imageUrl: 'assets/logomobil/bmw.jpg' },
    { id: 'hino', name: 'HINO', imageUrl: 'assets/logomobil/hino.jpg' },
    { id: 'honda', name: 'HONDA', imageUrl: 'assets/logomobil/honda.jpg' },
    { id: 'hyundai', name: 'HYUNDAI', imageUrl: 'assets/logomobil/hyundai.jpg' },
    { id: 'isuzu', name: 'ISUZU', imageUrl: 'assets/logomobil/isuzu.png' },
    { id: 'mitsubishi', name: 'MITSUBISHI', imageUrl: 'assets/logomobil/Mitsubishi_.png' },
    { id: 'suzuki', name: 'SUZUKI', imageUrl: 'assets/logomobil/suzuki.jpg' },
    { id: 'toyota', name: 'TOYOTA', imageUrl: 'assets/logomobil/toyota.jpg' },
  ];
<<<<<<< HEAD
  selectedCarType: string | null = 'HINO';
  displayedLocation: string = 'Aktifkan locationmu'; 
  profileAvatarIcon: string = 'person-circle-outline';
  isLoggedIn: boolean = false;
  @ViewChild('appRoot', { static: true }) appRoot!: ElementRef;
=======

  displayedLocation: string = 'Izinkan Lokasi';
  profileAvatarIcon: string = 'person-circle-outline';
  isLoggedIn: boolean = false;
>>>>>>> ac753e8de985b86de47c21802e49f6ea95a94089

  // Properti baru untuk mengelola 'langganan' ke service
  private authSubscription: Subscription;

  constructor(
    private router: Router,
<<<<<<< HEAD
    private toastController: ToastController, 
    private modalController: ModalController,
    private elementRef: ElementRef,
    private authService: AuthService // 3. Suntikkan AuthService
  ) {
    this.authSubscription = new Subscription();
  }

  ngOnInit() {
    // 4. Di sinilah "keajaibannya". Kita 'berlangganan' pada status login dari AuthService
    // Kode di dalam subscribe ini akan otomatis berjalan setiap kali status login berubah.
    this.authSubscription = this.authService.isAuthenticated$.subscribe(status => {
      console.log('HomePage received new auth status from service:', status);
      this.isLoggedIn = status;
      // Langsung ubah ikon berdasarkan status terbaru
      this.profileAvatarIcon = this.isLoggedIn ? 'person-circle' : 'person-circle-outline';
    });
  }
  
  // Method ionViewWillEnter dan checkLoginStatusAndLoadAvatar tidak lagi kita perlukan,
  // karena `ngOnInit` dengan `subscribe` sudah menangani semuanya secara otomatis dan reaktif.

  ngOnDestroy() {
    // 5. Praktik terbaik: Hentikan 'langganan' saat halaman ditutup untuk mencegah kebocoran memori
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
  
  // --- SEMUA METHOD LAMA ANDA TETAP ADA DI BAWAH INI ---
  
  async captureAndBlurBackground(): Promise<string | null> {
    // ... kode Anda tidak berubah ...
    const appElement = document.querySelector('ion-app');
    if (!appElement) { return null; }
    try {
      await new Promise(resolve => setTimeout(resolve, 100)); 
      const canvas = await html2canvas(appElement as HTMLElement, {
        allowTaint: true,
        useCORS: true,   
        ignoreElements: (element) => element.classList.contains('location-permission-modal')
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

=======
    private toastController: ToastController,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.checkLoginStatusAndLoadAvatar();
  }

  checkLoginStatusAndLoadAvatar() {
    const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
    this.isLoggedIn = !!loggedInUserEmail;

    if (this.isLoggedIn) {
      const storedUsersString = localStorage.getItem('registeredUsers');
      if (storedUsersString) {
        try {
          const registeredUsers = JSON.parse(storedUsersString);
          const user = registeredUsers.find((u: any) => u.email === loggedInUserEmail);
          this.profileAvatarIcon = user?.avatarIcon || 'person-circle-outline';
        } catch (e) {
          this.profileAvatarIcon = 'person-circle-outline';
        }
      }
    } else {
      this.profileAvatarIcon = 'person-circle-outline';
    }
  }

  navigateToCarList(brandId: string) {
    if (!brandId) return;
    console.log('Navigating to car list for brand:', brandId);
    this.router.navigate(['/car-list', brandId.toLowerCase()]);
  }

  goToProfile() {
    this.router.navigateByUrl('/profile');
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }
  
>>>>>>> ac753e8de985b86de47c21802e49f6ea95a94089
  async requestLocationPermission() {
    // ... kode Anda tidak berubah ...
    if (!navigator.geolocation) {
        this.presentToast('Geolocation tidak didukung oleh browser ini.', 'danger');
        return;
    }
    const blurredBgImage = await this.captureAndBlurBackground();
    const modal = await this.modalController.create({
<<<<<<< HEAD
        component: LocationPermissionModalComponent, 
        cssClass: 'location-permission-modal', 
        backdropDismiss: false,
        componentProps: {
            blurredBackgroundImage: blurredBgImage
        }
=======
      component: LocationPermissionModalComponent,
      cssClass: 'location-permission-modal',
      backdropDismiss: false,
      componentProps: {
        blurredBackgroundImage: blurredBgImage,
      },
>>>>>>> ac753e8de985b86de47c21802e49f6ea95a94089
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
<<<<<<< HEAD
        this.getCurrentLocation();
    } else if (role === 'cancel') {
        this.presentToast('Izin lokasi ditolak.', 'warning');
        this.displayedLocation = 'Izin lokasi ditolak';
=======
      this.getCurrentLocation();
    } else if (role === 'cancel') {
      this.presentToast('Izin lokasi ditolak.', 'warning');
      this.displayedLocation = 'Izin lokasi ditolak';
    }
  }
  
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
        },
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
>>>>>>> ac753e8de985b86de47c21802e49f6ea95a94089
    }
  }

  getCurrentLocation() {
<<<<<<< HEAD
    // ... kode Anda tidak berubah ...
    this.displayedLocation = 'Mencari lokasi akurat...';
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            this.displayedLocation = 'Karawang, Jawa Barat';
        },
        (error) => {
            console.error('Error mendapatkan lokasi:', error);
            this.displayedLocation = 'Gagal mendapatkan lokasi';
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
=======
    this.displayedLocation = 'Mencari lokasi akurat...';
    this.presentToast('Mencoba mendapatkan lokasi Anda...', 'primary');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.displayedLocation = 'Karawang, Jawa Barat';
        this.presentToast(`Lokasi didapatkan: Karawang, Jawa Barat`, 'success');
      },
      (error) => {
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
            errorMessage =
              'Terjadi kesalahan tidak dikenal saat mendapatkan lokasi.';
            break;
        }
        this.presentToast(errorMessage, 'danger');
        this.displayedLocation = 'Gagal mendapatkan lokasi';
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
>>>>>>> ac753e8de985b86de47c21802e49f6ea95a94089
    );
  }

  async presentToast(message: string, color: string = 'dark') {
    // ... kode Anda tidak berubah ...
    const toast = await this.toastController.create({
        message: message,
        duration: 3000,
        position: 'bottom',
        color: color,
    });
    toast.present();
  }
<<<<<<< HEAD

  selectCarType(carTypeName: string) {
    // ... kode Anda tidak berubah ...
    this.selectedCarType = carTypeName;
  }

  goToProfile() {
    this.router.navigateByUrl('/profile');
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }
=======
>>>>>>> ac753e8de985b86de47c21802e49f6ea95a94089
}