import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// PERBAIKI INI: Gunakan 'FaqPage' bukan 'FAQPage'
import { FaqPage } from './faq.page';

const routes: Routes = [
  {
    path: '',
    // PERBAIKI INI: Gunakan 'FaqPage' bukan 'FAQPage'
    component: FaqPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FaqPageRoutingModule {}