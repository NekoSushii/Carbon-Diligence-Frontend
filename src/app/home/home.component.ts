import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterModule } from '@angular/router';
import { HomeService } from './home.service'; // Adjust the path as necessary

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

  cards: any[] = [];

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.homeService.getApplications().subscribe(applications => {
      console.log(applications);
      this.cards = applications.map(app => ({
        title: app.name,
        content: app.description,
        button: 'Subscribe'
      }));
    });

    
  }

  //add in call to check organisation 
}

// cards = [
//   { title: 'CDP', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.', button: 'Visit' },
//   { title: 'Carbon Wallet', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.', button: 'Subscribe' },
//   { title: 'DCS Verification', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.', button: 'Subscribe' },
//   { title: 'Energy Atlas', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.', button: 'Subscribe' },
//   { title: 'CDP', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.', button: 'Subscribe' },
//   { title: 'CDP', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.', button: 'Subscribe' },
//   { title: 'CDP', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.', button: 'Subscribe' },
//   { title: 'CDP', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.', button: 'Subscribe' },
//   { title: 'CDP', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.', button: 'Subscribe' },
// ];