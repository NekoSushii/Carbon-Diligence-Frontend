import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ]
})
export class LoadingScreenComponent {
  @Input() isLoading: boolean = false;
}
