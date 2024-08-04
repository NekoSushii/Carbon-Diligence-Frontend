import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RolesResourcesDto, ResourcesDto } from '../admin.component';
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
export class RolesDialogComponent implements OnInit {
  @Output() dataChanged = new EventEmitter<void>();

  displayedColumns: string[] = ['name', 'description', 'resources', 'actions'];
  roles: RolesResourcesDto[] = [];
  resources: ResourcesDto[] = [];
  originalRoles!: RolesResourcesDto[]; // Definite assignment assertion

  constructor(
    public dialogRef: MatDialogRef<RolesDialogComponent>,
    public dialog: MatDialog,
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.adminService.loadRolesAndResources().subscribe({
      next: (result) => {
        this.roles = result.roles;
        this.resources = result.resources;
        this.originalRoles = JSON.parse(JSON.stringify(this.roles));
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
    const changedRoles = this.roles.filter((role, index) => {
      return JSON.stringify(role) !== JSON.stringify(this.originalRoles[index]);
    });

    if (changedRoles.length > 0) {
      this.adminService.updateRoles(changedRoles).subscribe({
        next: () => {
          this.refreshData();
          this.dataChanged.emit();
          this.dialogRef.close(changedRoles);
        },
        error: (error) => {
          console.error('Error updating roles:', error);
        }
      });
    } else {
      this.dialogRef.close();
    }
  }

  createRole(): void {
    const dialogRef = this.dialog.open(CreateItemDialogComponent, {
      width: '400px',
      data: {
        title: 'Create New Role',
        name: '',
        description: '',
        options: this.resources,
        selectedOptions: []
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newRole: RolesResourcesDto = {
          id: 0,
          name: result.name,
          description: result.description,
          resources: result.selectedOptions
        };

        this.adminService.createRole(newRole).subscribe({
          next: (response) => {
            newRole.id = response.id;
            this.roles.push(newRole);
            this.refreshData();
            this.dataChanged.emit();
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
          const index = this.roles.indexOf(role);
          if (index > -1) {
            this.roles.splice(index, 1);
            this.refreshData();
            this.dataChanged.emit();
          }
        },
        error: (error) => {
          console.error('Error deleting role:', error);
        }
      });
    }
  }

  private refreshData(): void {
    this.roles = [...this.roles];
    this.originalRoles = JSON.parse(JSON.stringify(this.roles));
    this.cdr.detectChanges();
  }
}
