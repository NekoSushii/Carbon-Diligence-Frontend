import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav>
      <a routerLink="/admin">Admin</a>
      <button (click)="logout()">Logout</button>
    </nav>
  `,
  styles: [
    `
      nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #f8f9fa;
        padding: 10px 20px;
        position: fixed;
        width: 100%;
        top: 0;
        left: 0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        z-index: 1000; /* Ensure header stays on top */
      }
      a {
        margin-right: 15px;
        text-decoration: none;
        color: #007bff;
      }
      button {
        cursor: pointer;
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
      }
    `
  ]
})
export class HeaderComponent {
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
