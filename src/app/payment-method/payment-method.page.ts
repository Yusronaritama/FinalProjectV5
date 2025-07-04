import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { VehicleService } from '../services/vehicle.service';

// Interface untuk struktur data pembayaran
interface PaymentMethod {
  name: string;
  desc: string;
  logo: string;
  isOpen: boolean;
  virtualAccount?: string; // Untuk Bank Transfer dan E-Wallet
  dbValue: string;
  qrCodeImageUrl?: string; // Khusus untuk QRIS
}

interface PaymentGroup {
  group: string;
  methods: PaymentMethod[];
}

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.page.html',
  styleUrls: ['./payment-method.page.scss'],
  standalone: false,
})
export class PaymentMethodPage implements OnInit {
  public rentalData: any;
  public paymentGroups: PaymentGroup[] = [];
  public selectedMethod: PaymentMethod | null = null;

  // Properti untuk menangani unggahan file
  public paymentProofFile: File | null = null;
  public paymentProofFilename: string = 'Choose File';
  public Number = Number;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private vehicleService: VehicleService,
  ) {
    // Mengambil data rental dari halaman sebelumnya
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.rentalData = navigation.extras.state['data'];
    }
  }

  ngOnInit() {
    // Jika tidak ada data rental, kembali ke home
    if (!this.rentalData) {
      console.error('Data rental tidak ditemukan! Kembali ke halaman utama.');
      this.router.navigateByUrl('/home');
      return;
    }

    // --- PERBAIKAN 1: Panggil fungsi kalkulasi total biaya ---
    this.calculateTotalCost();

    this.initializePaymentMethods();
  }

  // --- PERBAIKAN 2: Tambahkan fungsi baru untuk kalkulasi ---
  /**
   * Menghitung total biaya berdasarkan rincian dari rentalData.
   * Hasilnya disimpan kembali ke dalam properti rentalData.totalCost.
   */
  private calculateTotalCost(): void {
    // Pastikan semua nilai adalah angka untuk menghindari error, gunakan 0 jika null/undefined
    const baseCost = Number(this.rentalData.cost) || 0;
    const deliveryFee = Number(this.rentalData.delivery) || 0;
    const deposit = Number(this.rentalData.car?.security_deposit) || 0;

    // Lakukan penjumlahan dan simpan hasilnya ke properti totalCost
    this.rentalData.totalCost = baseCost + deliveryFee + deposit;

    // (Opsional) Log untuk debugging, Anda bisa hapus jika sudah berfungsi
    console.log(
      'Total cost calculated successfully:',
      this.rentalData.totalCost,
    );
  }

  // Inisialisasi semua data metode pembayaran
  private initializePaymentMethods() {
    this.paymentGroups = [
      {
        group: 'Bank Transfer',
        methods: [
          {
            name: 'Bank Mandiri',
            desc: 'Transfer via ATM, Mobile Banking, Internet Banking',
            logo: 'assets/logopayment/MANDIRI.png',
            virtualAccount: '2345 678 901',
            isOpen: false,
            dbValue: 'transfer',
          },
        ],
      },
      {
        group: 'E-Wallet',
        methods: [
          {
            name: 'GoPay',
            desc: 'Pay with your GoPay balance',
            logo: 'assets/logopayment/Gopay.png',
            virtualAccount: '0812 3456 7890 (a/n GoRent)',
            isOpen: false,
            dbValue: 'transfer',
          },
          {
            name: 'OVO',
            desc: 'Pay with your OVO balance',
            logo: 'assets/logopayment/OVO.png',
            virtualAccount: '0812 3456 7891 (a/n GoRent)',
            isOpen: false,
            dbValue: 'transfer',
          },
          {
            name: 'DANA',
            desc: 'Pay with your DANA balance',
            logo: 'assets/logopayment/DANA.png',
            virtualAccount: '0812 3456 7892 (a/n GoRent)',
            isOpen: false,
            dbValue: 'transfer',
          },
          {
            name: 'QRIS',
            desc: 'Pay with any supporting app',
            logo: 'assets/logopayment/QRIS.png',
            qrCodeImageUrl: 'assets/logopayment/BARCODE.png',
            isOpen: false,
            dbValue: 'qris',
          },
        ],
      },

      // --- TAMBAHKAN GRUP BARU INI ---
      {
        group: 'Bayar di Tempat',
        methods: [
          {
            name: 'Bayar di Lokasi',
            desc: 'Lakukan pembayaran tunai saat pengambilan mobil',
            logo: 'assets/logopayment/CASH.png', // Ganti dengan ikon yang sesuai
            isOpen: false,
            dbValue: 'bayar_di_tempat',
          },
        ],
      },
    ];
  }

  // Logika untuk membuka/menutup akordeon dan memilih metode
  toggleAccordion(selectedMethod: PaymentMethod) {
    const wasOpen = selectedMethod.isOpen;

    // Tutup semua dropdown
    this.paymentGroups.forEach((group) => {
      group.methods.forEach((method) => {
        method.isOpen = false;
      });
    });

    // Jika dropdown yang diklik sebelumnya tertutup, buka dan pilih
    if (!wasOpen) {
      selectedMethod.isOpen = true;
      this.selectedMethod = selectedMethod;
    } else {
      // Jika diklik lagi, dropdown tertutup dan batalkan pilihan
      this.selectedMethod = null;
    }
  }

  // Logika untuk menyalin nomor virtual account
  async copyVirtualAccount(event: Event, virtualAccount: string | undefined) {
    event.stopPropagation(); // Mencegah dropdown tertutup
    if (!virtualAccount) return;

    try {
      await navigator.clipboard.writeText(virtualAccount);
      this.presentToast('Nomor pembayaran disalin!', 'success');
    } catch (err) {
      console.error('Gagal menyalin:', err);
    }
  }

  // Logika untuk menangani file yang dipilih
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.paymentProofFile = file;
      this.paymentProofFilename = file.name;
    }
  }

  // Logika untuk tombol konfirmasi dengan validasi
  async confirmPayment() {
    // Validasi 1: Metode pembayaran harus dipilih
    if (!this.selectedMethod) {
      this.presentToast(
        'Silakan pilih metode pembayaran terlebih dahulu.',
        'warning',
      );
      return;
    }

    // Validasi 2: Bukti pembayaran hanya wajib jika BUKAN bayar di tempat
    if (
      this.selectedMethod.dbValue !== 'bayar_di_tempat' &&
      !this.paymentProofFile
    ) {
      this.presentToast('Silakan unggah bukti pembayaran.', 'warning');
      return;
    }

    // Siapkan data akhir untuk dikirim
    const finalData = {
      ...this.rentalData,
      paymentMethod: this.selectedMethod.dbValue,
      paymentProofFile: this.paymentProofFile,
      deliveryAddress: this.rentalData.deliveryAddress,
    };

    console.log('Memulai proses pengiriman data...', finalData);

    // Panggil service untuk menyimpan data
    this.vehicleService.createRental(finalData).subscribe({
      next: (response) => {
        console.log(
          'Pesanan berhasil dibuat, data diterima dari server:',
          response.data,
        );

        if (this.selectedMethod?.dbValue === 'bayar_di_tempat') {
          // Jika bayar di tempat, langsung ke halaman sukses dengan pesan khusus
          this.router.navigate(['/transaction-success'], {
            replaceUrl: true,
            state: {
              message:
                'Pemesanan Anda berhasil! Silakan lakukan pembayaran di lokasi.',
            },
          });
        } else {
          // Jika metode lain, ke halaman tunggu konfirmasi
          this.router.navigate(['/transaction-success'], {
            replaceUrl: true,
            state: {
              message:
                'Pemesanan Anda berhasil! Mohon menunggu konfirmasi pembayaran dari kami.',
            },
          });
        }
        // -----------------------------
      },
      error: (err) => {
        console.error('Gagal mengirim data:', err);
        this.presentToast(
          'Gagal membuat pesanan. Silakan coba lagi.',
          'danger',
        );
      },
    });
  }

  // Fungsi bantuan untuk menampilkan pesan toast
  async presentToast(message: string, color: 'success' | 'warning' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2500,
      color: color,
      position: 'top',
    });
    toast.present();
  }
}
