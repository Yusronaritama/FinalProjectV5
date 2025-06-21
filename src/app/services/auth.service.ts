// Ganti seluruh isi file auth.service.ts Anda dengan ini

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
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
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticated.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkTokenOnLoad();
  }

  private checkTokenOnLoad() {
    const token = localStorage.getItem('auth_token');
    this.isAuthenticated.next(!!token);
  }
  
  // ... (method register dan login tetap sama) ...
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

  // == FUNGSI BARU DI SINI ==
  /**
   * Mengambil data pengguna yang tersimpan dari localStorage.
   */
  getUser(): User | null {
    const userString = localStorage.getItem('user_data');
    if (userString) {
      return JSON.parse(userString) as User;
    }
    return null;
  }
  
  // Fungsi bantuan untuk menyimpan data
  private storeAuthData(response: AuthResponse) {
    localStorage.setItem('auth_token', response.data.access_token);
    localStorage.setItem('user_data', JSON.stringify(response.data.user));
    this.isAuthenticated.next(true);
  }
}