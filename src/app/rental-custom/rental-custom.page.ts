import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Vehicle, VehicleService } from '../services/vehicle.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-rental-custom',
  templateUrl: './rental-custom.page.html',
  styleUrls: ['./rental-custom.page.scss'],
  standalone: false // Pastikan ini false jika Anda menggunakan Ionic dengan Angular
})
export class RentalCustomPage implements OnInit {

  vehicle: Vehicle | null = null;
  isLoading: boolean = true;

  // --- PERBAIKAN: Menambahkan properti untuk tanggal & waktu ---
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
    private vehicleService: VehicleService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    // --- PERBAIKAN: Menambahkan inisialisasi tanggal ---
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.minPickupDate = today.toISOString();
    this.updateReturnDateTime();

    // Mengambil ID dari route yang sudah kita perbaiki sebelumnya
    const carIdParam = this.route.snapshot.paramMap.get('id'); 
    if (carIdParam) {
      this.loadVehicleDetails(carIdParam);
    } else {
      this.isLoading = false;
      console.error('ID Mobil tidak ditemukan di URL');
    }
  }

  async loadVehicleDetails(id: string) {
    const loading = await this.loadingController.create({ message: 'Memuat data...' });
    await loading.present();

    this.vehicleService.getVehicleById(id).subscribe({
      next: (response) => {
        this.vehicle = response.data;
        this.calculateTotal(); // Hitung total setelah data dari API didapat
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
    
    // --- PERBAIKAN: Memastikan rentalCost dihitung dengan benar ---
    this.rentalCost = this.numberOfDays * this.vehicle.harga_sewa_harian;
    this.deliveryCost = (this.driverOption === 'delivered') ? this.FLAT_DELIVERY_FEE : 0;
    this.totalCost = this.rentalCost + this.deliveryCost + Number(this.vehicle.security_deposit);
  }
  
  incrementDays() { 
    this.numberOfDays++; 
    this.updateReturnDateTime(); // Update tanggal kembali
    this.calculateTotal();     // Hitung ulang total
  }
  decrementDays() { 
    if (this.numberOfDays > 1) { 
      this.numberOfDays--; 
      this.updateReturnDateTime(); // Update tanggal kembali
      this.calculateTotal();     // Hitung ulang total
    } 
  }


  onPickupTimeChange() {
    this.updateReturnDateTime();
    this.calculateTotal();
  }

  updateReturnDateTime() {
    const pickupDate = new Date(this.pickupDateTime);
    // Di halaman ini, durasi diambil dari stepper 'numberOfDays'
    const durationInMs = this.numberOfDays * 24 * 60 * 60 * 1000;
    const newReturnDate = new Date(pickupDate.getTime() + durationInMs);
    
    this.returnDateTime = newReturnDate.toISOString();
    this.returnDateTimeDisplay = newReturnDate.toLocaleString('id-ID', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Jakarta'
    }).replace(/\./g, ':');
  }
  // --- AKHIR PERBAIKAN ---

  goToPayment() {
    if(this.vehicle) {
      const rentalData = {
        car: this.vehicle,
        duration: this.numberOfDays,
        cost: this.rentalCost,
        delivery: this.deliveryCost,
        total: this.totalCost,
        driverOption: this.driverOption
      };
      // Menggunakan ID mobil untuk navigasi
      this.router.navigate(['/payment-method', this.vehicle.id], {
        state: { data: rentalData }
      });
    }
  }
}