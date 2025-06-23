import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.page.html',
  styleUrls: ['./payment-method.page.scss'],
  standalone: false
})
export class PaymentMethodPage implements OnInit {

  rentalData: any;
  selectedPayment: string = 'bca';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Ambil data dari state navigasi
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.rentalData = navigation.extras.state['data'];
      console.log('Rental data received on payment page:', this.rentalData);
    }
  }

  ngOnInit() {
    if (!this.rentalData) {
      console.error("Data rental tidak ditemukan! Kembali ke home.");
      this.router.navigateByUrl('/home');
    }
  }

  // --- TAMBAHKAN FUNGSI INI ---
  proceedToInstruction() {
    if (this.rentalData) {
      const finalData = { ...this.rentalData, paymentMethod: this.selectedPayment };
      this.router.navigate(['/payment-instruction'], {
        state: { data: finalData }
      });
    }
  }
}