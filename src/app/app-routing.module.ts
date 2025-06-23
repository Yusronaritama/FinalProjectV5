import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'loading-screen',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'loading-screen',
    loadChildren: () => import('./loading-screen/loading-screen.module').then( m => m.LoadingScreenPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./change-password/change-password.module').then( m => m.ChangePasswordPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'qna',
    loadChildren: () => import('./qna/qna.module').then( m => m.QnaPageModule)
  },
  {
    path: 'activity',
    loadChildren: () => import('./activity/activity.module').then( m => m.ActivityPageModule)
  },
  // --- TAMBAHKAN RUTE BARU DI SINI ---
  {
    path: 'car-list/:brand', // 
    loadChildren: () => import('./car-list/car-list.module').then( m => m.CarListPageModule)
  },
  {
    path: 'car-detail/:brand/:carId', // 
    loadChildren: () => import('./car-detail/car-detail.module').then( m => m.CarDetailPageModule)
  },
  {
    path: 'rental-detail/:id',  // 
    loadChildren: () => import('./rental-detail/rental-detail.module').then( m => m.RentalDetailPageModule)
  },
  {
    path: 'rental-custom/:id', // 
    loadChildren: () => import('./rental-custom/rental-custom.module').then( m => m.RentalCustomPageModule)
  },
  {
     path: 'payment-method/:brand/:carId', // <-- UBAH PATH
    loadChildren: () => import('./payment-method/payment-method.module').then( m => m.PaymentMethodPageModule)
  },
  {
    path: 'payment-instruction',
    loadChildren: () => import('./payment-instruction/payment-instruction.module').then( m => m.PaymentInstructionPageModule)
  },
  {
    path: 'car-list/:brand',
    loadChildren: () => import('./car-list/car-list.module').then( m => m.CarListPageModule)
  },
  {
    // PERUBAHAN: Sederhanakan rute ini, kita hanya butuh ID mobil
    path: 'car-detail/:id',
    loadChildren: () => import('./car-detail/car-detail.module').then( m => m.CarDetailPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }