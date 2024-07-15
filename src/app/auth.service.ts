import { Injectable } from '@angular/core';
import { UserManager, User } from 'oidc-client-ts';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userManager: UserManager;
  private user: User | null = null;

  constructor() {
    const settings = {
      authority: 'https://ABSAuthPROD.b2clogin.com/ABSAuthPROD.onmicrosoft.com/B2C_1A_ABS_SIGNUP_SIGNIN',
      client_id: 'e08c618f-e7a1-4956-8101-a500e199f32e',
      redirect_uri: 'http://localhost:4200/auth-callback',
      post_logout_redirect_uri: 'http://localhost:4200',
      response_type: 'code',
      scope: 'openid profile your-api-scope',
    };
    this.userManager = new UserManager(settings);
    this.userManager.getUser().then(user => {
      this.user = user;
    });
  }

  login() {
    this.userManager.signinRedirect();
  }

  async completeAuthentication() {
    this.user = await this.userManager.signinRedirectCallback();
  }

  logout() {
    this.userManager.signoutRedirect();
  }

  getUser() {
    return this.user;
  }

  getAccessToken() {
    return this.user ? this.user.access_token : null;
  }
}
