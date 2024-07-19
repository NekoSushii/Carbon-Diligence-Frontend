import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { LayoutService } from './layout.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  template: `
    <app-header *ngIf="showHeader$ | async"></app-header>
    <main class="content">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        height: 100vh;
        overflow: hidden; /* Ensure no overflow */
      }
      main.content {
        flex: 1;
        overflow: auto; /* Allow content to scroll if necessary */
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center; /* Center content vertically */
        align-items: center; /* Center content horizontally */
      }
    `
  ]
})
export class AppComponent implements OnInit {
  title = 'my-angular-app';
  showHeader$: Observable<boolean>;

  constructor(private layoutService: LayoutService) {
    this.showHeader$ = this.layoutService.showHeader$;
  }

  ngOnInit() {
    // Any additional initialization logic can go here
  }
}
