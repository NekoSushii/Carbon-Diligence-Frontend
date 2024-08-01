import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { AdminService } from './admin.service';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { RolesDialogComponent } from './roles-dialog/roles-dialog.component';
import { DialogData, UserDialogComponent } from './user-dialog/user-dialog.component';
import { UserGroupDialogComponent } from './user-group-dialog/user-group-dialog.component';

export interface UserDataDto {
  id: number;
  email: string;
  name: string;
  roles: number[];
  isActive: boolean;
  userGroups: number[];
}

export interface RolesResourcesDto {
  id: number;
  name: string;
  description: string;
  resources: number[];
}

export interface ResourcesDto {
  id: number;
  name: string;
  description: string;
  status: string;
}

export interface UserGroupDto {
  id: number;
  name: string;
  description: string;
  applications: number[];
}

export interface ApplicationDto {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

@Component({
  standalone: true,
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
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
    ConfirmDialogComponent,
    UserDialogComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent implements OnInit, AfterViewInit, AfterViewChecked {
  usersData: UserDataDto[] = [];
  rolesData: RolesResourcesDto[] = [];
  userGroupsData: UserGroupDto[] = [];
  applicationsData: ApplicationDto[] = [];
  resourcesData: ResourcesDto[] = [];
  selectedUser: UserDataDto = { id: 0, email: '', name: '', roles: [], isActive: true, userGroups: [] };
  selectedRoles: number[] = [];
  selectedUserGroups: number[] = [];
  loading: boolean = true;
  displayedColumns: string[] = ['email', 'name', 'roles', 'userGroups', 'isActive', 'action'];
  dataLoaded: boolean = false;

  constructor(
    private adminService: AdminService,
    public dialog: MatDialog,
    private cdref: ChangeDetectorRef,
    private ngZone: NgZone,
    private snackBar: MatSnackBar
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
    this.adminService.loadAllData().subscribe({
      next: (result) => {
        this.ngZone.run(() => {
          this.usersData = result.usersData;
          this.rolesData = result.rolesData;
          this.userGroupsData = result.userGroupsData;
          this.applicationsData = result.applicationsData;
          this.resourcesData = result.resourcesData;
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
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }
  
  getRoleNames(roleIds: number[]): string {
    return roleIds.map(id => this.rolesData.find(role => role.id === id)?.name).filter(name => name).join(', ');
  }

  getUserGroupNames(groupIds: number[]): string {
    return groupIds.map(id => this.userGroupsData.find(group => group.id === id)?.name).filter(name => name).join(', ');
  }
  
  openModal(user: UserDataDto) {
    this.selectedUser = { ...user };
    this.selectedRoles = user.roles;
    this.selectedUserGroups = user.userGroups;
  
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '80vw',
      height: '80vh',
      maxWidth: '80vw',
      maxHeight: '80vh',
      data: {
        user: this.selectedUser,
        rolesData: this.rolesData,
        selectedRoles: this.selectedRoles,
        userGroupsData: this.userGroupsData,
        selectedUserGroups: this.selectedUserGroups,
      } as DialogData,
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.selectedUser = result.user;
        this.selectedRoles = result.selectedRoles;
        this.selectedUserGroups = result.selectedUserGroups;
        this.saveChanges();
      }
    });
  }
  
  openRolesDialog() {
    const dialogRef = this.dialog.open(RolesDialogComponent, {
      width: '80vw',
      height: '80vh',
      maxWidth: '80vw',
      maxHeight: '80vh',
      data: { roles: this.rolesData, resources: this.resourcesData }
    });

    dialogRef.componentInstance.dataChanged.subscribe(() => {
      this.loadData();
    });

    dialogRef.afterClosed().subscribe((changedRoles: RolesResourcesDto[]) => {
      if (changedRoles && changedRoles.length > 0) {
        this.updateRoles(changedRoles);
      }
    });
  }

  openUserGroupsDialog() {
    const dialogRef = this.dialog.open(UserGroupDialogComponent, {
      width: '80vw',
      height: '80vh',
      maxWidth: '80vw',
      maxHeight: '80vh',
      data: { userGroups: this.userGroupsData, applications: this.applicationsData }
    });

    dialogRef.componentInstance.dataChanged.subscribe(() => {
      this.loadData();
    });

    dialogRef.afterClosed().subscribe((changedUserGroups: UserGroupDto[]) => {
      if (changedUserGroups && changedUserGroups.length > 0) {
        this.updateUserGroups(changedUserGroups);
      }
    });
  }

  updateRoles(changedRoles: RolesResourcesDto[]) {
    this.adminService.updateRoles(changedRoles).subscribe({
      next: (response) => {
        this.loadData();
      },
      error: (error) => {
        console.error('Error updating roles:', error);
      }
    });
  }

  updateUserGroups(changedUserGroups: UserGroupDto[]) {
    this.adminService.updateUserGroups(changedUserGroups).subscribe({
      next: (response) => {
        this.loadData();
      },
      error: (error) => {
        console.error('Error updating user groups:', error);
      }
    });
  }

  saveChanges() {
    const updatedUser = {
      ...this.selectedUser,
      roles: this.selectedRoles,
      userGroups: this.selectedUserGroups
    };

    this.adminService.updateUser(updatedUser).subscribe({
      next: (response) => {
        this.loadData();
      },
      error: (error) => {
        console.error('Error in Put request for .../api/User/update-user:', error);
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
      }
    });
  }

  deleteUser(user: UserDataDto) {
    const updatedUser = {
      ...user,
      isActive: false
    };

    this.adminService.updateUser(updatedUser).subscribe({
      next: (response) => {
        this.loadData();
      },
      error: (error) => {
        console.error('Error in deactivating user:', error);
      }
    });
  }

  undeleteUser(user: UserDataDto) {
    const updatedUser = {
      ...user,
      isActive: true
    };

    this.adminService.updateUser(updatedUser).subscribe({
      next: (response) => {
        this.loadData();
      },
      error: (error) => {
        console.error('Error in reactivating user:', error);
      }
    });
  }

}
