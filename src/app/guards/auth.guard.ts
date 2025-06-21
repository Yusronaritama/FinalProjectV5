import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service'; // 1. Impor AuthService

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService, // 2. Suntikkan AuthService
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    // 3. Kembalikan observable dari service, bukan boolean langsung
    // Ini akan secara reaktif memeriksa status login terkini
    return this.authService.isAuthenticated$.pipe(
      take(1), // Ambil 1 nilai terbaru lalu berhenti langganan untuk efisiensi
      map(isAuthenticated => { // 'map' mengubah nilai (true/false) menjadi hasil akhir
        if (isAuthenticated) {
          // Jika statusnya true, izinkan akses ke halaman
          console.log('AuthGuard: User is authenticated. Access granted.');
          return true;
        } else {
          // Jika statusnya false, arahkan ke login dan tolak akses
          console.log('AuthGuard: User is NOT authenticated. Redirecting to login page.');
          this.router.navigateByUrl('/login');
          return false;
        }
      })
    );
  }
}