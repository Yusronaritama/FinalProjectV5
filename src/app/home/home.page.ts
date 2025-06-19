import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import html2canvas from 'html2canvas';
import { LocationPermissionModalComponent } from '../location-permission-modal/location-permission-modal.component';

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
export class HomePage implements OnInit {

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

  displayedLocation: string = 'Izinkan Lokasi';
  profileAvatarIcon: string = 'person-circle-outline';
  isLoggedIn: boolean = false;

  constructor(
    private router: Router,
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
        blurredBackgroundImage: blurredBgImage,
      },
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
    }
  }

  getCurrentLocation() {
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
    );
  }

  async presentToast(message: string, color: string = 'dark') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: color,
    });
    toast.present();
  }
}