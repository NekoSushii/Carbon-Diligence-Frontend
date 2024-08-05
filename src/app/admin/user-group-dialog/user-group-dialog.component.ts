import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ApplicationDto, UserGroupDto } from '../admin.component';
import { AdminService } from '../admin.service';
import { CreateItemDialogComponent } from '../create-item-dialog/create-item-dialog.component';
import { SnackbarService } from '../../snackbarService/snackbar.service';

@Component({
  selector: 'app-user-group-dialog',
  templateUrl: './user-group-dialog.component.html',
  styleUrls: ['./user-group-dialog.component.css'],
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
    CreateItemDialogComponent
  ]
})
export class UserGroupDialogComponent implements OnInit {
  @Output() dataChanged = new EventEmitter<void>();

  displayedColumns: string[] = ['name', 'description', 'applications', 'actions'];
  userGroups: UserGroupDto[] = [];
  applications: ApplicationDto[] = [];
  originalUserGroups!: UserGroupDto[]; // Definite assignment assertion

  constructor(
    public dialogRef: MatDialogRef<UserGroupDialogComponent>,
    public dialog: MatDialog,
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
    private snackBarService: SnackbarService,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.adminService.loadUserGroupsAndApplications().subscribe({
      next: (result) => {
        this.userGroups = result.userGroups;
        this.applications = result.applications;
        this.originalUserGroups = JSON.parse(JSON.stringify(this.userGroups));
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading data:', error);
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  saveChanges(): void {
    const changedUserGroups = this.userGroups.filter((group, index) => {
      return JSON.stringify(group) !== JSON.stringify(this.originalUserGroups[index]);
    });

    if (changedUserGroups.length > 0) {
      this.adminService.updateUserGroups(changedUserGroups).subscribe({
        next: () => {
          this.refreshData();
          this.dataChanged.emit();
          this.dialogRef.close(changedUserGroups);
          this.snackBarService.show('Changes saved!', "close", 3000);
        },
        error: (error) => {
          console.error('Error updating user groups:', error);
        }
      });
    } else {
      this.dialogRef.close();
    }
  }

  createUserGroup(): void {
    const dialogRef = this.dialog.open(CreateItemDialogComponent, {
      width: '400px',
      data: {
        title: 'Create New User Group',
        name: '',
        description: '',
        options: this.applications,
        selectedOptions: []
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newUserGroup: UserGroupDto = {
          id: 0,
          name: result.name,
          description: result.description,
          applications: result.selectedOptions
        };

        this.adminService.createUserGroup(newUserGroup).subscribe({
          next: (response) => {
            newUserGroup.id = response.id;
            this.userGroups.push(newUserGroup);
            this.refreshData();
            this.dataChanged.emit();
            this.snackBarService.show('User group created!', "close", 3000);
          },
          error: (error) => {
            console.error('Error creating user group:', error);
          }
        });
      }
    });
  }

  deleteUserGroup(userGroup: UserGroupDto): void {
    if (confirm(`Are you sure you want to delete the user group ${userGroup.name}?`)) {
      this.adminService.deleteUserGroup(userGroup.id).subscribe({
        next: () => {
          const index = this.userGroups.indexOf(userGroup);
          if (index > -1) {
            this.userGroups.splice(index, 1);
            this.refreshData();
            this.dataChanged.emit();
            this.snackBarService.show('User group deleted!', "close", 3000);
          }
        },
        error: (error) => {
          console.error('Error deleting user group:', error);
        }
      });
    }
  }

  private refreshData(): void {
    this.userGroups = [...this.userGroups];
    this.originalUserGroups = JSON.parse(JSON.stringify(this.userGroups));
    this.cdr.detectChanges();
  }
}
