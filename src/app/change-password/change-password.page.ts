import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular'; // Import LoadingController
import { AuthService } from '../services/auth.service'; // Import AuthService

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  standalone: false
})
export class ChangePasswordPage implements OnInit {

  currentPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';

  // State variables for password visibility
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmNewPassword = false;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private authService: AuthService, // Inject AuthService
    private loadingController: LoadingController // Inject LoadingController
  ) { }

  ngOnInit() { }

  /**
   * Displays a toast message.
   * @param message The message to display.
   * @param color The color of the toast (e.g., 'success', 'danger', 'warning').
   * @param position The position of the toast ('top', 'bottom', 'middle').
   */
  async presentToast(message: string, color: string = 'dark', position: 'top' | 'bottom' | 'middle' = 'top') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000, // Toast will disappear after 3 seconds
      position: position,
      color: color,
    });
    toast.present();
  }

  /**
   * Toggles the visibility of the current password input.
   */
  toggleCurrentPasswordVisibility() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  /**
   * Toggles the visibility of the new password input.
   */
  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  /**
   * Toggles the visibility of the confirm new password input.
   */
  toggleConfirmNewPasswordVisibility() {
    this.showConfirmNewPassword = !this.showConfirmNewPassword;
  }

  // --- PERUBAHAN UTAMA PADA LOGIKA PENYIMPANAN ---
  async saveChanges() {
    // Validasi frontend sederhana
    if (this.newPassword !== this.confirmNewPassword) {
      this.presentToast('Password baru dan konfirmasi tidak cocok.', 'danger');
      return;
    }

    if (!this.currentPassword || !this.newPassword) {
        this.presentToast('Semua kolom wajib diisi.', 'warning');
        return;
    }

    const loading = await this.loadingController.create({ message: 'Menyimpan...' });
    await loading.present();

    const passwordData = {
      current_password: this.currentPassword,
      new_password: this.newPassword,
      new_password_confirmation: this.confirmNewPassword,
    };

    this.authService.changePassword(passwordData).subscribe({
      next: async (response) => {
        await loading.dismiss();
        await this.presentToast('Password berhasil diubah!', 'success');
        this.router.navigateByUrl('/profile', { replaceUrl: true });
      },
      error: async (error) => {
        await loading.dismiss();
        let errorMessage = 'Terjadi kesalahan.';
        // Ambil pesan error dari backend jika ada
        if (error.error?.message) {
            errorMessage = error.error.message;
        } else if (error.error?.errors) {
            const firstErrorKey = Object.keys(error.error.errors)[0];
            errorMessage = error.error.errors[firstErrorKey][0];
        }
        this.presentToast(errorMessage, 'danger');
      }
    });
  }

  // Metode ini tidak lagi diperlukan karena navigasi langsung ke halaman
  // async dismiss() { /* ... */ }
}
