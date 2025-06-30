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
  bookedDates: string[] = [];
  minPickupDate: string = '';
  numberOfDays: number = 1;
  driverOption: 'pickup' | 'delivered' = 'pickup';
  userAddress: string = '';
  rentalCost: number = 0;
  deliveryCost: number = 0;
  totalCost: number = 0;
  public readonly FLAT_DELIVERY_FEE = 150000;
  // --- TAMBAHKAN JAM OPERASIONAL DI SINI ---
  public allowedHours: number[] = [
    8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  ];

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
    this.setInitialDates();

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

  // --- PERBAIKAN LOGIKA TANGGAL ---
  setInitialDates() {
    const now = new Date();
    const today = new Date();

    // Reset jam ke 00:00:00 untuk perbandingan tanggal
    today.setHours(0, 0, 0, 0);

    // Jika sekarang sudah lewat jam 21:59, maka tanggal minimal adalah besok
    if (now.getHours() >= 22) {
      today.setDate(today.getDate() + 1);
    }

    this.minPickupDate = today.toISOString();

    // Atur waktu pickup default ke jam 8 pagi jika tanggalnya diubah
    const initialPickup = new Date(this.minPickupDate);
    if (initialPickup.getHours() < 8) {
      initialPickup.setHours(8, 0, 0, 0);
    }
    this.pickupDateTime = initialPickup.toISOString();

    this.updateReturnDateTime();
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
        this.loadBookedDates(this.vehicle!.id);
        loading.dismiss();
      },
      error: (err) => {
        console.error('Gagal memuat detail mobil:', err);
        this.isLoading = false;
        loading.dismiss();
      },
    });
  }

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

    // 2. Konversi ke Date object untuk pengecekan
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set ke awal hari

    // 3. Jika tanggal yang dipilih sudah lewat (kemarin atau sebelumnya)
    if (selectedDate < today) {
      return false;
    }

    // 4. Periksa apakah tanggal tersebut ada di dalam array bookedDates
    const isDisabled = this.bookedDates.includes(dateToCheck);

    // 5. Kembalikan true hanya jika tanggal valid dan tidak dibooking
    return !isDisabled;
  };

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
  // ----------------------------------------------------

  goToPayment() {
    // ===== VALIDASI TANGGAL YANG DIPERBAIKI =====
    const selectedPickupDate = new Date(this.pickupDateTime);
    const now = new Date();

    // Buat tanggal pembanding dengan jam 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Jika sekarang sudah lewat jam 22:00, maka tanggal minimal adalah besok
    if (now.getHours() >= 22) {
      today.setDate(today.getDate() + 1);
    }

    if (selectedPickupDate < today) {
      this.presentAlert(
        'Tanggal Tidak Valid',
        'Anda tidak dapat memilih tanggal yang sudah berlalu. Silakan pilih hari ini atau tanggal di masa mendatang.',
      );
      return;
    }
    // =======================================================

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
        pickup: this.formatISODateToYmdHis(this.pickupDateTime),
        return: this.formatISODateToYmdHis(this.returnDateTime),
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
