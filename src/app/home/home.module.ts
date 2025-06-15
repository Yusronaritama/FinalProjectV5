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
  ],
  declarations: [
    HomePage,
    // Declare the custom modal component so it can be used in this module
    LocationPermissionModalComponent 
  ]
})
export class HomePageModule {}
