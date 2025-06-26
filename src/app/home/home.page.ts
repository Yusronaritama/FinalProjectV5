// Ganti seluruh isi file src/app/home/home.page.ts dengan kode ini

import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, ModalController } from '@ionic/angular';
import { LocationPermissionModalComponent } from '../location-permission-modal/location-permission-modal.component';
import { format, parseISO, add } from 'date-fns';
import { VehicleService } from '../services/vehicle.service'; // Pastikan VehicleService diimpor

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
  private scrollInterval: any;

  bannerImages = [
    'assets/image/tankleopard.jpeg',
    'assets/image/tankarbrams.jpeg',
    'assets/image/tankt90m.jpg'
  ];
  
  // --- INI PERBAIKANNYA ---
  // Nama properti diubah dari 'searchDriverOption' menjadi 'driverOption'
  // Nilai defaultnya juga diubah menjadi 'pickup'
  public driverOption: 'pickup' | 'diantar' = 'pickup';
  // -------------------------

  public searchPickupDate: string = new Date().toISOString();
  public formattedDate: string = '';
  public formattedReturnDate: string = '';

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
  
  public selectedCarType: any = null;

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
    this.startBannerAutoScroll();
  }

  ionViewWillLeave() {
    this.stopBannerAutoScroll();
  }

  ngOnDestroy() {
    this.stopBannerAutoScroll();
  }

  // Fungsi untuk highlight car type
  selectCarType(type: any) {
    if (this.selectedCarType === type) {
      this.selectedCarType = null;
    } else {
      this.selectedCarType = type;
    }
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
    const searchParams = {
      driverOption: this.driverOption, // Sekarang menggunakan properti yang benar
      pickupDate: this.searchPickupDate
    };
    console.log('Mencari mobil dengan parameter:', searchParams);
    this.router.navigate(['/car-random-list'], { state: searchParams });
  }

  checkLoginStatusAndLoadAvatar() {
    const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
    this.isLoggedIn = !!loggedInUserEmail;
    if (this.isLoggedIn && loggedInUserEmail) {
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
  }

  navigateToCarList(carId: string) {
    this.router.navigate(['/car-list', carId.toLowerCase()]);
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }
}