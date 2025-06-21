import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router
import { CarDataService, CarModel } from '../services/car-data.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-rental-detail',
  templateUrl: './rental-detail.page.html',
  styleUrls: ['./rental-detail.page.scss'],
  standalone: false
})
export class RentalDetailPage implements OnInit {

  car: CarModel | undefined;
  brand: string = ''; // <-- 1. TAMBAHKAN PROPERTI INI

  pickupDateTime: string = new Date().toISOString();
  returnDateTime: string = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString();
  driverOption: 'pickup' | 'delivered' = 'pickup';

  rentalDuration: number = 1;
  rentalCost: number = 0;
  deliveryCost: number = 0;
  totalCost: number = 0;

  public readonly DELIVERY_FEE_PER_DAY = 150000;

  constructor(
    private route: ActivatedRoute,
    private carDataService: CarDataService,
    private alertController: AlertController,
    private router: Router // Inject Router untuk navigasi
  ) { }

  ngOnInit() {
    const brandParam = this.route.snapshot.paramMap.get('brand');
    const carIdParam = this.route.snapshot.paramMap.get('carId');

    if (brandParam && carIdParam) {
      this.brand = brandParam; // <-- 2. SIMPAN NILAI BRAND DARI URL KE PROPERTI
      this.car = this.carDataService.getCarDetails(brandParam, carIdParam);
      this.calculateTotal();
    }
  }

  // ... (sisa fungsi Anda: calculateTotal, onSelectionChange, confirmBooking, dll. tidak perlu diubah) ...

  calculateTotal() {
    if (!this.car) return;

    const pickup = new Date(this.pickupDateTime);
    const returns = new Date(this.returnDateTime);
    const diffTime = returns.getTime() - pickup.getTime();

    if (diffTime <= 0) {
      this.rentalDuration = 1;
    } else {
      this.rentalDuration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    this.rentalCost = this.rentalDuration * this.car.price;

    if (this.driverOption === 'delivered') {
      this.deliveryCost = this.rentalDuration * this.DELIVERY_FEE_PER_DAY;
    } else {
      this.deliveryCost = 0;
    }

    this.totalCost = this.rentalCost + this.deliveryCost + this.car.securityDeposit;
  }

  onSelectionChange() {
    this.calculateTotal();
  }

  async confirmBooking() {
    // Fungsi ini tidak lagi menampilkan alert, tapi langsung navigasi dengan membawa data
    if(this.car) {
      const rentalData = {
        car: this.car,
        duration: this.rentalDuration,
        cost: this.rentalCost,
        delivery: this.deliveryCost,
        total: this.totalCost,
        driverOption: this.driverOption
      };
      this.router.navigate(['/payment-method', this.brand, this.car.id], {
        state: { data: rentalData } // <-- Kirim data ke halaman payment-method
      });
    }
  }
}