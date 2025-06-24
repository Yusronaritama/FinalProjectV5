import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WaitingConfirmationPage } from './waiting-confirmation.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingConfirmationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitingConfirmationPageRoutingModule {}
