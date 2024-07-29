// src/app/auth-callback.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { LoadingService } from '../loading/loading.service';
import { CommonModule } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import * as AES from 'crypto-js/aes';
import * as Utf8 from 'crypto-js/enc-utf8';

@Component({
  // standalone: true,
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  // imports: [CommonModule],
})
export class AuthCallbackComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  async ngOnInit() {
    await this.authService.completeAuthentication();
    const token = this.authService.getAccessToken();

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadingService.show();
    await this.sendTokenToBackend();
    this.router.navigate(['/home']);
    this.loadingService.hide();
  }

  async sendTokenToBackend() {
    const token = this.authService.getAccessToken();

    if (token) {
      const key = Utf8.parse("CarbonDiligenceCarbonDiligence32");
      const iv = Utf8.parse("1234567890123456");
      const message = token.toString();
      const encryptedToken = AES.encrypt(message, key, { iv: iv }).toString();

      try {
        const quotedToken = `"${encryptedToken}"`;
        const headers = { 'Content-Type': 'application/json' };
        const response: any = await lastValueFrom(this.http.post('http://localhost:5206/api/Login/Authenticate', quotedToken, { headers }));

        if (response) {
          sessionStorage.setItem('jwtToken', response.jwtToken);
        } else {
          console.error('Invalid response received from the server.');
        }
      } catch (error) {
        console.error('Error sending token to backend:', error);
      } finally {
      }

    } else {
      console.error('Token is null. Unable to send token to backend.');
    }
  }
}
