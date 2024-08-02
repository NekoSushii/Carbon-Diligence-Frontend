import { CommonModule } from '@angular/common';
import { Component, OnInit, NgZone, ChangeDetectorRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HomeService } from './home.service';
import { GthAdminService } from '../gth-admin/gth-admin.service';
import { ApplicationDto, OrganizationDto, SubscriptionDto, UserDataDto } from '../gth-admin/gth-admin.component';
import { SnackbarService } from '../snackbarService/snackbar.service';
import { LoadingService } from '../loading-screen/loading.service';

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
    private loadingService: LoadingService) {  }

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
      console.log('User data:', data);
      this.ngZone.run(() => {
        if (data) {
          this.userData = data; // Single user data object
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
      console.log('Loaded data:', result);
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

    const userSubscriptions = this.subscriptionsData.filter(sub => sub.organizationId === this.userData.organizationId);
    const userApplicationIds = userSubscriptions.map(sub => sub.applicationId);
    console.log('User application IDs:', userApplicationIds);

    const cards = this.applicationsData.map(app => ({
      title: app.name,
      content: app.description,
      button: userApplicationIds.includes(app.id) ? 'Enter' : 'Subscribe'
    }));

    return of(cards);
  }
}
