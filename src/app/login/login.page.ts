import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service'; // Impor AuthService

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false // Pastikan ini false jika menggunakan module
})
export class LoginPage {

  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService, // Suntikkan AuthService
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  /**
   * Logika utama untuk login ke backend Laravel
   */
  async doLogin() {
    // Tampilkan loading spinner untuk feedback ke user
    const loading = await this.loadingController.create({
      message: 'Logging in...',
    });
    await loading.present();

    // Siapkan data kredensial untuk dikirim
    const credentials = {
      email: this.email,
      password: this.password
    };

    // Panggil method login dari service
    this.authService.login(credentials).subscribe({
      next: async (response) => {
        // Jika sukses
        await loading.dismiss(); // Hentikan loading
        console.log('Login sukses:', response);

        // Simpan token dan data user ke localStorage
        localStorage.setItem('auth_token', response.data.access_token);
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
        
        // Arahkan ke halaman utama setelah login
        this.router.navigateByUrl('/home', { replaceUrl: true });
      },
      error: async (error) => {
        // Jika gagal
        await loading.dismiss(); // Hentikan loading
        console.error('Login gagal:', error);
        
        // Ambil pesan error dari backend jika ada, jika tidak, tampilkan pesan umum
        const message = error.error.message || 'Email atau password tidak valid. Silakan coba lagi.';
        this.showAlert('Login Gagal', message);
      }
    });
  }
  
  /**
   * Fungsi bantuan untuk menampilkan alert
   */
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Fungsi navigasi lainnya tetap sama
  goToRegister() {
    this.router.navigateByUrl('/register', { replaceUrl: true });
  }
}