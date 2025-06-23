import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
<<<<<<< HEAD
import { Vehicle, VehicleService } from '../services/vehicle.service';
import { AlertController, LoadingController } from '@ionic/angular';
=======
import { CarDataService, CarModel } from '../services/car-data.service';
import { AlertController } from '@ionic/angular';
>>>>>>> a3d12b9506d20e0b4943fb112b8f4e36635d3d22

@Component({
  selector: 'app-rental-custom',
  templateUrl: './rental-custom.page.html',
  styleUrls: ['./rental-custom.page.scss'],
  standalone: false // Pastikan ini false jika Anda menggunakan Ionic dengan Angular
})
export class RentalCustomPage implements OnInit {

<<<<<<< HEAD
  vehicle: Vehicle | null = null;
  isLoading: boolean = true;

  // --- PERBAIKAN: Menambahkan properti untuk tanggal & waktu ---
  pickupDateTime: string = new Date().toISOString();
  returnDateTime: string = new Date().toISOString();
  returnDateTimeDisplay: string = '';
  minPickupDate: string = '';

  numberOfDays: number = 1;
=======
  car: CarModel | undefined;
  brand: string = '';
  
  // Properti untuk pilihan pengguna
  pickupDateTime: string = new Date().toISOString();
  returnDateTime: string = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString();
>>>>>>> a3d12b9506d20e0b4943fb112b8f4e36635d3d22
  driverOption: 'pickup' | 'delivered' = 'pickup';
  
  // Properti untuk hasil kalkulasi
  numberOfDays: number = 1; // Sekarang akan dihitung otomatis
  rentalCost: number = 0;
  deliveryCost: number = 0;
  totalCost: number = 0;
<<<<<<< HEAD
  public readonly FLAT_DELIVERY_FEE = 150000;
=======

  public readonly DELIVERY_FEE_PER_DAY = 150000;
>>>>>>> a3d12b9506d20e0b4943fb112b8f4e36635d3d22

  constructor(
    private route: ActivatedRoute,
    private vehicleService: VehicleService,
    private alertController: AlertController,
<<<<<<< HEAD
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
=======
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
>>>>>>> a3d12b9506d20e0b4943fb112b8f4e36635d3d22

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