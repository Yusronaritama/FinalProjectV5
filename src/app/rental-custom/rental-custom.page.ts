import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// --- PERBAIKAN: Menggunakan VehicleService yang baru dari versi Anda ---
import { Vehicle, VehicleService } from '../services/vehicle.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-rental-custom',
  templateUrl: './rental-custom.page.html',
  styleUrls: ['./rental-custom.page.scss'],
  standalone: false // Pastikan ini false jika Anda menggunakan Ionic dengan Angular
})
export class RentalCustomPage implements OnInit {

  // --- PERBAIKAN: Menggunakan semua properti dari versi Anda yang lebih lengkap ---
  vehicle: Vehicle | null = null;
  isLoading: boolean = true;
  pickupDateTime: string = new Date().toISOString();
  returnDateTime: string = new Date().toISOString();
  returnDateTimeDisplay: string = '';
  minPickupDate: string = '';
  numberOfDays: number = 1;
  driverOption: 'pickup' | 'delivered' = 'pickup';
  rentalCost: number = 0;
  deliveryCost: number = 0;
  totalCost: number = 0;
  public readonly FLAT_DELIVERY_FEE = 150000;

  constructor(
    private route: ActivatedRoute,
    // --- PERBAIKAN: Menggunakan semua inject yang dibutuhkan dari versi Anda ---
    private vehicleService: VehicleService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    // --- PERBAIKAN: Menggunakan logika ngOnInit dari versi Anda ---
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.minPickupDate = today.toISOString();
    this.updateReturnDateTime();

    const carIdParam = this.route.snapshot.paramMap.get('id'); 
    if (carIdParam) {
      this.loadVehicleDetails(carIdParam);
    } else {
      this.isLoading = false;
      console.error('ID Mobil tidak ditemukan di URL');
    }
  }

  // --- PERBAIKAN: Menggunakan semua fungsi dari versi Anda yang sudah terhubung ke API ---
  async loadVehicleDetails(id: string) {
    const loading = await this.loadingController.create({ message: 'Memuat data...' });
    await loading.present();

    this.vehicleService.getVehicleById(id).subscribe({
      next: (response) => {
        this.vehicle = response.data;
        this.calculateTotal();
        this.isLoading = false;
        loading.dismiss();
      },
      error: (err) => {
        console.error("Gagal memuat detail mobil:", err);
        this.isLoading = false;
        loading.dismiss();
      }
    });
  }
  
  calculateTotal() {
    if (!this.vehicle) return;
    
    this.rentalCost = this.numberOfDays * this.vehicle.harga_sewa_harian;
    this.deliveryCost = (this.driverOption === 'delivered') ? this.FLAT_DELIVERY_FEE : 0;
    this.totalCost = this.rentalCost + this.deliveryCost + Number(this.vehicle.security_deposit);
  }
  
  incrementDays() { 
    this.numberOfDays++; 
    this.updateReturnDateTime();
    this.calculateTotal();
  }

  decrementDays() { 
    if (this.numberOfDays > 1) { 
      this.numberOfDays--; 
      this.updateReturnDateTime();
      this.calculateTotal();
    } 
  }

  onPickupTimeChange() {
    this.updateReturnDateTime();
    this.calculateTotal();
  }

  updateReturnDateTime() {
    const pickupDate = new Date(this.pickupDateTime);
    const durationInMs = this.numberOfDays * 24 * 60 * 60 * 1000;
    const newReturnDate = new Date(pickupDate.getTime() + durationInMs);
    
    this.returnDateTime = newReturnDate.toISOString();
    this.returnDateTimeDisplay = newReturnDate.toLocaleString('id-ID', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Jakarta'
    }).replace(/\./g, ':');
  }

  goToPayment() {
    if(this.vehicle) {
      const rentalData = {
        car: this.vehicle,
        duration: this.numberOfDays,
        pickup: this.pickupDateTime,
        return: this.returnDateTime,
        cost: this.rentalCost,
        delivery: this.deliveryCost,
        total: this.totalCost,
        driverOption: this.driverOption
      };
      this.router.navigate(['/payment-method', this.vehicle.id], {
        state: { data: rentalData }
      });
    }
  }
}