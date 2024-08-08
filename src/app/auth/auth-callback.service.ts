import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as AES from 'crypto-js/aes';
import * as Utf8 from 'crypto-js/enc-utf8';
import { lastValueFrom } from 'rxjs';
import { SnackbarService } from '../snackbarService/snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class AuthCallbackService {
  constructor(private http: HttpClient, private snackBarService: SnackbarService) {}

  async sendTokenToBackend(token: string): Promise<any> {
    const key = Utf8.parse('CarbonDiligenceCarbonDiligence32');
    const iv = Utf8.parse('1234567890123456');
    const message = token.toString();
    const encryptedToken = AES.encrypt(message, key, { iv: iv }).toString();

    try {
      const quotedToken = `"${encryptedToken}"`;
      const headers = { 'Content-Type': 'application/json' };
      const response: any = await lastValueFrom(
        this.http.post('http://localhost:5206/api/Login/Authenticate', quotedToken, { headers, withCredentials: true })
      );

      if (response && response.isNewUser === false) {
        return {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          roles: response.user.roles,
          userGroups: response.user.userGroups,
        };
      } else {
        this.snackBarService.show("No user found!", 'close', 3000);
        throw new Error('Invalid response received from the server.');
      }
    } catch (error) {
      throw new Error(`Error sending token to backend: ${error}`);
    }
  }
}
