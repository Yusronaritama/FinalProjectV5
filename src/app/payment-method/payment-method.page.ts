import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

// Interface untuk struktur data pembayaran
interface PaymentMethod {
  name: string;
  desc: string;
  logo: string;
  isOpen: boolean;
  virtualAccount?: string; // Untuk Bank Transfer dan E-Wallet
  qrCodeImageUrl?: string;  // Khusus untuk QRIS
}

interface PaymentGroup {
  group: string;
  methods: PaymentMethod[];
}

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.page.html',
  styleUrls: ['./payment-method.page.scss'],
  standalone: false
})
export class PaymentMethodPage implements OnInit {

  public rentalData: any;
  public paymentGroups: PaymentGroup[] = [];
  public selectedMethod: PaymentMethod | null = null;
  
  // Properti untuk menangani unggahan file
  public paymentProofFile: File | null = null;
  public paymentProofFilename: string = 'Choose File';

  constructor(
    private router: Router,
    private toastController: ToastController
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
      console.error("Data rental tidak ditemukan! Kembali ke halaman utama.");
      this.router.navigateByUrl('/home');
      return;
    }
    this.initializePaymentMethods();
  }
  
  // Inisialisasi semua data metode pembayaran
  private initializePaymentMethods() {
    this.paymentGroups = [
      {
        group: 'Bank Transfer',
        methods: [
          
          { name: 'Bank Mandiri', desc: 'Transfer via ATM, Mobile Banking, Internet Banking', logo: 'assets/logopayment/mandiri.jpg', virtualAccount: '2345 678 901', isOpen: false },
          
        ]
      },
      {
        group: 'E-Wallet',
        methods: [
          { name: 'GoPay', desc: 'Pay with your GoPay balance', logo: 'assets/logopayment/mandiri.jpg', virtualAccount: '0812 3456 7890 (a/n GoRent)', isOpen: false },
          { name: 'OVO', desc: 'Pay with your OVO balance', logo: 'assets/logopayment/mandiri.jpg', virtualAccount: '0812 3456 7891 (a/n GoRent)', isOpen: false },
          { name: 'DANA', desc: 'Pay with your DANA balance', logo: 'assets/logopayment/mandiri.jpg', virtualAccount: '0812 3456 7892 (a/n GoRent)', isOpen: false },
          { name: 'QRIS', desc: 'Pay with any supporting app', logo: 'assets/logopayment/mandiri.jpg', qrCodeImageUrl: 'assets/logopayment/mandiri.jpg', isOpen: false },
        ]
      }
    ];
  }

  // Logika untuk membuka/menutup akordeon dan memilih metode
  toggleAccordion(selectedMethod: PaymentMethod) {
    const wasOpen = selectedMethod.isOpen;

    // Tutup semua dropdown
    this.paymentGroups.forEach(group => {
      group.methods.forEach(method => {
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
      this.presentToast('Silakan pilih metode pembayaran terlebih dahulu.', 'warning');
      return;
    }
    
    // Validasi 2: Bukti pembayaran harus diunggah jika metode memerlukannya
    if (this.selectedMethod.virtualAccount || this.selectedMethod.qrCodeImageUrl) {
        if (!this.paymentProofFile) {
            this.presentToast('Silakan unggah bukti pembayaran.', 'warning');
            return;
        }
    }

    if (this.rentalData) {
      const finalData = { 
        ...this.rentalData, 
        paymentMethod: this.selectedMethod.name,
        paymentProof: this.paymentProofFile ? this.paymentProofFile.name : null
      };
      
      console.log('Validasi berhasil! Memulai proses pembayaran...', finalData);
      
      // --- INI PERUBAHANNYA ---
      // Arahkan ke halaman tunggu yang baru dibuat
      // Kita tetap bisa mengirim data via state jika nanti diperlukan
      this.router.navigate(['/waiting-confirmation'], {
        state: { data: finalData }
      });
    }
  }

  // Fungsi bantuan untuk menampilkan pesan toast
  async presentToast(message: string, color: 'success' | 'warning' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2500,
      color: color,
      position: 'top'
    });
    toast.present();
  }
}