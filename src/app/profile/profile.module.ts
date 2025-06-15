import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
// ChangePasswordPage tidak lagi dideklarasikan di sini karena akan dinavigasi sebagai halaman
// import { ChangePasswordPage } from '../change-password/change-password.page'; 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule
  ],
  declarations: [
    ProfilePage,
    // ChangePasswordPage tidak lagi dideklarasikan di sini
    // ChangePasswordPage 
  ]
})
export class ProfilePageModule {}
