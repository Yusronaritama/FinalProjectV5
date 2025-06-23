import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

// PASTIKAN INTERFACE DIEKSPOR
export interface VehicleImage {
  id: number;
  vehicle_id: number;
  path: string; // <-- PERBAIKAN: Ubah dari 'image_path' menjadi 'path'
}

// PASTIKAN INTERFACE DIEKSPOR
export interface Vehicle {
  id: number;
  nama: string;
  merk: string;
  transmisi: string;
  jumlah_kursi: number;
  bahan_bakar: string;
  has_ac: boolean; // <-- TAMBAHKAN PROPERTI INI
  harga_sewa_harian: number;
  security_deposit: number; // <-- TAMBAHKAN PROPERTI INI
  deskripsi: string;
  foto_utama: string;
  status: 'tersedia' | 'disewa' | 'servis';
  images: VehicleImage[];
}

// TAMBAHKAN DECORATOR INJECTABLE
@Injectable({
  providedIn: 'root'
})
// PASTIKAN CLASS DIEKSPOR
export class VehicleService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllVehicles(): Observable<{ data: Vehicle[] }> {
    return this.http.get<{ data: Vehicle[] }>(`${this.apiUrl}/vehicles`);
  }

  getVehicleById(id: string | number): Observable<{ data: Vehicle }> {
    return this.http.get<{ data: Vehicle }>(`${this.apiUrl}/vehicles/${id}`);
  }
}