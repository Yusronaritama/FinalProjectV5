import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

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
  providedIn: 'root',
})
// PASTIKAN CLASS DIEKSPOR
export class VehicleService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllVehicles(params: any = null): Observable<{ data: Vehicle[] }> {
    // Jika ada parameter, tambahkan ke URL
    let httpParams = new HttpParams();
    if (params && params.pickupDate) {
      httpParams = httpParams.set('pickup_date', params.pickupDate);
    }
    return this.http.get<{ data: Vehicle[] }>(`${this.apiUrl}/vehicles`, {
      params: httpParams,
    });
  }

  getVehicleById(id: string | number): Observable<{ data: Vehicle }> {
    return this.http.get<{ data: Vehicle }>(`${this.apiUrl}/vehicles/${id}`);
  }
  // Letakkan method ini di dalam class VehicleService

  createRental(rentalData: any): Observable<any> {
    const formData = new FormData();

    formData.append('vehicle_id', rentalData.car.id);
    formData.append('waktu_sewa', rentalData.pickup);
    formData.append('waktu_kembali', rentalData.return);
    formData.append('delivery_option', rentalData.driverOption);
    formData.append('payment_method', rentalData.paymentMethod);

    // -- PENTING: TAMBAHKAN BLOK IF INI --
    if (rentalData.deliveryAddress) {
      formData.append('delivery_address', rentalData.deliveryAddress);
    }

    if (rentalData.paymentProofFile) {
      formData.append(
        'payment_proof',
        rentalData.paymentProofFile,
        rentalData.paymentProofFile.name,
      );
    }

    return this.http.post(`${this.apiUrl}/rentals`, formData);
  }

  /**
   * Mengambil riwayat rental milik pengguna yang sedang login.
   */
  getHistory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/rentals/history`);
  }

  /**
   * Memeriksa status dari satu rental spesifik berdasarkan ID-nya.
   */
  getRentalStatus(rentalId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/rentals/${rentalId}/status`);
  }

  /**
   * Mengambil daftar tanggal yang tidak tersedia untuk sebuah mobil.
   */
  getBookedDates(vehicleId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/vehicles/${vehicleId}/booked-dates`);
  }
}
