import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarRandomListPageRoutingModule } from './car-random-list-routing.module';

import { CarRandomListPage } from './car-random-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarRandomListPageRoutingModule
  ],
  declarations: [CarRandomListPage]
})
export class CarRandomListPageModule {}
