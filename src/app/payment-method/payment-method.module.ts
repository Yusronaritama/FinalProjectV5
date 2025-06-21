import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PaymentMethodPageRoutingModule } from './payment-method-routing.module'; // <-- UBAH INI
import { PaymentMethodPage } from './payment-method.page'; // <-- UBAH INI

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentMethodPageRoutingModule // <-- UBAH INI
  ],
  declarations: [PaymentMethodPage] // <-- UBAH INI
})
export class PaymentMethodPageModule {} // <-- UBAH NAMA CLASS