import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  
  // Properti untuk pilihan pengguna
  pickupDateTime: string = new Date().toISOString();
  returnDateTime: string = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString();
  driverOption: 'pickup' | 'delivered' = 'pickup';
  
  // Properti untuk hasil kalkulasi
  numberOfDays: number = 1; // Sekarang akan dihitung otomatis
  rentalCost: number = 0;
  deliveryCost: number = 0;
  totalCost: number = 0;

  public readonly DELIVERY_FEE_PER_DAY = 150000;

  constructor(
    private route: ActivatedRoute,
    private carDataService: CarDataService,
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    const brandParam = this.route.snapshot.paramMap.get('brand');
    const carIdParam = this.route.snapshot.paramMap.get('carId');

    if (brandParam && carIdParam) {
      this.brand = brandParam;
      this.car = this.carDataService.getCarDetails(brandParam, carIdParam);
      this.calculateTotal(); // Lakukan kalkulasi awal
    }
  }

  // Tombol (+) akan menambahkan 1 hari ke tanggal pengembalian
  incrementDays() {
    const returnDate = new Date(this.returnDateTime);
    returnDate.setDate(returnDate.getDate() + 1);
    this.returnDateTime = returnDate.toISOString();
    this.calculateTotal();
  }

  // Tombol (-) akan mengurangi 1 hari dari tanggal pengembalian
  decrementDays() {
    if (this.numberOfDays <= 1) return; // Mencegah durasi kurang dari 1 hari
    const returnDate = new Date(this.returnDateTime);
    returnDate.setDate(returnDate.getDate() - 1);
    this.returnDateTime = returnDate.toISOString();
    this.calculateTotal();
  }

  // Fungsi utama untuk kalkulasi
  calculateTotal() {
    if (!this.car) return;

    const pickup = new Date(this.pickupDateTime);
    const returns = new Date(this.returnDateTime);
    const diffTime = returns.getTime() - pickup.getTime();

    // Hitung durasi dan pastikan minimal 1 hari
    if (diffTime <= 0) {
      this.numberOfDays = 1;
      const newReturnDate = new Date(pickup);
      newReturnDate.setDate(pickup.getDate() + 1);
      this.returnDateTime = newReturnDate.toISOString();
    } else {
      this.numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    this.rentalCost = this.numberOfDays * this.car.price;

    if (this.driverOption === 'delivered') {
      this.deliveryCost = this.numberOfDays * this.DELIVERY_FEE_PER_DAY;
    } else {
      this.deliveryCost = 0;
    }

    this.totalCost = this.rentalCost + this.deliveryCost + this.car.securityDeposit;
  }

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
}