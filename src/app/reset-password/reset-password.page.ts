import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: false
})
export class ResetPasswordPage implements OnInit {

  formData = {
    email: '',
    token: '',
    password: '',
    password_confirmation: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    // Ambil email dari query parameter di URL
    this.route.queryParams.subscribe(params => {
      this.formData.email = params['email'] || '';
    });
  }

  async resetPassword() {
    if (this.formData.password !== this.formData.password_confirmation) {
      this.presentToast('Password dan konfirmasi password tidak cocok.', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Mereset password...' });
    await loading.present();

    this.authService.resetPassword(this.formData).subscribe({
      next: async (response) => {
        await loading.dismiss();
        this.presentToast(response.message, 'success');
        // Arahkan ke halaman login setelah berhasil
        this.router.navigateByUrl('/login', { replaceUrl: true });
      },
      error: async (err) => {
        await loading.dismiss();
        this.presentToast(err.error.message || 'Gagal mereset password.', 'danger');
      }
    });
  }

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
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}