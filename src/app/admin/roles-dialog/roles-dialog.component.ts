import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ResourcesDto, RolesResourcesDto } from '../admin.component';
import { AdminService } from '../admin.service';
import { CreateItemDialogComponent } from '../create-item-dialog/create-item-dialog.component';

@Component({
  selector: 'app-roles-dialog',
  templateUrl: './roles-dialog.component.html',
  styleUrls: ['./roles-dialog.component.css'],
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
export class RolesDialogComponent {
  @Output() dataChanged = new EventEmitter<void>();

  displayedColumns: string[] = ['name', 'description', 'resources', 'actions'];
  originalRoles: RolesResourcesDto[];

  constructor(
    public dialogRef: MatDialogRef<RolesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { roles: RolesResourcesDto[], resources: ResourcesDto[] },
    public dialog: MatDialog,
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {
    this.originalRoles = JSON.parse(JSON.stringify(data.roles)); // Deep copy to track changes
    console.log(data);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  saveChanges(): void {
    const changedRoles = this.data.roles.filter((role, index) => {
      return JSON.stringify(role) !== JSON.stringify(this.originalRoles[index]);
    });

    console.log('Changed Roles:', changedRoles);
    this.dataChanged.emit(); // Emit event to notify changes
    this.refreshData();
  }

  createRole(): void {
    const dialogRef = this.dialog.open(CreateItemDialogComponent, {
      width: '400px',
      data: {
        title: 'Create New Role',
        name: '',
        description: '',
        options: this.data.resources,
        selectedOptions: []
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newRole: RolesResourcesDto = {
          id: '',
          name: result.name,
          description: result.description,
          resources: result.selectedOptions.map((id: string) => {
            return this.data.resources.find(resource => resource.id === id);
          })
        };
  
        this.adminService.createRole(newRole).subscribe({
          next: (response) => {
            newRole.id = response.id; // Assuming the response contains the new role ID
            this.data.roles.push(newRole);
            this.refreshData();
            this.dataChanged.emit(); // Emit event to notify changes
          },
          error: (error) => {
            console.error('Error creating role:', error);
          }
        });
      }
    });
  }

  deleteRole(role: RolesResourcesDto): void {
    if (confirm(`Are you sure you want to delete the role ${role.name}?`)) {
      this.adminService.deleteRole(role.id).subscribe({
        next: () => {
          const index = this.data.roles.indexOf(role);
          if (index > -1) {
            this.data.roles.splice(index, 1);
            this.refreshData();
            this.dataChanged.emit(); // Emit event to notify changes
          }
        },
        error: (error) => {
          console.error('Error deleting role:', error);
        }
      });
    }
  }

  private refreshData(): void {
    this.originalRoles = JSON.parse(JSON.stringify(this.data.roles)); // Update original roles for change detection
    this.cdr.detectChanges(); // Trigger change detection
  }
}
