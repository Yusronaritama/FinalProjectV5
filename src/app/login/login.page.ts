import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';
  showLoginError: boolean = false; // Properti untuk mengontrol tampilan error

  constructor(private router: Router) { }

  ngOnInit() {
    // Logika inisialisasi jika ada
  }

  doLogin() {
    console.log('Attempting login...');
    console.log('Email:', this.email);
    console.log('Password:', this.password);

    this.showLoginError = false; // Pastikan error disembunyikan sebelum mencoba login

    const storedUsersString = localStorage.getItem('registeredUsers');
    let registeredUsers: { email: string, password: string }[] = [];
    if (storedUsersString) {
      try {
        registeredUsers = JSON.parse(storedUsersString);
      } catch (e) {
        console.error('Error parsing stored users from localStorage', e);
        localStorage.removeItem('registeredUsers');
      }
    }

    let isLoginSuccessful = false;
    let loggedInUserEmail: string | null = null; // Tambahkan variabel ini

    if (this.email && this.password) {
      const foundUser = registeredUsers.find(user => 
        user.email === this.email && user.password === this.password
      );
      if (foundUser) {
        isLoginSuccessful = true;
        loggedInUserEmail = foundUser.email; // Simpan email pengguna yang berhasil login
      }
    }
    
    setTimeout(() => {
      if (isLoginSuccessful) {
        console.log('Login successful! Redirecting to home page.');
        // PENTING: Simpan email pengguna yang login ke localStorage
        if (loggedInUserEmail) {
          localStorage.setItem('loggedInUserEmail', loggedInUserEmail);
          console.log('Logged-in user email saved:', loggedInUserEmail);
        }
        this.router.navigateByUrl('/home', { replaceUrl: true });
      } else {
        this.showLoginError = true;
        console.log('Login failed: Invalid credentials or user not found.');
        setTimeout(() => {
          this.showLoginError = false;
        }, 5000);
      }
      
    }, 1000);
  }

  goToRegister() {
    this.router.navigateByUrl('/register', { replaceUrl: true });
  }
}
