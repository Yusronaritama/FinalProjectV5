import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
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
  standalone: false
})
export class CarRandomListPage implements OnInit {

  public rentalDetails: any;
  // PERBAIKAN: Kita akan menggunakan 'allVehicles' untuk ditampilkan di HTML
  public allVehicles: Vehicle[] = []; 
  public isLoading = true;

  public carTypes: CarType[] = [
    { id: 'wuling', name: 'Wuling', imageUrl: 'assets/logomobil/wuling.jpg' },
    { id: 'bmw', name: 'BMW', imageUrl: 'assets/logomobil/bmw.jpg' },
    { id: 'honda', name: 'Honda', imageUrl: 'assets/logomobil/honda.jpg' },
    { id: 'toyota', name: 'Toyota', imageUrl: 'assets/logomobil/toyota.jpg' },
    { id: 'mitsubishi', name: 'Mitsubishi', imageUrl: 'assets/logomobil/Mitsubishi_.png' },
  ];

  constructor(
    private router: Router,
    private vehicleService: VehicleService,
    private loadingController: LoadingController
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.rentalDetails = navigation.extras.state;
    }
  }

  ngOnInit() {
    this.loadAndShuffleVehicles();
  }

  async loadAndShuffleVehicles() {
    const loading = await this.loadingController.create({ message: 'Mencari mobil...' });
    await loading.present();

    this.vehicleService.getAllVehicles().subscribe({
      next: (response) => {
        this.allVehicles = this.shuffleArray(response.data);
        this.isLoading = false;
        loading.dismiss();
      },
      error: (err) => {
        console.error('Gagal mengambil data mobil:', err);
        this.isLoading = false;
        loading.dismiss();
      }
    });
  }
  
  // Fungsi ini menavigasi, bukan memfilter
  selectCarType(type: CarType) {
    this.router.navigate(['/car-list', type.id]);
  }

  private shuffleArray(array: any[]): any[] {
    let currentIndex = array.length, randomIndex;
    const newArray = [...array];
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [newArray[currentIndex], newArray[randomIndex]] = [newArray[randomIndex], newArray[currentIndex]];
    }
    return newArray;
  }
  
  viewCarDetail(carId: number) {
    this.router.navigate(['/car-detail', carId], { state: this.rentalDetails });
  }
}