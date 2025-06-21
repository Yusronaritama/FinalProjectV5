import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentMethodPage } from './payment-method.page'; // <-- UBAH INI

const routes: Routes = [
  {
    path: '',
    component: PaymentMethodPage // <-- UBAH INI
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentMethodPageRoutingModule {} // <-- UBAH NAMA CLASS (OPSIONAL TAPI DIANJURKAN)