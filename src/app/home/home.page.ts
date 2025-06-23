import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import html2canvas from 'html2canvas';
import { LocationPermissionModalComponent } from '../location-permission-modal/location-permission-modal.component';

// Definisikan interface CarType di sini agar dikenali
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

  // Properti untuk data dan state halaman
  isLoggedIn: boolean = false;
  profileAvatarIcon: string = 'person-circle-outline';
  displayedLocation: string = 'Izinkan lokasi untuk pengalaman yang lebih baik';
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

  constructor(
    private router: Router,
    private toastController: ToastController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.checkLoginStatusAndLoadAvatar();
  }

  // Fungsi untuk memeriksa status login dan avatar
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
          console.error('Error parsing users from localStorage', e);
          this.profileAvatarIcon = 'person-circle-outline';
        }
      }
    } else {
      this.profileAvatarIcon = 'person-circle-outline';
    }
  }

  // Fungsi untuk membuka pop-up pencarian sewa
  async openRentalModal() {
    // Karena kita sepakat menggunakan trigger di HTML, fungsi ini bisa dikosongkan
    // atau digunakan untuk logika tambahan jika perlu di masa depan.
    // Keberadaan fungsi ini akan menyelesaikan error "property does not exist".
    console.log('Tombol "Ayok Pesan!" diklik. Modal akan terbuka melalui trigger di HTML.');
  }

  // Fungsi untuk navigasi
  navigateToCarList(carId: string) {
    if (carId) {
      this.router.navigate(['/car-list', carId.toLowerCase()]);
    }
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }

  // Fungsi untuk menangani izin lokasi
  async requestLocationPermission() {
    const modal = await this.modalController.create({
      component: LocationPermissionModalComponent,
      cssClass: 'location-permission-modal',
      backdropDismiss: false,
    });
    await modal.present();

    const { role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.getCurrentLocation();
    } else {
      this.presentToast('Izin lokasi ditolak.', 'warning');
      this.displayedLocation = 'Izin lokasi ditolak';
    }
  }
  
  // Fungsi untuk mendapatkan lokasi saat ini
  getCurrentLocation() {
    this.displayedLocation = 'Mencari lokasi...';
    // ... (logika geolocation Anda) ...
    setTimeout(() => {
        this.displayedLocation = 'Karawang, Jawa Barat';
        this.presentToast('Lokasi ditemukan!', 'success');
    }, 1500);
  }

  // Fungsi helper untuk menampilkan notifikasi toast
  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
    });
    toast.present();
  }
}