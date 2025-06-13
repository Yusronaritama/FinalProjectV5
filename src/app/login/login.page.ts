// src/app/login/login.page.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Jika Anda akan menggunakan router untuk navigasi

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  // DEKLARASIKAN PROPERTI DI SINI
  email: string = '';    // Tambahkan baris ini
  password: string = ''; // Tambahkan baris ini jika Anda juga menggunakan ngModel untuk password

  constructor(private router: Router) { } // Tambahkan Router jika belum ada

  ngOnInit() {
    // Logika inisialisasi jika ada
  }

  // Contoh method untuk login (jika Anda akan mengimplementasikannya)
  doLogin() {
    console.log('Email:', this.email);
    console.log('Password:', this.password);
  }
  goToRegister() {
    this.router.navigateByUrl('/register', { replaceUrl: true });
  }
}