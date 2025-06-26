// ===================================================================
// KODE PENGGANTI LENGKAP UNTUK: src/app/services/auth.service.ts
// Versi ini lebih efisien dan akan menyelesaikan masalah tombol Anda.
// ===================================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

// Definisikan Interface untuk struktur data
export interface User {
  id: number;
  name: string;
  email: string;
  nomor_telepon: string;
  alamat: string;
  path_sim: string;
  tanggal_lahir: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    access_token: string;
    token_type: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  // --- PERUBAHAN UTAMA ADA DI SINI ---
  // BehaviorSubject sekarang langsung diinisialisasi dengan status token yang benar.
  private isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticated.asObservable();
  // --- AKHIR PERUBAHAN ---

  constructor(private http: HttpClient, private router: Router) {
    // Constructor sekarang bisa kosong, karena pengecekan token sudah dilakukan saat inisialisasi.
  }

  // --- PERUBAHAN: Fungsi checkTokenOnLoad() digantikan dengan hasToken() yang lebih efisien ---
  private hasToken(): boolean {
    const token = localStorage.getItem('auth_token');
    return !!token; // Mengembalikan true jika token ada, false jika tidak ada
  }
  
  // Method register dan login Anda sudah benar dan tidak perlu diubah.
  register(userData: FormData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        if (response && response.data.access_token) {
          this.storeAuthData(response);
        }
      })
    );
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.data.access_token) {
          this.storeAuthData(response);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    this.isAuthenticated.next(false);
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  changePassword(passwordData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/change-password`, passwordData);
  }
  
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`);
  }

  getUser(): User | null {
    const userString = localStorage.getItem('user_data');
    if (userString) {
      return JSON.parse(userString) as User;
    }
    return null;
  }
  
  private storeAuthData(response: AuthResponse) {
    localStorage.setItem('auth_token', response.data.access_token);
    localStorage.setItem('user_data', JSON.stringify(response.data.user));
    this.isAuthenticated.next(true);
  }
}