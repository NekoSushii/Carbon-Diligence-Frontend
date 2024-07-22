import { Component, OnInit } from '@angular/core';
import { LoadingService } from './loading.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loading',
  template: `
    <div class="loading-overlay" *ngIf="loading$ | async">
      <mat-spinner></mat-spinner>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
  `]
})
export class LoadingComponent implements OnInit {
  loading$: Observable<boolean> | undefined;

  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    this.loading$ = this.loadingService.loading$;
  }
}
