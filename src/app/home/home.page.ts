import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, ModalController } from '@ionic/angular';
import { LocationPermissionModalComponent } from '../location-permission-modal/location-permission-modal.component';
import { format, parseISO, add } from 'date-fns';

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

  @ViewChild('bannerScroller') bannerScroller!: ElementRef<HTMLElement>;
  private scrollInterval: any;

  bannerImages = [
    'assets/image/tankleopard.jpeg', // Gambar pertama Anda
    'assets/image/tankarbrams.jpeg', // Contoh gambar kedua
    'assets/image/tankt90m.jpg'  // Contoh gambar ketiga
    // Anda bisa menambahkan gambar lain di sini
  ];
  // Properti untuk form pencarian
  searchDriverOption: 'dengan-sopir' | 'lepas-kunci' = 'dengan-sopir';
  // Properti searchLocation dihapus
  searchPickupDate: string = new Date().toISOString();
  formattedDate: string = '';
  formattedReturnDate: string = '';

  // Properti lain yang sudah ada
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
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.updateFormattedDates();
  }

  ionViewWillEnter() {
    this.checkLoginStatusAndLoadAvatar();
  }

  ionViewDidEnter() {
    this.startBannerAutoScroll(); // Mulai auto-scroll saat halaman aktif
  }

  ionViewWillLeave() {
    this.stopBannerAutoScroll(); // Hentikan auto-scroll saat halaman ditinggalkan
  }

  ngOnDestroy() {
    this.stopBannerAutoScroll(); // Pastikan interval dibersihkan saat komponen dihancurkan
  }

  dateChanged(event: any) {
    this.searchPickupDate = event.detail.value;
    this.updateFormattedDates();
  }

  updateFormattedDates() {
    const pickup = parseISO(this.searchPickupDate);
    const returnD = add(pickup, { hours: 12 });
    this.formattedDate = format(pickup, 'EEE, d MMM');
    this.formattedReturnDate = format(returnD, 'EEE, d MMM • HH:mm');
  }

  searchCars() {
    // Objek searchParams sekarang tidak lagi menyertakan location
    const searchParams = {
      driverOption: this.searchDriverOption,
      pickupDate: this.searchPickupDate
    };
    console.log('Mencari mobil dengan parameter:', searchParams);
  }

  checkLoginStatusAndLoadAvatar() {
    const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
    this.isLoggedIn = !!loggedInUserEmail;
    if (this.isLoggedIn) {
      const storedUsersString = localStorage.getItem('registeredUsers');
      if (storedUsersString) {
        const registeredUsers = JSON.parse(storedUsersString);
        const user = registeredUsers.find((u: any) => u.email === loggedInUserEmail);
        this.profileAvatarIcon = user?.avatarIcon || 'person-circle-outline';
      }
    } else {
      this.profileAvatarIcon = 'person-circle-outline';
    }
  }

  // --- FUNGSI BARU UNTUK BANNER CAROUSEL ---
  startBannerAutoScroll() {
    this.stopBannerAutoScroll(); // Hentikan dulu jika ada yang berjalan
    this.scrollInterval = setInterval(() => {
      const el = this.bannerScroller.nativeElement;
      const nextScrollLeft = el.scrollLeft + el.clientWidth;
      // Jika sudah di akhir, kembali ke awal
      if (nextScrollLeft >= el.scrollWidth) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollTo({ left: nextScrollLeft, behavior: 'smooth' });
      }
    }, 3000); // Ganti gambar setiap 3 detik
  }
  
  stopBannerAutoScroll() {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
    }
  }
  // ------------------------------------

  async requestLocationPermission() {
    const modal = await this.modalController.create({
      component: LocationPermissionModalComponent,
      cssClass: 'location-permission-modal'
    });
    return await modal.present();
  }

  navigateToCarList(carId: string) {
    this.router.navigate(['/car-list', carId.toLowerCase()]);
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }
}