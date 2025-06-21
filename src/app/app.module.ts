// --- TAMBAHKAN IMPORT INI ---
import { LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeId from '@angular/common/locales/id';
// -----------------------------

import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { LocationPermissionModalComponent } from './location-permission-modal/location-permission-modal.component';

// --- TAMBAHKAN FUNGSI INI UNTUK MEREGISTRASIKAN LOCALE INDONESIA ---
registerLocaleData(localeId, 'id');
// --------------------------------------------------------------------

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
    // --- TAMBAHKAN PROVIDER INI UNTUK MENGATUR LOCALE DEFAULT APLIKASI ---
    { provide: LOCALE_ID, useValue: 'id' }
    // -------------------------------------------------------------------
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}