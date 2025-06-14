// src/app/app.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false
})
export class AppComponent {
  constructor(private router: Router) {} // Inject Router

  doLogout() {
    console.log('User logged out');
    // Implementasi logika logout di sini:
    // - Hapus token autentikasi (dari localStorage, sessionStorage, atau service)
    // - Arahkan pengguna ke halaman login
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}