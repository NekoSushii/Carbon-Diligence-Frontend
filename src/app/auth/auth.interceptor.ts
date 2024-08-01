import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const accessToken = this.authService.getAccessToken();
    // if (accessToken) {
    //   request = request.clone({
    //     setHeaders: {
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   });
    // }

    return next.handle(request);
  }
}
