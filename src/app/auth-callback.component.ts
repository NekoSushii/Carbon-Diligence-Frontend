import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.css']
})
export class AuthCallbackComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

  async ngOnInit() {
    await this.authService.completeAuthentication();
    await this.sendTokenToBackend();
    this.router.navigate(['/home']);
  }

  async sendTokenToBackend() {
    const token = this.authService.getAccessToken();

    if (token) {
      const key = Utf8.parse("CarbonDiligenceCarbonDiligence32");
      const iv = Utf8.parse("1234567890123456");
      const message = token.toString();
      const encryptedToken = AES.encrypt(message, key, {iv: iv}).toString();

      try {
        const quotedToken = `"${encryptedToken}"`;
        const headers = { 'Content-Type': 'application/json' };
        const response: any = await lastValueFrom(this.http.post('http://localhost:5076/api/Login/Authenticate', quotedToken, { headers }));

        if (response) {
            sessionStorage.setItem('jwtToken', response.jwtToken);
        } else {
            console.error('Invalid response received from the server.');
        }
    } catch (error) {
        console.error('Error sending token to backend:', error);
    }

    } else {
      console.error('Token is null. Unable to send token to backend.');
    }
  }
}
