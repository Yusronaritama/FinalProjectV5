import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarDetailPageModule } from './car-detail.module';
import { CarDetailPage } from './car-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CarDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarDetailPageRoutingModule {}
