import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular'; // Import ToastController

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
    private toastController: ToastController // Inject ToastController
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

  async saveChanges() {
    console.log('Attempting to save password changes...');

    const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
    if (!loggedInUserEmail) {
      this.presentToast('User not logged in.', 'danger');
      this.router.navigateByUrl('/login', { replaceUrl: true });
      return;
    }

    const storedUsersString = localStorage.getItem('registeredUsers');
    let registeredUsers: any[] = [];
    if (storedUsersString) {
      try {
        registeredUsers = JSON.parse(storedUsersString);
      } catch (e) {
        console.error('Error parsing registered users from localStorage:', e);
        localStorage.removeItem('registeredUsers'); // Clear corrupted data
        this.presentToast('Error loading user data. Please try again.', 'danger');
        return;
      }
    }

    const userIndex = registeredUsers.findIndex(u => u.email === loggedInUserEmail);
    if (userIndex === -1) {
      this.presentToast('User not found in registered list.', 'danger');
      this.router.navigateByUrl('/login', { replaceUrl: true });
      return;
    }

    const currentUser = registeredUsers[userIndex];

    // 1. Validasi password lama
    if (this.currentPassword !== currentUser.password) {
      this.presentToast('Password lama tidak sesuai.', 'danger');
      return;
    }

    // 2. Validasi password baru dan konfirmasi password baru
    if (this.newPassword !== this.confirmNewPassword) {
      this.presentToast('Password baru tidak cocok.', 'danger');
      return;
    }

    // 3. Validasi password baru tidak boleh sama dengan password lama
    if (this.newPassword === this.currentPassword) {
      this.presentToast('Password baru tidak boleh sama dengan password lama.', 'warning');
      return;
    }

    // Perbarui password
    currentUser.password = this.newPassword;
    registeredUsers[userIndex] = currentUser; // Pastikan objek diperbarui dalam array

    // Simpan kembali ke localStorage
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    this.presentToast('Password berhasil diubah!', 'success');
    console.log('Password successfully changed for user:', loggedInUserEmail);
    
    // Navigasi kembali ke halaman profil setelah perubahan berhasil
    this.router.navigateByUrl('/profile', { replaceUrl: true });
  }

  // Metode ini tidak lagi diperlukan karena navigasi langsung ke halaman
  // async dismiss() { /* ... */ }
}
