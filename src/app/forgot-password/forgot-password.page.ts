import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false
})
export class ForgotPasswordPage implements OnInit {

  email: string = ''; // Property for two-way data binding for email

  constructor(
    private router: Router,
    private authService: AuthService, // <-- TAMBAHKAN INI
    private loadingCtrl: LoadingController, // <-- TAMBAHKAN INI
    private toastCtrl: ToastController // <-- TAMBAHKAN INI (untuk notifikasi)
  ) { }

  ngOnInit() {
    // Initialization logic if any
  }

  async sendResetLink() {
  if (!this.email) {
    this.presentToast('Silakan masukkan alamat email Anda.', 'warning');
    return;
  }

  const loading = await this.loadingCtrl.create({ message: 'Mengirim permintaan...' });
  await loading.present();

  this.authService.forgotPassword(this.email).subscribe({
    next: async (response) => {
      await loading.dismiss();
      // Tampilkan pesan sukses dari server
      this.presentToast(response.message, 'success');

      // Arahkan ke halaman reset-password dengan membawa email
      this.router.navigate(['/reset-password'], {
        queryParams: { email: this.email }
      });
    },
    error: async (err) => {
      await loading.dismiss();
      // Tampilkan pesan error dari server
      this.presentToast(err.error.message || 'Gagal mengirim permintaan.', 'danger');
    }
  });
}

// --- TAMBAHKAN FUNGSI HELPER UNTUK TOAST ---
async presentToast(message: string, color: 'success' | 'warning' | 'danger') {
  const toast = await this.toastCtrl.create({
    message: message,
    duration: 3000,
    color: color,
    position: 'top'
  });
  toast.present();
}

  goToLogin() {
    // Logic to go back to the login page
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
