import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from '../loading-screen/loading.service';
import { AuthCallbackService } from './auth-callback.service';
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
    private loadingService: LoadingService,
    private authCallbackService: AuthCallbackService,
  ) {}

  async ngOnInit() {
    await this.authService.completeAuthentication();
    const token = this.authService.getAccessToken();

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadingService.show();
    await this.processToken(token);
    this.router.navigate(['/home']);
    this.loadingService.hide();
  }

  async processToken(token: string) {
    try {
      const user = await this.authCallbackService.sendTokenToBackend(token);
      sessionStorage.setItem('user', JSON.stringify(user));
      this.user = user;
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  }
}
