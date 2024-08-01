import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as AES from 'crypto-js/aes';
import * as Utf8 from 'crypto-js/enc-utf8';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthCallbackService {
  constructor(private http: HttpClient) {}

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

      if (response) {
        return {
          name: response.name,
          email: response.email,
          roles: response.roles,
          userGroups: response.userGroups,
        };
      } else {
        throw new Error('Invalid response received from the server.');
      }
    } catch (error) {
      throw new Error(`Error sending token to backend: ${error}`);
    }
  }
}
