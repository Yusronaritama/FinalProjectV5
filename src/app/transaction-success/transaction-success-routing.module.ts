import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransactionSuccessPage } from './transaction-success.page';

const routes: Routes = [
  {
    path: '',
    component: TransactionSuccessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionSuccessPageRoutingModule {}
