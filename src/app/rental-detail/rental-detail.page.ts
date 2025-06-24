import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Vehicle, VehicleService } from '../services/vehicle.service';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-rental-detail',
  templateUrl: './rental-detail.page.html',
  styleUrls: ['./rental-detail.page.scss'],
  standalone: false // Pastikan ini false jika Anda menggunakan Ionic dengan Angular
})
export class RentalDetailPage implements OnInit {

  vehicle: Vehicle | null = null;
  isLoading: boolean = true;

  pickupDateTime: string = new Date().toISOString();
  returnDateTime: string = new Date().toISOString();
  returnDateTimeDisplay: string = '';
  
  rentalDuration: number = 1;
  minPickupDate: string = '';
  driverOption: 'pickup' | 'delivered' = 'pickup';
  rentalCost: number = 0;
  deliveryCost: number = 0;
  totalCost: number = 0;
  public readonly FLAT_DELIVERY_FEE = 150000;

  // --- TAMBAHAN BARU: Definisikan jam operasional ---
  public allowedHours: number[] = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

  private isUserInJabodetabek: boolean = false
  constructor(
    private route: ActivatedRoute,
    private vehicleService: VehicleService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { prefill: { durationInDays: number } };
    if (state?.prefill) {
      this.rentalDuration = state.prefill.durationInDays;
    }
  }

  ngOnInit() {
    // --- PERBAIKAN DI SINI ---
    // Set tanggal minimal ke awal hari ini (pukul 00:00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.minPickupDate = today.toISOString();
    // --- AKHIR PERBAIKAN ---
    this.minPickupDate = new Date().toISOString();
    this.updateReturnDateTime();
    
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
        this.calculateTotal();
        loading.dismiss();
        // --- PERBAIKAN: Kembalikan baris ini ---
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Gagal memuat detail mobil:", err);
        loading.dismiss();
        // --- PERBAIKAN: Kembalikan baris ini ---
        this.isLoading = false;
      }
    });
  }

  calculateTotal() {
    if (!this.vehicle) return;
    this.rentalCost = this.rentalDuration * this.vehicle.harga_sewa_harian;
    this.deliveryCost = (this.driverOption === 'delivered') ? this.FLAT_DELIVERY_FEE : 0;
    this.totalCost = this.rentalCost + this.deliveryCost + Number(this.vehicle.security_deposit);
  }

  onPickupTimeChange() {
    this.updateReturnDateTime();
    this.calculateTotal();
  }

  updateReturnDateTime() {
    const pickupDate = new Date(this.pickupDateTime);
    const durationInMs = this.rentalDuration * 24 * 60 * 60 * 1000;
    const newReturnDate = new Date(pickupDate.getTime() + durationInMs);
    
    this.returnDateTime = newReturnDate.toISOString();
    this.returnDateTimeDisplay = newReturnDate.toLocaleString('id-ID', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Jakarta'
    }).replace(/\./g, ':');
  }
  
   onSelectionChange() {
    // Jika user memilih 'diantar' dan dia di luar Jabodetabek
    if (this.driverOption === 'delivered' && !this.isUserInJabodetabek) {
      this.presentDeliveryAlert();
    } else {
      // Jika tidak, langsung kalkulasi total
      this.calculateTotal();
    }
  }

  async presentDeliveryAlert() {
    const alert = await this.alertController.create({
      header: 'Oops!',
      message: 'Lokasi Anda berada di luar wilayah Jabodetabek. Layanan pengantaran belum tersedia di area ini. Silakan pilih opsi ambil sendiri.',
      buttons: ['OK'],
      backdropDismiss: false // Mencegah user menutup alert dengan klik di luar
    });

    await alert.present();

    // Setelah alert ditutup, kembalikan pilihan ke 'pickup'
    await alert.onDidDismiss();
    this.driverOption = 'pickup';
    this.calculateTotal(); // Hitung ulang total biaya dengan opsi yang benar
  }

  async confirmBooking() {
    if(this.vehicle) {
      const rentalData = {
        car: this.vehicle,
        duration: this.rentalDuration,
        pickup: this.pickupDateTime,
        return: this.returnDateTime,
        driverOption: this.driverOption,
        totalCost: this.totalCost
      };
      // --- INI PERBAIKANNYA ---
      // Hapus this.vehicle.id dari array navigasi
      this.router.navigate(['/payment-method'], {
        state: { data: rentalData }
      });
    }
  }
}