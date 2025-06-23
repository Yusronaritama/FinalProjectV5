// TAMBAHKAN KEMBALI @Component
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router
import { Vehicle, VehicleService } from '../services/vehicle.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.page.html',
  styleUrls: ['./car-detail.page.scss'],
  standalone: false // Pastikan ini false jika Anda menggunakan Ionic dengan Angular
})
export class CarDetailPage implements OnInit {
  
  vehicle: Vehicle | null = null;
  isLoading: boolean = true;

  // --- TAMBAHAN: Data untuk Rental Options Shortcut ---
  rentalOptions: any[] = [];
  // --- AKHIR TAMBAHAN ---

  constructor(
    private route: ActivatedRoute,
    private vehicleService: VehicleService,
    private loadingController: LoadingController,
    private router: Router // Inject Router untuk navigasi
  ) { }

  ngOnInit() {
    const carId = this.route.snapshot.paramMap.get('id');
    if (carId) {
      this.loadVehicleDetails(carId);
    } else {
      console.error('Car ID tidak ditemukan di URL.');
      this.isLoading = false;
    }
  }

  async loadVehicleDetails(id: string) {
    const loading = await this.loadingController.create({ message: 'Memuat detail...' });
    await loading.present();

    // Menambahkan tipe data pada response untuk menghilangkan error 'any'
    this.vehicleService.getVehicleById(id).subscribe({
      next: (response: { data: Vehicle }) => {
        this.vehicle = response.data;
        // --- TAMBAHAN: Membuat data rental options setelah data mobil didapat ---
        this.setupRentalOptions();
        // --- AKHIR TAMBAHAN ---
        loading.dismiss();
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Gagal memuat detail kendaraan:', err);
        loading.dismiss();
        this.isLoading = false;
      }
    });
  }

  // --- FUNGSI BARU: Untuk menyiapkan data shortcut ---
  setupRentalOptions() {
    if (!this.vehicle) return;

    this.rentalOptions = [
      {
        duration: '24 Hours',
        desc: 'Full day rental',
        days: 1, // Data durasi dalam hari
        price: this.vehicle.harga_sewa_harian // Harga 1 hari
      },
      {
        duration: '3 Days',
        desc: 'Weekend package',
        days: 3, // Data durasi dalam hari
        price: this.vehicle.harga_sewa_harian * 3 // Harga 3 hari
      }
    ];
  }

  // --- FUNGSI BARU: Untuk navigasi dengan membawa data ---
  selectPackage(selectedOption: any) {
    if (!this.vehicle) return;

    // Data yang ingin kita kirim ke halaman selanjutnya
    const navigationData = {
      durationInDays: selectedOption.days
    };

    this.router.navigate(['/rental-detail', this.vehicle.id], {
      state: { prefill: navigationData } // Kirim data menggunakan 'state'
    });
  }
}