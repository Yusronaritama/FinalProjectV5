import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentInstructionPageRoutingModule } from './payment-instruction-routing.module';

import { PaymentInstructionPage } from './payment-instruction.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentInstructionPageRoutingModule
  ],
  declarations: [PaymentInstructionPage]
})
export class PaymentInstructionPageModule {}
