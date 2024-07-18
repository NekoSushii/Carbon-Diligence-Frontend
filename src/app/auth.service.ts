import { Injectable } from '@angular/core';
import { UserManager, User } from 'oidc-client-ts';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userManager: UserManager;
  private user: User | null = null;

  constructor(private router: Router) {
    const settings = {
      authority: 'https://carbondiligence.b2clogin.com/carbondiligence.onmicrosoft.com/B2C_1_testsignup1',
      client_id: '96b911e9-4b5e-4aa1-9d4e-2cd48258bf95',
      redirect_uri: 'http://localhost:4200/auth-callback',
      post_logout_redirect_uri: 'http://localhost:4200/login',
      response_type: 'code',
      scope: 'openid ',
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
    // this.router.navigate(['/home']);
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
