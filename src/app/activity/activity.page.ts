import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleService } from '../services/vehicle.service';

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
  standalone: false,
})
export class ActivityPage implements OnInit {
  public orderHistory: any[] = []; // Ubah tipe menjadi any[]
  public isLoading: boolean = true;

  constructor(
    private router: Router,
    private rentalService: VehicleService,
  ) {}

  ngOnInit() {
    this.loadOrderHistory();
  }

  loadOrderHistory() {
    this.isLoading = true;
    this.rentalService.getHistory().subscribe({
      // Panggil API riwayat
      next: (response) => {
        this.orderHistory = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Gagal memuat riwayat:', err);
        this.isLoading = false;
      },
    });
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
  viewReceipt(order: any) {
    // Ubah tipe menjadi any
    // Cek status pembayaran dari data order
    if (
      order.payment &&
      (order.payment.status_pembayaran === 'lunas' ||
        order.payment.status_pembayaran === 'paid')
    ) {
      // Jika sudah lunas, ke halaman receipt
      this.router.navigate(['/receipt'], { state: { rental: order } });
    } else {
      // Jika masih pending, ke halaman tunggu
      this.router.navigate(['/waiting-confirmation'], {
        state: { rental: order },
      });
    }
  }

  bookAgain(order: any) {
    // Ambil ID kendaraan dari data pesanan
    const vehicleId = order.vehicle.id;

    console.log(
      'Pesan lagi mobil, mengarahkan ke car-detail dengan ID:',
      vehicleId,
    );

    // Arahkan ke halaman car-detail dengan membawa ID mobil
    this.router.navigate(['/car-detail', vehicleId]);
  }
}
