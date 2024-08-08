import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { SnackbarService } from '../snackbarService/snackbar.service';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { GthAdminService } from './gth-admin.service';
import { ImoDialogComponent } from './imo-dialog/imo-dialog.component';
import { OrganizationDialogComponent } from './organization-dialog/organization-dialog.component';
import { SubscriptionDialogComponent } from './subscription-dialog/subscription-dialog.component';

export interface UserDataDto {
  id: number;
  wcn: string;
  AuthorizationId: string;
  displayName: string;
  email: string;
  userName: string;
  organizationId: number;
}

export interface OrganizationDto {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  subscription: number[];
}

export interface SubscriptionDto {
  id: number;
  name: string;
  description: string;
  costPerLicense: number;
  organizationId: number;
  applicationId: number;
  dateFrom: Date;
  dateTo: Date;
}

export interface ApplicationDto {
    id: number;
    name: string;
    description: string;
}

export interface IMODto {
  id: number;
  imo: number;
  deleted: Date | null;
}

@Component({
  standalone: true,
  selector: 'app-gth-admin',
  templateUrl: './gth-admin.component.html',
  styleUrls: ['./gth-admin.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatTableModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GthAdminComponent implements OnInit, AfterViewInit, AfterViewChecked {
  usersData: UserDataDto[] = [];
  organizationsData: OrganizationDto[] = [];
  subscriptionsData: SubscriptionDto[] = [];
  applicationsData: ApplicationDto[] = [];
  loading: boolean = true;
  displayedColumns: string[] = ['email', 'displayName', 'organization', 'subscriptions', 'isActive', 'action'];
  dataLoaded: boolean = false;

  constructor(
    private gthAdminService: GthAdminService,
    public dialog: MatDialog,
    private cdref: ChangeDetectorRef,
    private ngZone: NgZone,
    private snackbarService: SnackbarService,
  ) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loadData();
    });
  }

  ngAfterViewChecked() {
  }

  loadData() {
    this.gthAdminService.loadAllData().subscribe({
      next: (result) => {
        this.ngZone.run(() => {
          this.usersData = result.usersData;
          this.organizationsData = result.organizationsData;
          this.subscriptionsData = result.subscriptionsData;
          this.applicationsData = result.applicationsData;
          this.dataLoaded = true;
          setTimeout(() => {
            this.loading = false;
            this.cdref.detectChanges();
          }, 0);
        });
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.ngZone.run(() => {
          setTimeout(() => {
            this.loading = false;
            this.cdref.detectChanges();
          }, 0);
        });
      }
    });
  }

  showErrorMessage(message: string) {
    this.snackbarService.show('Failed to load data!: ' + message, 'Close', 3000);
  }

  getOrganizationNames(organizationIds: number[]): string {
    return organizationIds.map(id => this.organizationsData.find(org => org.id === id)?.name).filter(name => name).join(', ');
  }

  getSubscriptionNames(subscriptionIds: number[]): string {
    return subscriptionIds.map(id => this.subscriptionsData.find(sub => sub.id === id)?.name).filter(name => name).join(', ');
  }

  saveChanges(updatedUser: UserDataDto) {
    this.gthAdminService.updateUser(updatedUser).subscribe({
      next: (response) => {
        this.snackbarService.show('User updated', 'Close', 3000);
        this.loadData();
      },
      error: (error) => {
        console.error('Error updating user:', error);
      }
    });
  }

  confirmDelete(user: UserDataDto) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to delete this user?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteUser(user);
        this.snackbarService.show('User deleted', 'Close', 3000);
      }
    });
  }

  confirmUndelete(user: UserDataDto) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to restore this user?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.undeleteUser(user);
        this.snackbarService.show('User restored', 'Close', 3000);
      }
    });
  }

  deleteUser(user: UserDataDto) {
    const updatedUser = { ...user, isActive: false };
    this.gthAdminService.updateUser(updatedUser).subscribe({
      next: (response) => {
        this.loadData();
      },
      error: (error) => {
        console.error('Error deactivating user:', error);
      }
    });
  }

  undeleteUser(user: UserDataDto) {
    const updatedUser = { ...user, isActive: true };
    this.gthAdminService.updateUser(updatedUser).subscribe({
      next: (response) => {
        this.loadData();
      },
      error: (error) => {
        console.error('Error reactivating user:', error);
      }
    });
  }

  openOrganizationsDialog() {
    const dialogRef = this.dialog.open(OrganizationDialogComponent, {
      width: '80vw',
      height: '80vh',
      maxWidth: '80vw',
      maxHeight: '80vh',
      data: { organizations: this.organizationsData, subscriptions: this.subscriptionsData }
    });

    dialogRef.componentInstance.dataChanged.subscribe(() => {
      this.loadData();
    });

    dialogRef.afterClosed().subscribe((changedOrganizations: OrganizationDto[]) => {
      if (changedOrganizations && changedOrganizations.length > 0) {
        this.updateOrganizations(changedOrganizations);
      } else {
        this.loadData();
      }
    });
  }

  openSubscriptionsDialog() {
    const dialogRef = this.dialog.open(SubscriptionDialogComponent, {
      width: '80vw',
      height: '80vh',
      maxWidth: '80vw',
      maxHeight: '80vh',
      data: { subscriptions: this.subscriptionsData, organizations: this.organizationsData, applications: this.applicationsData }
    });
  
    dialogRef.componentInstance.dataChanged.subscribe(() => {
      this.loadData();
    });
  
    dialogRef.afterClosed().subscribe(() => {
      this.loadData();
    });
  }

  openImoDialog() {
    this.dialog.open(ImoDialogComponent, {
      width: '80vw',
      height: '80vh',
      maxWidth: '80vw',
      maxHeight: '80vh',
      data: { organizations: this.organizationsData }
    });
  }

  updateOrganizations(changedOrganizations: OrganizationDto[]) {
    this.gthAdminService.updateOrganizations(changedOrganizations).subscribe({
      next: (response) => {
        this.snackbarService.show('Organizations updated', 'Close', 3000);
        this.loadData();
      },
      error: (error) => {
        console.error('Error updating organizations:', error);
      }
    });
  }

  updateSubscriptions(changedSubscriptions: SubscriptionDto[]) {
    this.gthAdminService.updateSubscriptions(changedSubscriptions).subscribe({
      next: (response) => {
        this.snackbarService.show('Subscriptions updated', 'Close', 3000);
        this.loadData();
      },
      error: (error) => {
        console.error('Error updating subscriptions:', error);
      }
    });
  }
}
