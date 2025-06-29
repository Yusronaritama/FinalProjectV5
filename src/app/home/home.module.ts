import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';
import { LocationPermissionModalComponent } from '../location-permission-modal/location-permission-modal.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
    // Hapus RentalSearchFormComponent dari sini
  ],
  declarations: [
    HomePage,
    LocationPermissionModalComponent,
     // <-- PINDAHKAN KE SINI (declarations)
  ]
})
export class HomePageModule {}