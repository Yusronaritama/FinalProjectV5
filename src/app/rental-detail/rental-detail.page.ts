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

  bookedDates: string[] = []; // <-- TAMBAHKAN INI

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
    private authService: AuthService,
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

    this.setInitialDates();
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

  setInitialDates() {
    const now = new Date();
    const today = new Date();
    
    // Jika sekarang sudah lewat jam 21:59, maka tanggal minimal adalah besok
    if (now.getHours() >= 22) {
        today.setDate(today.getDate() + 1);
    }
    
    today.setHours(0, 0, 0, 0);
    this.minPickupDate = today.toISOString();
    
    // Atur waktu pickup default ke jam 8 pagi jika tanggalnya diubah
    const initialPickup = new Date(this.minPickupDate);
    if (initialPickup.getHours() < 8) {
      initialPickup.setHours(8, 0, 0, 0);
    }
    this.pickupDateTime = initialPickup.toISOString();

    this.updateReturnDateTime();
  }

  async loadVehicleDetails(id: string) {
    // Fungsi ini sudah benar, tidak perlu diubah.
    this.isLoading = true;
    this.vehicleService.getVehicleById(id).subscribe({
      next: (response) => {
        this.vehicle = response.data;
        this.calculateTotal();
        this.isLoading = false;
        this.loadBookedDates(this.vehicle!.id);
      },
      error: (err) => {
        console.error('Gagal memuat detail mobil:', err);
        this.isLoading = false;
      },
    });
  }

  // --- TAMBAHKAN FUNGSI BARU INI ---
  loadBookedDates(vehicleId: number) {
    this.vehicleService.getBookedDates(vehicleId).subscribe({
      next: (response) => {
        this.bookedDates = response.data;
        console.log('Tanggal yang tidak tersedia:', this.bookedDates);
      },
      error: (err) => {
        console.error('Gagal mengambil tanggal yang dibooking:', err);
      },
    });
  }
  

  // Fungsi ini harus berupa arrow function agar 'this' bisa diakses
  isDateEnabled = (dateString: string) => {
    // 1. Ambil bagian tanggalnya saja, contoh: "2025-06-26"
    const dateToCheck = dateString.split('T')[0];

    // 2. Periksa apakah tanggal tersebut ada di dalam array bookedDates
    const isDisabled = this.bookedDates.includes(dateToCheck);

    // 3. Kembalikan kebalikannya:
    //    - Jika isDisabled true (ada di array), maka kembalikan false (jangan aktifkan).
    //    - Jika isDisabled false (tidak ada di array), maka kembalikan true (aktifkan).
    return !isDisabled;
  };

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

  // --- TAMBAHKAN FUNGSI BARU INI UNTUK FORMAT TANGGAL ---
  private formatISODateToYmdHis(isoDate: string): string {
    const date = new Date(isoDate);
    
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // --- LOGIKA MENGIRIM DATA (SAMA SEPERTI RENTAL-CUSTOM) ---
  async confirmBooking() {

    // ===== VALIDASI TANGGAL BARU (TAMBAHKAN BLOK INI) =====
    const selectedPickupDate = new Date(this.pickupDateTime);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Atur waktu ke awal hari untuk perbandingan yang adil

    if (selectedPickupDate < today) {
      this.presentAlert(
        'Tanggal Tidak Valid',
        'Anda tidak dapat memilih tanggal yang sudah berlalu. Silakan pilih hari ini atau tanggal di masa mendatang.'
      );
      return; // Hentikan eksekusi fungsi
    }
    // =======================================================

    if (
      this.driverOption === 'delivered' &&
      (!this.userAddress || this.userAddress.includes('ditemukan'))
    ) {
      this.presentAlert(
        'Alamat Tidak Ditemukan',
        'Alamat Anda belum terdaftar di profil. Silakan perbarui profil Anda terlebih dahulu.',
      );
      return;
    }

    if (this.vehicle) {
      this.calculateTotal(); // Hitung ulang untuk memastikan

      const rentalData = {
        car: this.vehicle,
        duration: this.rentalDuration,
        pickup: this.formatISODateToYmdHis(this.pickupDateTime),
        return: this.formatISODateToYmdHis(this.returnDateTime),
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
