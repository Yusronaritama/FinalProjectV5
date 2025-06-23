import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RentalCustomPageRoutingModule } from './rental-custom-routing.module';

import { RentalCustomPage } from './rental-custom.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RentalCustomPageRoutingModule
  ],
  declarations: [RentalCustomPage]
})
export class RentalCustomPageModule {}
