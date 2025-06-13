import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
  // Ini adalah komponen non-standalone, jadi tidak ada 'standalone: true' di sini
})
export class RegisterPage implements OnInit {

  // Properti untuk two-way data binding ([(ngModel)])
  fullName: string = '';
  phoneNumber: string = '';
  email: string = '';
  currentLocation: string = '';
  birthDate: string = ''; // Akan menyimpan tanggal dalam format ISO 8601 (misal: "2023-10-26T00:00:00")
  formattedBirthDate: string = ''; // Untuk menampilkan tanggal dalam format DD/MM/YYYY
  password: string = '';
  confirmPassword: string = '';

  constructor(private router: Router) { }

  ngOnInit() {
    // Optional: Logika inisialisasi
  }

  // Method untuk handle event perubahan tanggal dari ion-datetime
  onDateChange(event: CustomEvent) {
    if (event.detail.value) {
      const date = new Date(event.detail.value);
      this.formattedBirthDate = this.formatDate(date);
    } else {
      this.formattedBirthDate = '';
    }
  }

  // Helper function untuk format tanggal menjadi DD/MM/YYYY
  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  doRegister() {
    // Logika registrasi Anda di sini
    console.log('Full Name:', this.fullName);
    console.log('Phone Number:', this.phoneNumber);
    console.log('Email:', this.email);
    console.log('Current Location:', this.currentLocation);
    console.log('Birth Date:', this.birthDate); // Format ISO
    console.log('Formatted Birth Date:', this.formattedBirthDate); // Format tampilan
    console.log('Password:', this.password);
    console.log('Confirm Password:', this.confirmPassword);

    // Contoh validasi sederhana
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!'); // Ganti dengan Toast/Modal Ionic
      return;
    }

    // Lanjutkan dengan pengiriman data ke server atau logika lainnya
    alert('Registration successful! (Not really, just a demo)'); // Ganti dengan Toast/Modal Ionic
    // Setelah register, bisa diarahkan ke halaman login atau home
    // this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  goToLogin() {
    // Logika untuk kembali ke halaman login
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
