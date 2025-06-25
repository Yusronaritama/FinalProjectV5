// GANTI SELURUH ISI FILE rental-detail.page.ts ANDA DENGAN KODE INI

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Vehicle, VehicleService } from '../services/vehicle.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-rental-detail',
  templateUrl: './rental-detail.page.html',
  styleUrls: ['./rental-detail.page.scss'],
  standalone: false,
})
export class RentalDetailPage implements OnInit {
  vehicle: Vehicle | null = null;

  // --- LOGIKA LOADING YANG DIPERBAIKI ---
  isLoading: boolean = true;
  isProfileLoading: boolean = true;
  // ------------------------------------

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
  userAddress: string = '';

  public allowedHours: number[] = [
    8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  ];

  private isUserInJabodetabek: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private vehicleService: VehicleService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      prefill: { durationInDays: number };
    };
    if (state?.prefill) {
      this.rentalDuration = state.prefill.durationInDays;
    }
  }

  ngOnInit() {
    this.getAuthenticatedUser(); // Panggil fungsi untuk ambil profil

    const carIdParam = this.route.snapshot.paramMap.get('id');
    if (carIdParam) {
      this.loadVehicleDetails(carIdParam);
    } else {
      this.isLoading = false;
      console.error('ID Mobil tidak ditemukan di URL');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.minPickupDate = today.toISOString();
    this.updateReturnDateTime();
  }

  // --- LOGIKA MENGAMBIL PROFIL PENGGUNA (SAMA SEPERTI RENTAL-CUSTOM) ---
  getAuthenticatedUser() {
    this.isProfileLoading = true; // Set loading ON
    this.authService.getProfile().subscribe({
      next: (response) => {
        this.userAddress = response.alamat || 'Alamat tidak ditemukan';
        this.isProfileLoading = false; // Set loading OFF
      },
      error: (err) => {
        console.error('Gagal mengambil profil:', err);
        this.userAddress = 'Gagal memuat alamat';
        this.isProfileLoading = false; // Set loading OFF
      },
    });
  }

  async loadVehicleDetails(id: string) {
    // Fungsi ini sudah benar, tidak perlu diubah.
    this.isLoading = true;
    this.vehicleService.getVehicleById(id).subscribe({
      next: (response) => {
        this.vehicle = response.data;
        this.calculateTotal();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Gagal memuat detail mobil:', err);
        this.isLoading = false;
      },
    });
  }

  // ... (calculateTotal, onPickupTimeChange, updateReturnDateTime, onSelectionChange, presentDeliveryAlert tetap sama)
  calculateTotal() {
    if (!this.vehicle) return;
    this.rentalCost = this.rentalDuration * this.vehicle.harga_sewa_harian;
    this.deliveryCost =
      this.driverOption === 'delivered' ? this.FLAT_DELIVERY_FEE : 0;
    this.totalCost =
      this.rentalCost +
      this.deliveryCost +
      Number(this.vehicle.security_deposit);
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

  onSelectionChange() {
    if (this.driverOption === 'delivered' && !this.isUserInJabodetabek) {
      this.presentDeliveryAlert();
    } else {
      this.calculateTotal();
    }
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

  // --- LOGIKA MENGIRIM DATA (SAMA SEPERTI RENTAL-CUSTOM) ---
  async confirmBooking() {
    if (
      this.driverOption === 'delivered' &&
      (!this.userAddress || this.userAddress.includes('ditemukan'))
    ) {
      this.presentAlert(
        'Alamat Tidak Ditemukan',
        'Alamat Anda belum terdaftar di profil. Silakan perbarui profil Anda terlebih dahulu.'
      );
      return;
    }

    if (this.vehicle) {
      this.calculateTotal(); // Hitung ulang untuk memastikan

      const rentalData = {
        car: this.vehicle,
        duration: this.rentalDuration,
        pickup: this.pickupDateTime,
        return: this.returnDateTime,
        driverOption: this.driverOption,
        // --- INI BAGIAN KUNCINYA ---
        cost: this.rentalCost,
        delivery: this.deliveryCost,
        // --------------------------
        deliveryAddress:
          this.driverOption === 'delivered' ? this.userAddress : '',
      };

      this.router.navigate(['/payment-method'], {
        state: { data: rentalData },
      });
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}