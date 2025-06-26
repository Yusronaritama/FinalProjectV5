// ===================================================================
// INI ADALAH PERBAIKAN PALING PENTING
// ===================================================================

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // 1. Impor ReactiveFormsModule

import { IonicModule } from '@ionic/angular';

import { ChangePasswordPageRoutingModule } from './change-password-routing.module';

import { ChangePasswordPage } from './change-password.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangePasswordPageRoutingModule,
    ReactiveFormsModule // 2. Tambahkan di sini
  ],
  declarations: [ChangePasswordPage]
})
export class ChangePasswordPageModule {}