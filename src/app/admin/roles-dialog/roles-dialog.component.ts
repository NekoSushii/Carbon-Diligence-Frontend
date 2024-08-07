import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { SnackbarService } from '../../snackbarService/snackbar.service';
import { RolesVesselsDto, VesselDto } from '../admin.component';
import { AdminService } from '../admin.service';

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
    MatButtonModule
  ]
})
export class RolesDialogComponent implements OnInit {
  @Output() dataChanged = new EventEmitter<void>();

  displayedColumns: string[] = ['name', 'description', 'vessels', 'permissions', 'actions'];
  roles: RolesVesselsDto[] = [];
  vessels: VesselDto[] = [];
  originalRoles!: RolesVesselsDto[];
  permissionsList: string[] = ['Create', 'Read', 'Update', 'Delete'];
  newRole: RolesVesselsDto = {
    id: 0,
    name: '',
    description: '',
    permissions: [],
    vessels: []
  };
  viewingCreateRole = false;

  constructor(
    public dialogRef: MatDialogRef<RolesDialogComponent>,
    public dialog: MatDialog,
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.adminService.loadRolesAndVessels().subscribe({
      next: (result) => {
        this.roles = result.roles.map(role => ({
          ...role,
          permissions: role.permissions || []
        }));
        this.vessels = result.vessels;
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
      changedRoles.forEach(role => {
        role.permissions = role.permissions.map(permission => permission.trim());
      });

      this.adminService.updateRoles(changedRoles).subscribe({
        next: () => {
          this.refreshData();
          this.dataChanged.emit();
          this.dialogRef.close(changedRoles);
          this.snackBarService.show('Changes saved!', 'close', 3000);
        },
        error: (error) => {
          console.error('Error updating roles:', error);
        }
      });
    } else {
      this.dialogRef.close();
    }
  }

  viewCreateRole(): void {
    this.newRole = {
      id: 0,
      name: '',
      description: '',
      permissions: [],
      vessels: []
    };
    this.viewingCreateRole = true;
  }

  cancelCreateRole(): void {
    this.viewingCreateRole = false;
  }

  saveNewRole(): void {
    if (this.newRole.name && this.newRole.description) {
      this.newRole.permissions = this.newRole.permissions.map(permission => permission.trim());
      this.adminService.createRole(this.newRole).subscribe({
        next: (response) => {
          if (response) {
            this.newRole.id = response;
            this.roles.push({ ...this.newRole });
            this.refreshData();
            this.dataChanged.emit();
            this.viewingCreateRole = false;
            this.snackBarService.show('Role created!', 'close', 3000);
          } else {
            this.snackBarService.show('Error creating role!', 'close', 3000);
          }
        },
        error: (error) => {
          console.error('Error creating role:', error);
          this.snackBarService.show('Error creating role!', 'close', 3000);
        }
      });
    }
  }

  deleteRole(role: RolesVesselsDto): void {
    if (confirm(`Are you sure you want to delete the role ${role.name}?`)) {
      this.adminService.deleteRole(role.id).subscribe({
        next: () => {
          const index = this.roles.indexOf(role);
          if (index > -1) {
            this.roles.splice(index, 1);
            this.refreshData();
            this.dataChanged.emit();
            this.snackBarService.show('Role deleted!', 'close', 3000);
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

  comparePermissions(o1: string, o2: string): boolean {
    return o1 === o2;
  }
}
