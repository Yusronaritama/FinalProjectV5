// src/app/home/home.page.ts (SUDAH DIEDIT)

import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { LocationPermissionModalComponent } from '../location-permission-modal/location-permission-modal.component';
import { format, parseISO } from 'date-fns';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

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

  @ViewChild('bannerScroller') bannerScroller!: ElementRef<HTMLElement>;

  // --- PENAMBAHAN KODE UNTUK SLIDER TESTIMONI ---
  // 1. Menambahkan ViewChild untuk container slider testimoni
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  // ---------------------------------------------

  private scrollInterval: any;
  
  private authSubscription!: Subscription;
  private avatarSubscription!: Subscription;

  bannerImages = [
    'assets/Mobil/CRETA.jpeg',
    'assets/Mobil/CRV.jpeg',
    'assets/Mobil/Ignis.jpeg',
    'assets/Mobil/LandCruiser.jpeg',
    
  ];

  public gorentStory = {
    title: 'Cerita Perjalanan GoRent',
    stats: [
      { icon: 'people-outline', value: '1.5K', label: 'Pengguna' },
      { icon: 'car-outline', value: '71.7K', label: 'Booking Selesai' },
      { icon: 'map-outline', value: '22', label: 'Kota di Indonesia' },
      { icon: 'phone-portrait-outline', value: '10.2K', label: 'Mobil Terdaftar' },
    ],
  };

  testimonials = [
    {
      name: 'Michelliinn',
      role: 'Traveler',
      stars: 5,
      quote: 'Di apps ini kalian mudah buat car sharing n bs jg kl kalian mau jalan2 d dlm kota slama lebaran inii.. driver ny ramaahhh mbl bagus bersih dan baruuu',
    },
    {
      name: 'Budi Santoso',
      role: 'Photographer',
      stars: 5,
      quote: 'Pilihan kameranya lengkap banget! Sewa untuk project akhir pekan jadi lebih mudah dan terjamin kualitasnya. Prosesnya cepat dan aman.',
    },
      {
      name: 'Citra Lestari',
      role: 'Event Organizer',
      stars: 5,
      quote: 'Menemukan semua peralatan pesta yang saya butuhkan di satu tempat. Sangat menghemat waktu dan tenaga. Pelayanannya juga responsif!',
    }
  ];

  reasonsToRent = [
    {
      icon: 'key-outline',
      title: 'Sewa Fleksibel',
      description: 'Nikmati kebebasan penuh dan privasi dengan menyewa barang untuk kendali Anda sendiri, baik harian, mingguan, maupun bulanan.'
    },
    {
      icon: 'cube-outline',
      title: 'Ribuan Variasi Barang',
      description: 'Dari kendaraan, kamera, hingga peralatan pesta. Temukan puluhan ribu barang unik yang terdaftar di GoRentall untuk segala kebutuhanmu.'
    },
    {
      icon: 'phone-portrait-outline',
      title: 'Proses Sewa Mudah',
      description: 'Sewa apapun hanya dalam beberapa ketukan. Semua proses dari pemesanan, pembayaran, hingga konfirmasi dilakukan sepenuhnya via aplikasi.'
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Keamanan Sistem',
      description: 'Kami menerapkan verifikasi ketat dan sistem pembayaran yang aman untuk memastikan setiap transaksi dan barang selalu terlindungi.'
    }
  ];

  
  
  public searchPickupDate: string = new Date().toISOString();
  public formattedDate: string = '';
  public minDate: string = '';

  isLoggedIn: boolean = false;
  profileAvatarIcon: string = 'person-circle-outline';
  
  displayedLocation: string = 'Izinkan lokasi untuk pengalaman yang lebih baik';
  isLocationSet: boolean = false;

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
  
  public selectedCarType: any = null;

  constructor(
    private router: Router,
    private modalController: ModalController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // Perbaikan kode inisialisasi
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();

    // Buat tanggal minimal tanpa pengaruh timezone
    this.minDate = new Date(year, month, day + 1).toISOString(); // +1 hari dari kemarin

    // Atur nilai default ke hari ini (dalam format lokal)
    this.searchPickupDate = new Date(year, month, day).toISOString();
    this.updateFormattedDates();

    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isLoggedIn = isAuth;
    });

    this.avatarSubscription = this.authService.currentAvatar$.subscribe(avatar => {
      this.profileAvatarIcon = avatar || 'person-circle-outline';
    });
  }
  
  ionViewDidEnter() {
    this.startBannerAutoScroll();
  }

  ionViewWillLeave() {
    this.stopBannerAutoScroll();
  }

  ngOnDestroy() {
    this.stopBannerAutoScroll();
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.avatarSubscription) {
      this.avatarSubscription.unsubscribe();
    }
  }

  selectCarType(type: any) {
    if (this.selectedCarType === type) {
      this.selectedCarType = null;
    } else {
      this.selectedCarType = type;
      this.navigateToCarList(type.id);
    }
  }

  dateChanged(event: any) {
    this.searchPickupDate = event.detail.value;
    this.updateFormattedDates();
  }

  updateFormattedDates() {
    const pickup = parseISO(this.searchPickupDate);
    this.formattedDate = format(pickup, 'EEE, d MMM');
  }

  searchCars() {
    const searchParams = {
      pickupDate: format(parseISO(this.searchPickupDate), 'yyyy-MM-dd')
    };
    console.log('Mencari mobil dengan parameter:', searchParams);
    this.router.navigate(['/car-random-list'], { state: searchParams });
  }

  startBannerAutoScroll() {
    if (!this.bannerScroller?.nativeElement) return;
    this.stopBannerAutoScroll();
    this.scrollInterval = setInterval(() => {
      const el = this.bannerScroller.nativeElement;
      if (el) {
        const nextScrollLeft = el.scrollLeft + el.clientWidth;
        if (nextScrollLeft >= el.scrollWidth) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollTo({ left: nextScrollLeft, behavior: 'smooth' });
        }
      }
    }, 3000);
  }
  
  stopBannerAutoScroll() {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
    }
  }

  async requestLocationPermission() {
    const modal = await this.modalController.create({
      component: LocationPermissionModalComponent,
      cssClass: 'location-permission-modal'
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data && data.location) {
        this.displayedLocation = data.location;
        this.isLocationSet = true;
    }
  }

  navigateToCarList(carId: string) {
    this.router.navigate(['/car-list', carId.toLowerCase()]);
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }

  // --- PENAMBAHAN KODE UNTUK SLIDER TESTIMONI ---
  // 2. Menambahkan fungsi untuk tombol navigasi slider
  
  /**
   * Fungsi untuk menggeser slider ke item berikutnya.
   */
  scrollNext() {
    // Pengecekan keamanan jika elemen belum ada
    if (this.scrollContainer?.nativeElement) {
      const element = this.scrollContainer.nativeElement;
      element.scrollBy({ left: element.clientWidth, behavior: 'smooth' });
    }
  }

  /**
   * Fungsi untuk menggeser slider ke item sebelumnya.
   */
  scrollPrev() {
    // Pengecekan keamanan jika elemen belum ada
    if (this.scrollContainer?.nativeElement) {
      const element = this.scrollContainer.nativeElement;
      element.scrollBy({ left: -element.clientWidth, behavior: 'smooth' });
    }
  }
  // ---------------------------------------------
  
}