import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { LocationPermissionModalComponent } from './location-permission-modal/location-permission-modal.component';

// HAPUS SEMUA IMPORT YANG BERHUBUNGAN DENGAN HALAMAN YANG SUDAH PUNYA MODUL SENDIRI
// CONTOH: import { CarDetailPage } from './car-detail/car-detail.page'; <-- INI DIHAPUS

// 1. Impor HttpClientModule, ini adalah alat untuk memanggil API
import { HttpClientModule } from '@angular/common/http';

@NgModule({
<<<<<<< HEAD
  declarations: [AppComponent],
  // 2. Tambahkan HttpClientModule ke dalam array imports
=======
  declarations: [
    AppComponent,
    LocationPermissionModalComponent,
    // HAPUS CarDetailPage DARI SINI
  ],
>>>>>>> ac753e8de985b86de47c21802e49f6ea95a94089
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
<<<<<<< HEAD
    HttpClientModule // Pastikan ini ada
=======
    FormsModule
>>>>>>> ac753e8de985b86de47c21802e49f6ea95a94089
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}