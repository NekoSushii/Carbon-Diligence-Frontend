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
    <div class="content">
      <router-outlet></router-outlet>
    </div>
    <app-footer></app-footer>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        padding-top: 60px; /* Adjust for header height */
        padding-bottom: 40px; /* Adjust for footer height */
      }
      .content {
        flex: 1;
        padding: 20px;
      }
      router-outlet {
        display: block;
        margin: 0 auto;
        max-width: 1200px;
      }
    `
  ]
})
export class AppComponent implements OnInit {
  title = 'Carbon Diligence';
  showHeader$: Observable<boolean>;

  constructor(private layoutService: LayoutService) {
    this.showHeader$ = this.layoutService.showHeader$;
  }

  ngOnInit() {

  }
}
