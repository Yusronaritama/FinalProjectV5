import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Interface untuk mendefinisikan struktur data setiap item riwayat
interface OrderHistory {
  id: string;
  dateRange: string;
  status: 'ACTIVE' | 'PENDING' | 'REFUNDED' | 'CANCEL';
  car: {
    name: string;
    priceInfo: string;
    returnInfo: string;
    imageUrl: string;
  };
  securityDeposit: {
    status: 'REFUNDED' | 'PROSES' | 'DI TAHAN' | 'TIDAK ADA';
    original: number;
    deductions?: number;
    refunded: number;
    refundDate?: string;
  };
}

@Component({
  selector: 'app-activity',
  templateUrl: './activity.page.html',
  styleUrls: ['./activity.page.scss'],
  standalone: false
})
export class ActivityPage implements OnInit {

  public orderHistory: OrderHistory[] = [];

  constructor(private router: Router) { }

  ngOnInit() {
    this.loadOrderHistory();
  }

  // Membuat data sampel untuk ditampilkan
  loadOrderHistory() {
    this.orderHistory = [
      {
        id: '#GR001234',
        dateRange: '15 Jul 2023 - 20 Jul 2023',
        status: 'REFUNDED',
        car: {
          name: 'Toyota Harrier 2019 LT',
          priceInfo: 'Rp 1.750.000 (5 days)',
          returnInfo: 'Returned: 20 Jul 2023, 10:15 AM. Pengembalian dana sukses.',
          imageUrl: 'assets/image/tankleopard.jpeg' // Ganti dengan path gambar Anda
        },
        securityDeposit: {
          status: 'REFUNDED',
          original: 500000,
          refunded: 500000,
          refundDate: '20 Jul 2023'
        }
      },
      {
        id: '#GR001235',
        dateRange: '22 Jul 2023 - 23 Jul 2023',
        status: 'PENDING',
        car: {
          name: 'Honda Brio 2022',
          priceInfo: 'Rp 700.000 (2 days)',
          returnInfo: 'Menunggu konfirmasi pembayaran.',
          imageUrl: 'assets/image/tankleopard.jpeg' // Ganti dengan path gambar Anda
        },
        securityDeposit: {
          status: 'PROSES',
          original: 300000,
          refunded: 0,
        }
      },
      {
        id: '#GR001236',
        dateRange: '25 Jul 2023 - 28 Jul 2023',
        status: 'ACTIVE',
        car: {
          name: 'Mitsubishi Pajero Sport',
          priceInfo: 'Rp 2.400.000 (3 days)',
          returnInfo: 'Mobil ini sedang dalam masa sewa Anda.',
          imageUrl: 'assets/image/tankleopard.jpeg' // Ganti dengan path gambar Anda
        },
        securityDeposit: {
          status: 'DI TAHAN',
          original: 1000000,
          deductions: 250000, // Contoh ada potongan
          refunded: 0,
        }
      },
      {
        id: '#GR001237',
        dateRange: '10 Jul 2023 - 11 Jul 2023',
        status: 'CANCEL',
        car: {
          name: 'Daihatsu Ayla',
          priceInfo: 'Rp 500.000 (2 days)',
          returnInfo: 'Pesanan dibatalkan.',
          imageUrl: 'assets/image/tankleopard.jpeg' // Ganti dengan path gambar Anda
        },
        securityDeposit: {
          status: 'TIDAK ADA',
          original: 0,
          refunded: 0,
        }
      },
    ];
  }

  // Helper function untuk mendapatkan warna status
  getStatusColor(status: string): string {
    switch (status) {
      case 'ACTIVE':
      case 'REFUNDED':
        return 'success';
      case 'PENDING':
      case 'PROSES':
        return 'warning';
      case 'CANCEL':
      case 'DI TAHAN':
        return 'danger';
      default:
        return 'medium';
    }
  }

  // Placeholder untuk fungsi tombol
  viewReceipt(order: OrderHistory) {
    console.log('Melihat struk untuk order:', order.id);
    // Navigasi ke halaman receipt dengan membawa data order
    this.router.navigate(['/receipt'], { state: { data: order } });
  }

  bookAgain(order: OrderHistory) {
    console.log('Pesan lagi mobil:', order.car.name);
    // Navigasi ke halaman detail mobil
    // Anda perlu ID mobil yang sebenarnya di sini, untuk sementara kita arahkan ke home
    this.router.navigateByUrl('/home');
  }
}