import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentInstructionPage } from './payment-instruction.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentInstructionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentInstructionPageRoutingModule {}
