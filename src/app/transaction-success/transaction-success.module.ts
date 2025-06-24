import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransactionSuccessPageRoutingModule } from './transaction-success-routing.module';

import { TransactionSuccessPage } from './transaction-success.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransactionSuccessPageRoutingModule
  ],
  declarations: [TransactionSuccessPage]
})
export class TransactionSuccessPageModule {}
