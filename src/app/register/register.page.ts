import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {

  // Properties for two-way data binding ([(ngModel)])
  fullName: string = '';
  phoneNumber: string = '';
  email: string = '';
  currentLocation: string = '';
  formattedBirthDate: string = ''; // Used for manual date input
  password: string = '';
  confirmPassword: string = '';

  constructor(private router: Router) { }

  ngOnInit() {
    // Optional: Initialization logic
  }

  // New method to handle changes in the manual date input
  onManualDateChange() {
    let value = this.formattedBirthDate;
    value = value.replace(/[^0-9/]/g, '');

    if (value.length === 2 && value.indexOf('/') === -1) {
      value += '/';
    } else if (value.length === 5 && value.lastIndexOf('/') === 2) {
      value += '/';
    }

    if (value.length > 10) {
      value = value.substring(0, 10);
    }
    this.formattedBirthDate = value;

    console.log('Manual Date Input (formatted):', this.formattedBirthDate);
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (dateRegex.test(this.formattedBirthDate)) {
      console.log('Date format is valid.');
    } else {
      console.log('Date format is invalid. Please use DD/MM/YYYY.');
    }
  }

  doRegister() {
    console.log('Full Name:', this.fullName);
    console.log('Phone Number:', this.phoneNumber);
    console.log('Email:', this.email);
    console.log('Current Location:', this.currentLocation);
    console.log('Birth Date (Manual Input):', this.formattedBirthDate);
    console.log('Password:', this.password);
    console.log('Confirm Password:', this.confirmPassword);

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!'); // Ganti dengan Toast/Modal Ionic
      return;
    }

    // --- Logika untuk menyimpan pengguna untuk tujuan demo ---
    const newUser = {
      email: this.email,
      password: this.password
    };

    let registeredUsersString = localStorage.getItem('registeredUsers');
    let registeredUsers: { email: string, password: string }[] = [];
    if (registeredUsersString) {
      try {
        registeredUsers = JSON.parse(registeredUsersString);
      } catch (e) {
        console.error('Error parsing existing users from localStorage', e);
        // Hapus data yang korup jika terjadi error parsing
        localStorage.removeItem('registeredUsers');
      }
    }

    // Memeriksa apakah pengguna sudah terdaftar
    if (registeredUsers.some(user => user.email === newUser.email)) {
      alert('Email already registered. Please login or use a different email.'); // Ganti dengan Toast/Modal
      return;
    }

    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    console.log('New user registered and saved:', newUser);

    alert('Registration successful! You can now log in.'); // Ganti dengan Toast/Modal Ionic
    // --- Akhir Logika untuk menyimpan pengguna untuk tujuan demo ---

    // Mengarahkan ke halaman login setelah registrasi berhasil
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  goToLogin() {
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
