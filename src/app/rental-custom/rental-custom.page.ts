import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// --- PERBAIKAN: Menggunakan VehicleService yang baru dari versi Anda ---
import { Vehicle, VehicleService } from '../services/vehicle.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-rental-custom',
  templateUrl: './rental-custom.page.html',
  styleUrls: ['./rental-custom.page.scss'],
  standalone: false,
})
export class RentalCustomPage implements OnInit {
  vehicle: Vehicle | null = null;
  isLoading: boolean = true;
  pickupDateTime: string = new Date().toISOString();
  returnDateTime: string = new Date().toISOString();
  returnDateTimeDisplay: string = '';
  minPickupDate: string = '';
  numberOfDays: number = 1;
  driverOption: 'pickup' | 'delivered' = 'pickup';
  userAddress: string = '';
  rentalCost: number = 0;
  deliveryCost: number = 0;
  totalCost: number = 0;
  public readonly FLAT_DELIVERY_FEE = 150000;

  private isUserInJabodetabek: boolean = true;
  constructor(
    private route: ActivatedRoute,
    private vehicleService: VehicleService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private authService: AuthService, // <-- Injeksi service
  ) {}

  ngOnInit() {
    this.getAuthenticatedUser(); // <-- Panggil fungsi baru ini
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

  // --- TAMBAHKAN FUNGSI BARU INI ---
  getAuthenticatedUser() {
    this.authService.getProfile().subscribe({
      next: (response) => {
        // Asumsikan field alamat di database Anda bernama 'address' atau 'alamat'
        this.userAddress =
          response.address || response.alamat || 'Alamat tidak ditemukan';
      },
      error: (err) => {
        console.error('Gagal mengambil profil pengguna:', err);
        this.userAddress = 'Gagal memuat alamat';
      },
    });
  }

  // --- PERBAIKAN: Menggunakan semua fungsi dari versi Anda yang sudah terhubung ke API ---
  async loadVehicleDetails(id: string) {
    const loading = await this.loadingController.create({
      message: 'Memuat data...',
    });
    await loading.present();

    this.vehicleService.getVehicleById(id).subscribe({
      next: (response) => {
        this.vehicle = response.data;
        this.calculateTotal();
        this.isLoading = false;
        loading.dismiss();
      },
      error: (err) => {
        console.error('Gagal memuat detail mobil:', err);
        this.isLoading = false;
        loading.dismiss();
      },
    });
  }

  async presentDeliveryAlert() {
    const alert = await this.alertController.create({
      header: 'Oops!',
      message:
        'Lokasi Anda berada di luar wilayah Jabodetabek. Layanan pengantaran belum tersedia di area ini. Silakan pilih opsi ambil sendiri.',
      buttons: ['OK'],
      backdropDismiss: false,
    });

    await alert.present();

    await alert.onDidDismiss();
    this.driverOption = 'pickup';
    this.calculateTotal();
  }

  onDriverOptionChange() {
    if (this.driverOption === 'delivered' && !this.isUserInJabodetabek) {
      this.presentDeliveryAlert();
    } else {
      this.calculateTotal();
    }
  }

  calculateTotal() {
    if (!this.vehicle) return;

    this.rentalCost = this.numberOfDays * this.vehicle.harga_sewa_harian;
    this.deliveryCost =
      this.driverOption === 'delivered' ? this.FLAT_DELIVERY_FEE : 0;
    this.totalCost =
      this.rentalCost +
      this.deliveryCost +
      Number(this.vehicle.security_deposit);
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
    this.returnDateTimeDisplay = newReturnDate
      .toLocaleString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Jakarta',
      })
      .replace(/\./g, ':');
  }

  // ... (kode lain di atasnya tetap sama)

  goToPayment() {
    // Validasi jika memilih diantar tapi alamat tidak ada
    if (
      this.driverOption === 'delivered' &&
      (!this.userAddress || this.userAddress.includes('ditemukan'))
    ) {
      this.presentAlert(
        'Alamat Tidak Ditemukan',
        'Alamat Anda belum terdaftar di profil. Silakan perbarui profil Anda.',
      );
      return;
    }

    if (this.vehicle) {
      const rentalData = {
        car: this.vehicle,
        duration: this.numberOfDays,
        pickup: this.pickupDateTime,
        return: this.returnDateTime,
        cost: this.rentalCost,
        delivery: this.deliveryCost,
        total: this.totalCost,
        driverOption: this.driverOption,
        // Sertakan alamat pengguna jika diantar, jika tidak, kirim string kosong
        deliveryAddress:
          this.driverOption === 'delivered' ? this.userAddress : '',
      };
      this.router.navigate(['/payment-method'], {
        state: { data: rentalData },
      });
    }
  }

  // ... (kode lain di bawahnya tetap sama)

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
