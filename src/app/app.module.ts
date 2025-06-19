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

@NgModule({
  declarations: [
    AppComponent,
    LocationPermissionModalComponent,
    // HAPUS CarDetailPage DARI SINI
  ],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    FormsModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}