import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { isEqual } from 'lodash';
import { SnackbarService } from '../../snackbarService/snackbar.service';
import { OrganizationDto, SubscriptionDto } from '../gth-admin.component';
import { GthAdminService } from '../gth-admin.service';

@Component({
  selector: 'app-organization-dialog',
  templateUrl: './organization-dialog.component.html',
  styleUrls: ['./organization-dialog.component.css'],
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
    MatIconModule
  ]
})
export class OrganizationDialogComponent {
  @Output() dataChanged = new EventEmitter<void>();

  displayedColumns: string[] = ['name', 'description', 'isActive', 'subscription', 'actions'];
  organizations: OrganizationDto[] = [];
  originalOrganizations: OrganizationDto[] = [];
  creatingOrganization = false;
  newOrganization: OrganizationDto = {
    id: 0,
    name: '',
    description: '',
    isActive: true,
    subscription: []
  };

  constructor(
    public dialogRef: MatDialogRef<OrganizationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { organizations: OrganizationDto[], subscriptions: SubscriptionDto[] },
    public dialog: MatDialog,
    private gthAdminService: GthAdminService,
    private cdr: ChangeDetectorRef,
    private snackbarService: SnackbarService
  ) {
    this.refreshData();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  saveChanges(): void {
    const changedOrganizations = this.organizations.filter((organization, index) => {
      return !isEqual(organization, this.originalOrganizations[index]);
    });

    if (changedOrganizations.length > 0) {
      this.gthAdminService.updateOrganizations(changedOrganizations).subscribe({
        next: () => {
          this.snackbarService.show('Organization updated!', 'Close', 3000);
          this.refreshData();
          this.dataChanged.emit();
        },
        error: (error) => {
          console.error('Error updating organizations:', error);
        }
      });
    } else {
      this.refreshData();
    }
  }

  createOrganization(): void {
    this.creatingOrganization = true;
  }

  saveNewOrganization(): void {
    if (!this.newOrganization.name.trim()) {
      this.snackbarService.show('Please provide a name for the organization.', 'Close', 3000);
      return;
    }

    this.gthAdminService.createOrganization(this.newOrganization).subscribe({
      next: (response) => {
        this.newOrganization.id = response.id;
        this.snackbarService.show('Organization created!', 'Close', 3000);
        this.creatingOrganization = false;
        this.refreshData();
        this.dataChanged.emit();
      },
      error: (error) => {
        console.error('Error creating organization:', error);
      }
    });
  }

  cancelCreate(): void {
    this.creatingOrganization = false;
  }

  deleteOrganization(organization: OrganizationDto): void {
    if (confirm(`Are you sure you want to delete the organization ${organization.name}?`)) {
      const updatedOrganization = { ...organization, isActive: false };
      this.gthAdminService.deleteOrganization(updatedOrganization.id).subscribe({
        next: () => {
          this.snackbarService.show('Organization deleted!', 'Close', 3000);
          this.refreshData();
          this.dataChanged.emit();
        },
        error: (error) => {
          console.error('Error deleting organization:', error);
        }
      });
    }
  }

  undeleteOrganization(organization: OrganizationDto): void {
    if (confirm(`Are you sure you want to restore the organization ${organization.name}?`)) {
      const updatedOrganization = { ...organization, isActive: true };
      this.gthAdminService.updateOrganization(updatedOrganization.id, updatedOrganization).subscribe({
        next: () => {
          this.snackbarService.show('Organization restored!', 'Close', 3000);
          this.refreshData();
          this.dataChanged.emit();
        },
        error: (error) => {
          console.error('Error restoring organization:', error);
        }
      });
    }
  }

  private refreshData(): void {
    this.gthAdminService.getOrganizations().subscribe({
      next: (organizations) => {
        this.organizations = organizations;
        this.originalOrganizations = JSON.parse(JSON.stringify(organizations));
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching organizations:', error);
      }
    });
  }
}
