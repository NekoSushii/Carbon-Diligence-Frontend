import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatGridListModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  rowHeight: string = '200px';
  cardSize: string = '200px';
  fontSize: string = '1rem';

  cards$!: Observable<any[]>;

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.cards$ = this.homeService.getApplications().pipe(
      map(applications => applications.map(app => ({
        title: app.name,
        content: app.description,
        button: 'Subscribe'
      })))
    );
  }
}
