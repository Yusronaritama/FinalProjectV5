// --- Bagian Locale Anda (Sudah Benar) ---
import { LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeId from '@angular/common/locales/id';

// --- Perubahan Dimulai Di Sini ---
// 1. Impor HttpClientModule dan HTTP_INTERCEPTORS
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; 
// 2. Impor AuthInterceptor yang sudah kita buat
import { AuthInterceptor } from './services/auth.interceptor'; 
// --- Akhir Perubahan ---

import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { LocationPermissionModalComponent } from './location-permission-modal/location-permission-modal.component';

registerLocaleData(localeId, 'id');

@NgModule({
  declarations: [
    AppComponent,
    LocationPermissionModalComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'id' },
    
    // --- TAMBAHKAN PROVIDER UNTUK INTERCEPTOR DI SINI ---
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor, 
      multi: true 
    }
    // --- AKHIR TAMBAHAN ---
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}