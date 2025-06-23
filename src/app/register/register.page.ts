import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service'; // Impor AuthService

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage {
  // Properti disesuaikan agar cocok dengan nama field di backend
  name: string = '';
  nomor_telepon: string = '';
  email: string = '';
  alamat: string = '';
  tanggal_lahir: string = ''; // Format YYYY-MM-DD, cocok untuk <ion-input type="date">
  password: string = '';
  confirmPassword: string = '';
  
  simFile: File | null = null; // Menyimpan file asli untuk di-upload
  simFilePreview: string | null = null; // Menyimpan URL preview untuk ditampilkan

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  /**
   * Menangani pemilihan file SIM dan membuat preview.
   */
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.simFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.simFilePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Menghapus file SIM yang sudah dipilih.
   */
  removeSimPhoto() {
    this.simFile = null;
    this.simFilePreview = null;
    const fileInput = document.querySelector('#fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  /**
   * Logika utama untuk registrasi ke backend Laravel
   */
  async doRegister() {
    if (this.password !== this.confirmPassword) {
      this.showAlert('Error', 'Password dan konfirmasi password tidak cocok.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Mendaftarkan...',
    });
    await loading.present();

    // Buat objek FormData untuk mengirim file dan data teks
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('email', this.email);
    formData.append('password', this.password);
    formData.append('password_confirmation', this.confirmPassword);
    formData.append('nomor_telepon', this.nomor_telepon);
    formData.append('alamat', this.alamat);
    formData.append('tanggal_lahir', this.tanggal_lahir);
    if (this.simFile) {
      formData.append('path_sim', this.simFile);
    }

    // Panggil service untuk mengirim data ke API
    this.authService.register(formData).subscribe({
      next: async (response) => {
        await loading.dismiss();
        console.log('Registrasi sukses:', response);
        // Simpan token dan data user (best practice)
        localStorage.setItem('auth_token', response.data.access_token);
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
        await this.showAlert(
          'Sukses',
          'Registrasi berhasil! Anda akan diarahkan ke halaman utama.'
        );
        this.router.navigateByUrl('/home', { replaceUrl: true });
      },
      error: async (error) => {
        await loading.dismiss();
        console.error('Registrasi gagal:', error);

        // Menampilkan pesan error spesifik dari backend
        let errorMessage = 'Terjadi kesalahan. Periksa kembali data Anda.';
        if (error.status === 422 && error.error.errors) {
          const firstErrorKey = Object.keys(error.error.errors)[0];
          errorMessage = error.error.errors[firstErrorKey][0];
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
        this.showAlert('Registrasi Gagal', errorMessage);
      },
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

  goToLogin() {
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}