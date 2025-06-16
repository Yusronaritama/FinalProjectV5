import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // PENTING: Import AuthGuard Anda

const routes: Routes = [
  {
    path: '',
    redirectTo: 'loading-screen',
    pathMatch: 'full'
  },
  {
    path: 'loading-screen',
    loadChildren: () => import('./loading-screen/loading-screen.module').then(m => m.LoadingScreenPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'home',
    // Halaman home tidak dilindungi karena Anda ingin ini menjadi halaman utama yang bisa dilihat tanpa login
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'profile',
    // TERAPKAN AuthGuard di sini
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule),
    canActivate: [AuthGuard] // Gunakan AuthGuard untuk melindungi rute ini
  },
  {
    path: 'change-password',
    // Halaman ganti password juga perlu dilindungi
    loadChildren: () => import('./change-password/change-password.module').then(m => m.ChangePasswordPageModule),
    canActivate: [AuthGuard] // Gunakan AuthGuard untuk melindungi rute ini
  }
  // Tambahkan rute lain yang memerlukan login di sini dengan canActivate: [AuthGuard]
  // Contoh:
  // {
  //   path: 'pemesanan',
  //   loadChildren: () => import('./pemesanan/pemesanan.module').then(m => m.PemesananPageModule),
  //   canActivate: [AuthGuard]
  // }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
