import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RentalCustomPage } from './rental-custom.page';

const routes: Routes = [
  {
    path: '',
    component: RentalCustomPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RentalCustomPageRoutingModule {}
