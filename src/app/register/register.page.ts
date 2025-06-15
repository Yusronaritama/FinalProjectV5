import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {

  fullName: string = '';
  phoneNumber: string = '';
  email: string = '';
  currentLocation: string = '';
  formattedBirthDate: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private router: Router) { }

  ngOnInit() { }

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
    console.log('Attempting Registration...');
    
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!'); 
      return;
    }

    // Objek newUser ini akan dikonversi ke string JSON. Pastikan semua field ada dan benar.
    const newUser = {
      fullName: this.fullName,
      phoneNumber: this.phoneNumber, 
      email: this.email,
      currentLocation: this.currentLocation,
      formattedBirthDate: this.formattedBirthDate,
      password: this.password 
    };

    let registeredUsers: any[] = [];
    const storedUsersString = localStorage.getItem('registeredUsers');

    if (storedUsersString) {
      try {
        registeredUsers = JSON.parse(storedUsersString);
      } catch (e) {
        // Jika ada error parsing, hapus data lama yang rusak dan mulai dengan array kosong
        console.error('Error parsing existing users from localStorage. Clearing corrupted data.', e);
        localStorage.removeItem('registeredUsers'); 
        registeredUsers = []; 
      }
    }

    if (registeredUsers.some(user => user.email === newUser.email)) {
      alert('Email already registered. Please login or use a different email.'); 
      return;
    }

    registeredUsers.push(newUser);
    // KONFIRMASI: Pastikan JSON.stringify(registeredUsers) menghasilkan string yang valid di konsol
    const finalUsersString = JSON.stringify(registeredUsers);
    localStorage.setItem('registeredUsers', finalUsersString);
    console.log('New user registered. Final string saved to localStorage:', finalUsersString); 
    console.log('Object saved:', newUser); // Konfirmasi objek yang disimpan

    alert('Registration successful! You can now log in.'); 
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  goToLogin() {
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
