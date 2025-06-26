import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  standalone: false
})
export class ChangePasswordPage implements OnInit {

  passwordForm: FormGroup;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmNewPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastController: ToastController,
    private authService: AuthService,
    private loadingController: LoadingController
  ) {
    // Membuat struktur form
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.required]]
    });
  }

  ngOnInit() {}

  async presentToast(message: string, color: string = 'dark') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: color,
    });
    toast.present();
  }

  toggleCurrentPasswordVisibility() { this.showCurrentPassword = !this.showCurrentPassword; }
  toggleNewPasswordVisibility() { this.showNewPassword = !this.showNewPassword; }
  toggleConfirmNewPasswordVisibility() { this.showConfirmNewPassword = !this.showConfirmNewPassword; }

  async saveChanges() {
    if (this.passwordForm.invalid) {
      this.presentToast('Mohon isi semua kolom dengan benar.', 'warning');
      return;
    }

    const { newPassword, confirmNewPassword } = this.passwordForm.value;
    if (newPassword !== confirmNewPassword) {
      this.presentToast('Password baru dan konfirmasi tidak cocok.', 'danger');
      return;
    }

    const loading = await this.loadingController.create({ message: 'Menyimpan...' });
    await loading.present();

    const passwordData = {
      current_password: this.passwordForm.value.currentPassword,
      new_password: newPassword,
      new_password_confirmation: confirmNewPassword,
    };

    this.authService.changePassword(passwordData).subscribe({
      next: async (response) => {
        await loading.dismiss();
        await this.presentToast('Password berhasil diubah!', 'success');
        this.router.navigateByUrl('/profile', { replaceUrl: true });
      },
      error: async (error) => {
        await loading.dismiss();
        const errorMessage = error.error?.message || 'Terjadi kesalahan.';
        this.presentToast(errorMessage, 'danger');
      }
    });
  }
}