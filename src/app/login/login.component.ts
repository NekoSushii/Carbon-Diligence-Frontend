import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  errorOccurred: boolean = false;

  constructor(private authService: AuthService, private http: HttpClient) {}

  async login() {
    try {
      const jwtToken = await this.http.post<any>('backend/session', {}).toPromise();

      if (jwtToken && jwtToken.access_token) {
        sessionStorage.setItem('jwtToken', jwtToken);
        this.authService.login();
      } else {
        this.errorOccurred = true;
      }
    } catch (error) {
      console.error('Error creating session:', error);
      this.errorOccurred = true;
    }
  }
}
