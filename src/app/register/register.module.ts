import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // PENTING: Pastikan ini diimpor!
import { IonicModule } from '@ionic/angular'; // PENTING: Pastikan ini diimpor!
import { RegisterPageRoutingModule } from './register-routing.module';
import { RegisterPage } from './register.page'; // PENTING: Pastikan ini mengimpor RegisterPage

@NgModule({
  imports: [
    CommonModule,
    FormsModule, // Harus ada di sini untuk [(ngModel)]
    IonicModule, // Harus ada di sini untuk komponen Ionic
    RegisterPageRoutingModule
  ],
  declarations: [RegisterPage] // PENTING: Deklarasikan RegisterPage
})
export class RegisterPageModule {}
