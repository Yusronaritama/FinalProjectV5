import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// TAMBAHKAN INI untuk mengenali komponen <ion-content>, dll.
import { IonicModule } from '@ionic/angular';

import { FaqPageRoutingModule } from './faq-routing.module';

// PERBAIKI INI: Gunakan 'FaqPage' bukan 'FAQPage'
import { FaqPage } from './faq.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, // PASTIKAN INI ADA DI DALAM IMPORTS
    FaqPageRoutingModule
  ],
  // PERBAIKI INI: Gunakan 'FaqPage' bukan 'FAQPage'
  declarations: [FaqPage]
})
export class FaqPageModule {}