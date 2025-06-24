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
    path: 'activity',
    loadChildren: () => import('./activity/activity.module').then( m => m.ActivityPageModule)
  },
  {
    path: 'car-list/:brand',
    loadChildren: () => import('./car-list/car-list.module').then( m => m.CarListPageModule)
  },
  {
    // Rute ini sudah benar, hanya menggunakan ID mobil
    path: 'car-detail/:id',
    loadChildren: () => import('./car-detail/car-detail.module').then( m => m.CarDetailPageModule)
  },
  {
    path: 'rental-detail/:id',
    loadChildren: () => import('./rental-detail/rental-detail.module').then( m => m.RentalDetailPageModule)
  },
  {
    path: 'rental-custom/:id',
    loadChildren: () => import('./rental-custom/rental-custom.module').then( m => m.RentalCustomPageModule)
  },
  {
    // --- INI PERBAIKANNYA ---
    // Hapus parameter dari path, karena data dikirim via state
    path: 'payment-method', 
    loadChildren: () => import('./payment-method/payment-method.module').then( m => m.PaymentMethodPageModule)
  },
  {
    path: 'waiting-confirmation',
    loadChildren: () => import('./waiting-confirmation/waiting-confirmation.module').then( m => m.WaitingConfirmationPageModule)
  },
  {
    path: 'receipt',
    loadChildren: () => import('./receipt/receipt.module').then( m => m.ReceiptPageModule)
  },
  {
    path: 'transaction-success',
    loadChildren: () => import('./transaction-success/transaction-success.module').then( m => m.TransactionSuccessPageModule)
  },
  {
    path: 'faq',
    loadChildren: () => import('./faq/faq.module').then( m => m.FaqPageModule)
  },

  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }