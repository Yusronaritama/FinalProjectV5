import { Component, OnInit } from '@angular/core';
import { Router, Navigation } from '@angular/router';

@Component({
  selector: 'app-waiting-confirmation',
  templateUrl: './waiting-confirmation.page.html',
  styleUrls: ['./waiting-confirmation.page.scss'],
  standalone: false
})
export class WaitingConfirmationPage implements OnInit {

  private navigation: Navigation | null;

  constructor(private router: Router) {
    // Ambil data navigasi saat ini untuk diteruskan lagi nanti
    this.navigation = this.router.getCurrentNavigation();
  }

  ngOnInit() {
    setTimeout(() => {
      // Ambil state dari navigasi sebelumnya
      const state = this.navigation?.extras.state;
      
      // Arahkan ke halaman receipt, teruskan state yang sama
      this.router.navigate(['/receipt'], { 
        state, // Ini akan meneruskan { data: rentalData } ke halaman receipt
        replaceUrl: true 
      });
    }, 5000); // Tunggu 5 detik
  }
}