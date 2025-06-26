import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarRandomListPage } from './car-random-list.page';

const routes: Routes = [
  {
    path: '',
    component: CarRandomListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarRandomListPageRoutingModule {}
