import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer>
      <p>&copy; 2024 Your Company. All rights reserved.</p>
    </footer>
  `,
  styles: [
    `
      footer {
        text-align: center;
        padding: 10px;
        background-color: #f8f9fa;
        position: fixed;
        width: 100%;
        bottom: 0;
        left: 0;
        z-index: 1000;
      }
    `
  ]
})
export class FooterComponent {}
