// ===================================================================
// KODE LENGKAP auth.service.ts DENGAN PENJELASAN PERUBAHAN
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
  nomor_rekening: string;
  avatarIcon?: string;
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
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  // --- NOTE: PERUBAHAN ---
  // BehaviorSubject untuk status login sekarang langsung diinisialisasi
  // dengan memanggil fungsi hasToken() untuk keakuratan saat aplikasi dimuat.
  private isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticated.asObservable();

  // --- NOTE: TAMBAHAN ---
  // BehaviorSubject baru yang khusus untuk menyimpan dan menyiarkan nama ikon avatar.
  // Diinisialisasi dengan memanggil getInitialAvatar().
  private currentAvatar = new BehaviorSubject<string>(this.getInitialAvatar());
  public currentAvatar$ = this.currentAvatar.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    // --- NOTE: PERUBAHAN ---
    // Constructor sekarang kosong karena pemanggilan checkTokenOnLoad() sudah tidak diperlukan lagi.
  }

  // --- NOTE: PERUBAHAN ---
  // Fungsi checkTokenOnLoad() diganti dengan hasToken() yang lebih ringkas
  // dan digunakan langsung saat inisialisasi BehaviorSubject.
  private hasToken(): boolean {
    const token = localStorage.getItem('auth_token');
    return !!token;
  }

  updateUserInStorage(user: User) {
    // Ambil avatar lama agar tidak hilang saat data di-refresh
    const oldUser = this.getUser();
    user.avatarIcon = oldUser?.avatarIcon || 'person-circle-outline';
    localStorage.setItem('user_data', JSON.stringify(user));
  }

  // --- NOTE: TAMBAHAN ---
  // Fungsi baru untuk mendapatkan avatar yang tersimpan di localStorage saat aplikasi pertama kali dibuka.
  private getInitialAvatar(): string {
    const user = this.getUser();
    return user?.avatarIcon || 'person-circle-outline';
  }

  // --- NOTE: TAMBAHAN ---
  // Fungsi baru yang akan dipanggil dari halaman profil untuk:
  // 1. Menyiarkan nama ikon baru ke semua 'pendengar' (seperti Halaman Beranda).
  // 2. Menyimpan pilihan ikon baru ke localStorage agar tidak hilang.
  updateAvatar(iconName: string) {
    this.currentAvatar.next(iconName);
    const user = this.getUser();
    if (user) {
      user.avatarIcon = iconName;
      localStorage.setItem('user_data', JSON.stringify(user));
    }
  }

  register(userData: FormData): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap((response) => {
          if (response && response.data.access_token) {
            this.storeAuthData(response);
          }
        }),
      );
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          if (response && response.data.access_token) {
            this.storeAuthData(response);
          }
        }),
      );
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    this.isAuthenticated.next(false);
    // --- NOTE: TAMBAHAN ---
    // Saat logout, reset avatar kembali ke ikon default.
    this.currentAvatar.next('person-circle-outline');
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  changePassword(passwordData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/change-password`, passwordData);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`);
  }

  /**
   * Mengirim permintaan lupa password ke backend.
   */
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  /**
   * Mengirim data untuk mereset password baru.
   */
  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }

  // --- NOTE: TAMBAHAN ---
  // Fungsi baru yang akan dipanggil dari halaman profil untuk mengirim
  // perubahan data (telepon, alamat, dll.) ke server backend.
  updateUserProfile(profileData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/user/profile`, profileData).pipe(
      tap((response) => {
        // Jika backend mengembalikan data user yang baru, perbarui localStorage
        if (response && response.data) {
          // Ambil avatar lama agar tidak hilang saat data di-refresh
          const oldUser = this.getUser();
          const updatedUser = response.data;
          updatedUser.avatarIcon = oldUser?.avatarIcon;

          localStorage.setItem('user_data', JSON.stringify(updatedUser));
        }
      }),
    );
  }

  getUser(): User | null {
    const userString = localStorage.getItem('user_data');
    if (userString) {
      return JSON.parse(userString) as User;
    }
    return null;
  }

  private storeAuthData(response: AuthResponse) {
    const user = response.data.user;
    // --- NOTE: TAMBAHAN ---
    // Saat login/register pertama kali, beri avatar default jika belum ada.
    user.avatarIcon = user.avatarIcon || 'person-circle-outline';

    localStorage.setItem('auth_token', response.data.access_token);
    localStorage.setItem('user_data', JSON.stringify(user));

    this.isAuthenticated.next(true);
    // --- NOTE: TAMBAHAN ---
    // Siarkan avatar yang aktif saat login.
    this.currentAvatar.next(user.avatarIcon);
  }
}
