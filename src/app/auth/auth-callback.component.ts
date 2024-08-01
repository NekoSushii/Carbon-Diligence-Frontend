import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as AES from 'crypto-js/aes';
import * as Utf8 from 'crypto-js/enc-utf8';
import { lastValueFrom } from 'rxjs';
import { LoadingService } from '../loading-screen/loading.service';
import { AuthService } from './auth.service';

@Component({
  standalone: true,
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  imports: [CommonModule],
})
export class AuthCallbackComponent implements OnInit {
  user: any = null;
  loading: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private loadingService: LoadingService,
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
        const response: any = await lastValueFrom(this.http.post('http://localhost:5206/api/Login/Authenticate', quotedToken, { headers, withCredentials: true }));

        if (response) {
          const user = {
            name: response.name,
            email: response.email,
            roles: response.roles,
            userGroups: response.userGroups
          };

          sessionStorage.setItem('user', JSON.stringify(user));
          this.user = user;
        } else {
          console.error('Invalid response received from the server.');
        }
      } catch (error) {
        console.error('Error sending token to backend:', error);
      } finally {
        this.loading = false;
      }
    } else {
      console.error('Token is null. Unable to send token to backend.');
      this.loading = false;
    }
  }
}
