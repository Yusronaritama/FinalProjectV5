import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, ModalController } from '@ionic/angular'; 
import { LocationPermissionModalComponent } from '../location-permission-modal/location-permission-modal.component'; 
import html2canvas from 'html2canvas';

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
  standalone: false // 2. Sesuai permintaan Anda
})
export class HomePage implements OnInit, OnDestroy {

  // Semua properti lama Anda tetap aman, tidak ada yang dihapus
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
  selectedCarType: string | null = 'HINO';
  displayedLocation: string = 'Aktifkan locationmu'; 
  profileAvatarIcon: string = 'person-circle-outline';
  isLoggedIn: boolean = false;
  @ViewChild('appRoot', { static: true }) appRoot!: ElementRef;

  // Properti baru untuk mengelola 'langganan' ke service
  private authSubscription: Subscription;

  constructor(
    private router: Router,
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

  async requestLocationPermission() {
    // ... kode Anda tidak berubah ...
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
        this.getCurrentLocation();
    } else if (role === 'cancel') {
        this.presentToast('Izin lokasi ditolak.', 'warning');
        this.displayedLocation = 'Izin lokasi ditolak';
    }
  }

  getCurrentLocation() {
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
}