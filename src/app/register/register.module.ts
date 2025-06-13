import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Penting untuk [(ngModel)]

import { IonicModule } from '@ionic/angular';

// Memperbaiki import path dan nama class agar sesuai dengan 'registrasi'
import { RegisterPageRoutingModule } from './register-routing.module';

// Memperbaiki import class komponen agar sesuai dengan 'registrasi'
import { RegisterPage } from './register.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, // Pastikan ini diimpor untuk [(ngModel)]
    IonicModule,
    RegisterPageRoutingModule // Menggunakan nama class routing module yang benar
  ],
  declarations: [RegisterPage] // Deklarasikan komponen di sini
})
// Memperbaiki nama class module agar sesuai dengan 'registrasi'
export class RegisterPageModule {}
