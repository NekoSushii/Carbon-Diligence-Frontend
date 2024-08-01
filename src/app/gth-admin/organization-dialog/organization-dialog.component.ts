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
import { CreateItemDialogComponent } from '../create-item-dialog/create-item-dialog.component';
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
    CreateItemDialogComponent,
    MatIconModule
  ]
})
export class OrganizationDialogComponent {
  @Output() dataChanged = new EventEmitter<void>();

  displayedColumns: string[] = ['name', 'description', 'isActive', 'subscription', 'actions'];
  organizations: OrganizationDto[] = [];
  originalOrganizations: OrganizationDto[];

  constructor(
    public dialogRef: MatDialogRef<OrganizationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { organizations: OrganizationDto[], subscriptions: SubscriptionDto[] },
    public dialog: MatDialog,
    private gthAdminService: GthAdminService,
    private cdr: ChangeDetectorRef
  ) {
    this.organizations = JSON.parse(JSON.stringify(data.organizations));
    this.originalOrganizations = JSON.parse(JSON.stringify(data.organizations));
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
    const dialogRef = this.dialog.open(CreateItemDialogComponent, {
      width: '400px',
      data: {
        title: 'Create New Organization',
        name: '',
        description: '',
        options: this.data.subscriptions,
        selectedOptions: []
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newOrganization: OrganizationDto = {
          id: 0,
          name: result.name,
          description: result.description,
          isActive: true,
          subscription: result.selectedOptions
        };

        this.gthAdminService.createOrganization(newOrganization).subscribe({
          next: (response) => {
            newOrganization.id = response.id;
            this.organizations.push(newOrganization);
            this.refreshData();
            this.dataChanged.emit();
          },
          error: (error) => {
            console.error('Error creating organization:', error);
          }
        });
      }
    });
  }

  deleteOrganization(organization: OrganizationDto): void {
    if (confirm(`Are you sure you want to delete the organization ${organization.name}?`)) {
      const updatedOrganization = { ...organization, isActive: false };
      this.gthAdminService.updateOrganization(updatedOrganization.id, updatedOrganization).subscribe({
        next: () => {
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
    this.originalOrganizations = JSON.parse(JSON.stringify(this.organizations));
    this.cdr.detectChanges();
  }
}
