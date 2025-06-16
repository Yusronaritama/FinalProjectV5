import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Periksa apakah ada email pengguna yang tersimpan di localStorage
    const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');

    if (loggedInUserEmail) {
      // Pengguna sudah login, izinkan akses ke rute
      console.log('AuthGuard: User is logged in. Access granted.');
      return true;
    } else {
      // Pengguna belum login, arahkan ke halaman login
      console.log('AuthGuard: User is NOT logged in. Redirecting to login page.');
      // Simpan URL yang ingin diakses pengguna, agar bisa kembali setelah login (opsional)
      // return this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
      return this.router.parseUrl('/login'); // Langsung arahkan ke halaman login
    }
  }
}
