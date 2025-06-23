import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router
import { CarDataService, CarModel } from '../services/car-data.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-rental-custom',
  templateUrl: './rental-custom.page.html',
  styleUrls: ['./rental-custom.page.scss'],
  standalone: false
})
export class RentalCustomPage implements OnInit {

  car: CarModel | undefined;
  brand: string = '';
  numberOfDays: number = 1;
  driverOption: 'pickup' | 'delivered' = 'pickup';
  rentalCost: number = 0;
  deliveryCost: number = 0;
  totalCost: number = 0;
  public readonly DELIVERY_FEE_PER_DAY = 150000;

  constructor(
    private route: ActivatedRoute,
    private carDataService: CarDataService,
    private alertController: AlertController,
    private router: Router // Inject Router
  ) { }

  ngOnInit() {
    const brandParam = this.route.snapshot.paramMap.get('brand');
    const carIdParam = this.route.snapshot.paramMap.get('carId');
    if (brandParam && carIdParam) {
      this.brand = brandParam;
      this.car = this.carDataService.getCarDetails(brandParam, carIdParam);
      this.calculateTotal();
    }
  }

  // --- TAMBAHKAN FUNGSI INI ---
  goToPayment() {
    if(this.car) {
      const rentalData = {
        car: this.car,
        duration: this.numberOfDays,
        cost: this.rentalCost,
        delivery: this.deliveryCost,
        total: this.totalCost,
        driverOption: this.driverOption
      };
      this.router.navigate(['/payment-method', this.brand, this.car.id], {
        state: { data: rentalData }
      });
    }
  }

  // ... (sisa fungsi lainnya: incrementDays, decrementDays, calculateTotal, confirmBooking) ...
  incrementDays() { this.numberOfDays++; this.calculateTotal(); }
  decrementDays() { if (this.numberOfDays > 1) { this.numberOfDays--; this.calculateTotal(); } }
  calculateTotal() {
    if (!this.car) return;
    this.rentalCost = this.numberOfDays * this.car.price;
    if (this.driverOption === 'delivered') {
      this.deliveryCost = this.numberOfDays * this.DELIVERY_FEE_PER_DAY;
    } else {
      this.deliveryCost = 0;
    }
    this.totalCost = this.rentalCost + this.deliveryCost + this.car.securityDeposit;
  }
}