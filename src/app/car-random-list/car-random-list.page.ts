// GANTI SELURUH ISI FILE DENGAN KODE YANG SUDAH BENAR INI

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, IonContent } from '@ionic/angular';
import { Vehicle, VehicleService } from '../services/vehicle.service';

interface CarType {
  id: string;
  name: string;
  imageUrl: string;
}

@Component({
  selector: 'app-car-random-list',
  templateUrl: './car-random-list.page.html',
  styleUrls: ['./car-random-list.page.scss'],
  standalone: false // Pastikan ini diatur ke false jika menggunakan Ionic Angular
})
export class CarRandomListPage implements OnInit {

  @ViewChild('content') content!: IonContent;

  // Properti utama untuk data
  private allVehicles: Vehicle[] = [];
  public priorityVehicles: Vehicle[] = [];
  public otherVehicles: Vehicle[] = [];
  public isFilterActive: boolean = false;

  // Properti lainnya
  public isLoading = true;
  public showScrollButton: boolean = false;
  public searchParams: any = null;

  // Properti untuk filter (tetap ada)
  public carTypes: CarType[] = [
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
  public selectedCarType: CarType = this.carTypes[0];
  public filterOptions = {
    bahan_bakar: 'semua',
    transmisi: 'semua',
    harga: { lower: null, upper: 1000000 },
  };
  public maxPrice: number = 2000000;

  constructor(
    private router: Router,
    private vehicleService: VehicleService,
    private loadingController: LoadingController
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.searchParams = navigation.extras.state;
    }
  }

  ngOnInit() {
    this.loadVehicles();
  }

  async loadVehicles() {
    this.isLoading = true;
    const loading = await this.loadingController.create({ message: 'Mencari mobil...' });
    await loading.present();

    this.vehicleService.getAllVehicles(this.searchParams).subscribe({
      next: (response) => {
        this.allVehicles = this.shuffleArray(response.data);
        // Di awal, semua mobil masuk ke "otherVehicles" dan "priority" kosong
        this.otherVehicles = [...this.allVehicles];
        this.priorityVehicles = [];
        this.isFilterActive = false;

        if (this.allVehicles.length > 0) {
          const max = Math.max(...this.allVehicles.map((v) => v.harga_sewa_harian));
          this.maxPrice = max > 0 ? max : 2000000;
        }

        this.isLoading = false;
        loading.dismiss();
      },
      error: (err) => {
        console.error('Gagal mengambil data mobil:', err);
        this.isLoading = false;
        loading.dismiss();
      },
    });
  }

  applyFilters() {
    const minPrice = Number(this.filterOptions.harga.lower) || 0;
    const maxPrice = Number(this.filterOptions.harga.upper) || this.maxPrice;

    this.isFilterActive = true; 

    // Fungsi helper untuk memeriksa kondisi filter
  // Ganti fungsi lama Anda dengan yang ini

const checkFilter = (car: Vehicle) => {
  // Guard clause untuk data mobil yang tidak valid
  if (!car) {
    return false;
  }

  // --- BAGIAN YANG DIPERBAIKI ---
  // Kita mengambil `bahan_bakar` dan `transmisi` dari level atas.
  // Kemudian, kita masuk ke dalam properti `harga` untuk mengambil `lower` dan `upper`.
  // Kita juga langsung mengganti nama `lower` menjadi `minPrice` dan `upper` menjadi `maxPrice`.
  const {
    bahan_bakar,
    transmisi,
    harga: { lower: minPrice, upper: maxPrice } // Inilah perbaikannya
  } = this.filterOptions;
  // ------------------------------

  const { id: selectedTypeId, name: selectedTypeName } = this.selectedCarType;

  const isBrandMatch = selectedTypeId === 'all' ||
    (car.merk?.trim().toLowerCase() === selectedTypeName.toLowerCase());

  const isFuelMatch = bahan_bakar === 'semua' ||
    (car.bahan_bakar?.toLowerCase() === bahan_bakar.toLowerCase());

  const isTransmissionMatch = transmisi === 'semua' ||
    (car.transmisi?.toLowerCase() === transmisi.toLowerCase());

  // Logika harga sekarang akan berfungsi karena minPrice dan maxPrice sudah didefinisikan dengan benar.
  // Pastikan nilai lower dan upper dari slider adalah angka.
  const carPrice = car.harga_sewa_harian ?? 0;
  const isPriceMatch = carPrice >= minPrice && carPrice <= maxPrice;

  return isBrandMatch && isFuelMatch && isTransmissionMatch && isPriceMatch;
};

    // Pisahkan mobil ke dalam dua array berdasarkan hasil filter
    this.priorityVehicles = this.allVehicles.filter(car => checkFilter(car));
    this.otherVehicles = this.allVehicles.filter(car => !checkFilter(car));
  }

  selectCarType(type: CarType) {
    this.selectedCarType = type;
  }

  private shuffleArray(array: any[]): any[] {
    let currentIndex = array.length, randomIndex;
    const newArray = [...array];
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [newArray[currentIndex], newArray[randomIndex]] = [
        newArray[randomIndex],
        newArray[currentIndex],
      ];
    }
    return newArray;
  }

  viewCarDetail(carId: number) {
    this.router.navigate(['/car-detail', carId]);
  }
  
  onContentScroll(event: any) {
    this.showScrollButton = event.detail.scrollTop > 400;
  }

  scrollToTop() {
    this.content.scrollToTop(500);
  }
}