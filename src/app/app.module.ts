// --- TAMBAHKAN IMPORT INI ---
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeId from '@angular/common/locales/id';
// -----------------------------

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

// HAPUS IMPORT INI
// import { LocationPermissionModalComponent } from './location-permission-modal/location-permission-modal.component';

registerLocaleData(localeId, 'id');

@NgModule({
  declarations: [
    AppComponent,
    // HAPUS LocationPermissionModalComponent DARI SINI
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
    // --- TAMBAHKAN PROVIDER INI UNTUK MENGATUR LOCALE DEFAULT APLIKASI ---
    { provide: LOCALE_ID, useValue: 'id' }
    // -------------------------------------------------------------------
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}