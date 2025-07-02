// GANTI SELURUH ISI FILE DENGAN KODE INI

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('auth_token');
    const isApiUrl = request.url.startsWith(environment.apiUrl);

    // Hanya tambahkan token jika ada token tersimpan DAN request-nya ke API kita
    if (token && isApiUrl) {
      // Clone request-nya dan tambahkan header Authorization
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Teruskan request yang sudah dimodifikasi (atau yang asli jika tidak ada token)
    return next.handle(request);
  }
}