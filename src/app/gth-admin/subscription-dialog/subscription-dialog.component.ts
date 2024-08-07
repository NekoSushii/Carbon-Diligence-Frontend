import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { isEqual } from 'lodash';
import { SnackbarService } from '../../snackbarService/snackbar.service';
import { CreateSubscriptionDialogComponent } from '../create-subscription-dialog/create-subscription-dialog.component';
import { ApplicationDto, OrganizationDto, SubscriptionDto } from '../gth-admin.component';
import { GthAdminService } from '../gth-admin.service';

@Component({
  selector: 'app-subscription-dialog',
  templateUrl: './subscription-dialog.component.html',
  styleUrls: ['./subscription-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatButtonModule,
    MatCheckboxModule,
    CreateSubscriptionDialogComponent,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class SubscriptionDialogComponent {
  @Output() dataChanged = new EventEmitter<void>();

  displayedColumns: string[] = ['name', 'description', 'costPerLicense', 'organizationId', 'applicationId', 'dateFrom', 'dateTo', 'isActive'];
  subscriptions: SubscriptionDto[] = [];
  originalSubscriptions: SubscriptionDto[];
  organizations: OrganizationDto[] = [];
  applications: ApplicationDto[] = [];

  constructor(
    public dialogRef: MatDialogRef<SubscriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { subscriptions: SubscriptionDto[], organizations: OrganizationDto[], applications: ApplicationDto[] },
    public dialog: MatDialog,
    private gthAdminService: GthAdminService,
    private cdr: ChangeDetectorRef,
    private snackbarService: SnackbarService
  ) {
    this.subscriptions = JSON.parse(JSON.stringify(data.subscriptions));
    this.originalSubscriptions = JSON.parse(JSON.stringify(data.subscriptions));
    this.organizations = data.organizations;
    this.applications = data.applications;
  }

  isWithinDateRange(dateFrom: Date, dateTo: Date): boolean {
    const currentDate = new Date();
    return currentDate >= new Date(dateFrom) && currentDate <= new Date(dateTo);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  saveChanges(): void {
    const changedSubscriptions = this.subscriptions.filter((subscription, index) => {
      return !isEqual(subscription, this.originalSubscriptions[index]);
    });

    if (changedSubscriptions.length > 0) {
      this.gthAdminService.updateSubscriptions(changedSubscriptions).subscribe({
        next: () => {
          this.refreshData();
          this.dataChanged.emit();
          this.snackbarService.show('Subscription updated!', 'Close', 3000);
        },
        error: (error) => {
          console.error('Error updating subscriptions:', error);
        }
      });
    } else {
      this.refreshData();
    }
  }

  createSubscription(): void {
    const dialogRef = this.dialog.open(CreateSubscriptionDialogComponent, {
      width: '400px',
      data: {
        title: 'Create New Subscription',
        name: '',
        description: '',
        costPerLicense: 0,
        organizationId: null,
        applicationId: null,
        dateFrom: null,
        dateTo: null,
        organizations: this.organizations,
        applications: this.applications
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newSubscription: SubscriptionDto = {
          id: 0,
          name: result.name,
          description: result.description,
          costPerLicense: result.costPerLicense,
          organizationId: result.organizationId,
          applicationId: result.applicationId,
          dateFrom: result.dateFrom,
          dateTo: result.dateTo
        };

        this.gthAdminService.createSubscription(newSubscription).subscribe({
          next: (response) => {
            newSubscription.id = response.id;
            this.subscriptions.push(newSubscription);
            this.refreshData();
            this.dataChanged.emit();
            this.snackbarService.show('Subscription created!', 'Close', 3000);
          },
          error: (error) => {
            console.error('Error creating subscription:', error);
          }
        });
      }
    });
  }

  deleteSubscription(subscription: SubscriptionDto): void {
    if (confirm(`Are you sure you want to delete the subscription ${subscription.name}?`)) {
      const updatedSubscription = { ...subscription, isActive: false };
      this.gthAdminService.updateSubscription(updatedSubscription.id, updatedSubscription).subscribe({
        next: () => {
          this.refreshData();
          this.dataChanged.emit();
          this.snackbarService.show('Subscription deleted!', 'Close', 3000);
        },
        error: (error) => {
          console.error('Error deleting subscription:', error);
        }
      });
    }
  }

  undeleteSubscription(subscription: SubscriptionDto): void {
    if (confirm(`Are you sure you want to restore the subscription ${subscription.name}?`)) {
      const updatedSubscription = { ...subscription, isActive: true };
      this.gthAdminService.updateSubscription(updatedSubscription.id, updatedSubscription).subscribe({
        next: () => {
          this.refreshData();
          this.dataChanged.emit();
          this.snackbarService.show('Subscription restored!', 'Close', 3000);
        },
        error: (error) => {
          console.error('Error restoring subscription:', error);
        }
      });
    }
  }

  private refreshData(): void {
    this.originalSubscriptions = JSON.parse(JSON.stringify(this.subscriptions));
    this.cdr.detectChanges();
  }
}
