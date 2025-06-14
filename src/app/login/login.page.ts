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

    // --- Logika Login Sebenarnya (Ganti dengan panggilan API Anda) ---
    // Di sini Anda akan memiliki validasi email/password yang sebenarnya
    // dan panggilan ke service autentikasi Anda (misalnya this.authService.login(this.email, this.password)).

    // Mengambil data pengguna yang terdaftar dari localStorage
    const storedUsersString = localStorage.getItem('registeredUsers');
    let registeredUsers: { email: string, password: string }[] = [];
    if (storedUsersString) {
      try {
        registeredUsers = JSON.parse(storedUsersString);
      } catch (e) {
        console.error('Error parsing stored users from localStorage', e);
        // Hapus data yang korup jika terjadi error parsing
        localStorage.removeItem('registeredUsers');
      }
    }

    let isLoginSuccessful = false;
    // Memeriksa apakah kredensial yang dimasukkan cocok dengan pengguna yang terdaftar
    if (this.email && this.password) { // Memastikan bidang tidak kosong
      isLoginSuccessful = registeredUsers.some(user => 
        user.email === this.email && user.password === this.password
      );
    }
    
    // Mensimulasikan penundaan jaringan untuk percobaan login
    setTimeout(() => {
      if (isLoginSuccessful) {
        console.log('Login successful! Redirecting to home page.');
        // Navigasi ke halaman '/home' setelah login berhasil
        // 'replaceUrl: true' akan mengganti URL saat ini di riwayat browser
        // sehingga pengguna tidak bisa kembali ke halaman login dengan tombol back
        this.router.navigateByUrl('/home', { replaceUrl: true });
      } else {
        // Logika untuk login gagal
        this.showLoginError = true; // Tampilkan pesan error
        console.log('Login failed: Invalid credentials or user not found.');

        // Opsional: Sembunyikan pesan error setelah beberapa detik
        setTimeout(() => {
          this.showLoginError = false;
        }, 5000); // Pesan akan hilang setelah 5 detik
      }
      
    }, 1000); // Simulasikan proses login selama 1 detik
  }

  goToRegister() {
    this.router.navigateByUrl('/register', { replaceUrl: true });
  }

  // Jika Anda memiliki goToForgotPassword, tambahkan juga di sini
  // goToForgotPassword() {
  //   this.router.navigateByUrl('/forgot-password');
  // }
}
