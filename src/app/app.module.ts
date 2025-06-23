// --- PERBAIKAN: Menggabungkan semua impor yang dibutuhkan ---
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeId from '@angular/common/locales/id';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; 
import { AuthInterceptor } from './services/auth.interceptor'; 

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

// --- PERBAIKAN: Kode ini tidak lagi mengimpor atau mendeklarasikan LocationPermissionModalComponent ---

registerLocaleData(localeId, 'id');

@NgModule({
  declarations: [
    AppComponent,
    // LocationPermissionModalComponent dihapus sesuai versi rekan Anda
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule, // Diambil dari versi Anda
    FormsModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'id' },
    
    // --- PERBAIKAN: Menyertakan provider untuk Interceptor dari versi Anda ---
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor, 
      multi: true 
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}