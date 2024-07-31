import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ApplicationDto, UserGroupDto } from '../admin.component';
import { AdminService } from '../admin.service';
import { CreateItemDialogComponent } from '../create-item-dialog/create-item-dialog.component';

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
export class UserGroupDialogComponent {
  @Output() dataChanged = new EventEmitter<void>();

  displayedColumns: string[] = ['name', 'description', 'applications', 'actions'];
  originalUserGroups: UserGroupDto[];

  constructor(
    public dialogRef: MatDialogRef<UserGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userGroups: UserGroupDto[], applications: ApplicationDto[] },
    public dialog: MatDialog,
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {
    this.originalUserGroups = JSON.parse(JSON.stringify(data.userGroups)); // Deep copy to track changes
  }

  onClose(): void {
    this.dialogRef.close();
  }

  saveChanges(): void {
    const changedUserGroups = this.data.userGroups.filter((group, index) => {
      return JSON.stringify(group) !== JSON.stringify(this.originalUserGroups[index]);
    });

    console.log('Changed User Groups:', changedUserGroups);
    this.dialogRef.close(changedUserGroups);
    this.dataChanged.emit(); // Emit event to notify changes
  }

  createUserGroup(): void {
    const dialogRef = this.dialog.open(CreateItemDialogComponent, {
      width: '400px',
      data: {
        title: 'Create New User Group',
        name: '',
        description: '',
        options: this.data.applications,
        selectedOptions: []
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newUserGroup: UserGroupDto = {
          id: '',
          name: result.name,
          description: result.description,
          applications: result.selectedOptions.map((id: string) => {
            return this.data.applications.find(application => application.id === id);
          })
        };
  
        this.adminService.createUserGroup(newUserGroup).subscribe({
          next: (response) => {
            newUserGroup.id = response.id; // Assuming the response contains the new user group ID
            this.data.userGroups.push(newUserGroup);
            this.refreshData();
            this.dataChanged.emit(); // Emit event to notify changes
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
          const index = this.data.userGroups.indexOf(userGroup);
          if (index > -1) {
            this.data.userGroups.splice(index, 1);
            this.refreshData();
            this.dataChanged.emit(); // Emit event to notify changes
          }
        },
        error: (error) => {
          console.error('Error deleting user group:', error);
        }
      });
    }
  }
  

  private refreshData(): void {
    this.originalUserGroups = JSON.parse(JSON.stringify(this.data.userGroups)); // Update original user groups for change detection
    this.cdr.detectChanges(); // Trigger change detection
  }
  
}
