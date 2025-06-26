// ===================================================================
// KODE PENGGANTI LENGKAP UNTUK: src/app/settings/settings.page.ts
// Versi ini sudah terhubung dengan AuthService untuk mengambil data pengguna.
// ===================================================================

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../services/auth.service'; // 1. Impor AuthService dan interface User

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false
})
export class SettingsPage implements OnInit {

  // 2. Properti untuk menyimpan data pengguna
  public user: User | null = null;

  constructor(
    private authService: AuthService, // 3. Suntikkan AuthService
    private router: Router
  ) { }

  ngOnInit() {
    // Bisa dibiarkan kosong, kita akan gunakan ionViewWillEnter
  }

  // 4. Gunakan ionViewWillEnter agar data selalu terbaru setiap kali halaman dibuka
  ionViewWillEnter() {
    this.loadUserData();
  }

  loadUserData() {
    // 5. Panggil fungsi getUser() dari AuthService yang mengambil data dari localStorage
    this.user = this.authService.getUser();

    // Jika karena suatu alasan data tidak ada, arahkan ke halaman login
    if (!this.user) {
      console.error('Data pengguna tidak ditemukan, mengarahkan ke login...');
      this.router.navigateByUrl('/login');
    }
  }

  // Fungsi untuk tombol logout
  logout() {
    this.authService.logout();
  }

  goToChangePassword() {
    this.router.navigateByUrl('/change-password');
  }
}