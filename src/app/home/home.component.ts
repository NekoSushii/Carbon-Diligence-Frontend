import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ApplicationDto, OrganizationDto, SubscriptionDto, UserDataDto } from '../gth-admin/gth-admin.component';
import { GthAdminService } from '../gth-admin/gth-admin.service';
import { LoadingService } from '../loading-screen/loading.service';
import { SnackbarService } from '../snackbarService/snackbar.service';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatGridListModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, AfterViewChecked {
  userData!: UserDataDto;
  organizationsData: OrganizationDto[] = [];
  subscriptionsData: SubscriptionDto[] = [];
  applicationsData: ApplicationDto[] = [];
  loading: boolean = true;
  dataLoaded: boolean = false;

  rowHeight: string = '200px';
  cardSize: string = '200px';
  fontSize: string = '1rem';

  cards$!: Observable<any[]>;

  constructor(
    private homeService: HomeService,
    private gthAdminService: GthAdminService,
    private ngZone: NgZone, private cdref: ChangeDetectorRef,
    private snackbarService: SnackbarService,
    private loadingService: LoadingService,
    private router: Router) { }

  ngOnInit() {
    this.loadUserData();
  }

  ngAfterViewInit() {
    this.cdref.detectChanges();
  }

  ngAfterViewChecked() {}

  async loadUserData() {
    try {
      const data = await this.homeService.getUsersData().toPromise();
      this.ngZone.run(() => {
        if (data) {
          this.userData = data;
          this.loadData();
        } else {
          console.error('No user data available');
          this.loading = false;
        }
      });
    } catch (error) {
      console.error('Error loading user data:', error);
      this.loading = false;
    }
  }

  async loadData() {
    try {
      const result = await this.gthAdminService.loadAllData().toPromise();
      if (result) {
        this.ngZone.run(() => {
          this.organizationsData = result.organizationsData || [];
          this.subscriptionsData = result.subscriptionsData || [];
          this.applicationsData = result.applicationsData || [];
          this.dataLoaded = true;
          this.loading = false;
          this.cdref.detectChanges();
          this.loadCards();
        });
      } else {
        console.error('Result is undefined');
        this.loading = false;
      }
    } catch (error) {
      console.error('Error loading data:', error);
      this.ngZone.run(() => {
        this.loading = false;
        this.cdref.detectChanges();
      });
    }
  }

  async loadCards() {
    try {
      const cards = await this.getCards().toPromise();
      this.cards$ = of(cards || []);
      this.cdref.detectChanges();
    } catch (error) {
      console.error('Error loading cards:', error);
      this.cards$ = of([]);
      this.cdref.detectChanges();
    }
  }

  getCards(): Observable<any[]> {
    if (!this.userData || !this.userData.organizationId) {
      return of([]);
    }
  
    const userOrg = this.organizationsData.find(org => org.id === this.userData.organizationId);
    if (!userOrg) {
      console.error('No organization found for user');
      return of([]);
    }
  
    const currentDate = new Date();
    const userSubscriptions = this.subscriptionsData.filter(sub => sub.organizationId === this.userData.organizationId);
    const userApplicationIds = userSubscriptions.map(sub => sub.applicationId);
  
    const cards = this.applicationsData.map(app => {
      const subscription = userSubscriptions.find(sub => sub.applicationId === app.id);
      let buttonStatus = 'Subscribe';
  
      if (subscription) {
        if (currentDate >= new Date(subscription.dateFrom) && currentDate <= new Date(subscription.dateTo)) {
          buttonStatus = 'Enter';
        } else {
          buttonStatus = 'Subscription Ended';
        }
      }
  
      return {
        id: app.id,
        title: app.name,
        content: app.description,
        button: buttonStatus
      };
    });
  
    return of(cards);
  }

  onCardButtonClick(card: any) {
    if (card.button === 'Enter' && card.id === 1) {
      this.router.navigate(['/CDP']);
    } else {
    }
  }
}
