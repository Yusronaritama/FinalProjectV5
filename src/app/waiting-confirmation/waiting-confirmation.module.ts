import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WaitingConfirmationPageRoutingModule } from './waiting-confirmation-routing.module';

import { WaitingConfirmationPage } from './waiting-confirmation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingConfirmationPageRoutingModule
  ],
  declarations: [WaitingConfirmationPage]
})
export class WaitingConfirmationPageModule {}
