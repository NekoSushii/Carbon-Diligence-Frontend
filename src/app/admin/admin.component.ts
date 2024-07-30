import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { LoadingService } from '../loading-screen/loading.service';
import { AdminService } from './admin.service';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { RolesDialogComponent } from './roles-dialog/roles-dialog.component';
import { DialogData, UserDialogComponent } from './user-dialog/user-dialog.component';
import { UserGroupDialogComponent } from './user-group-dialog/user-group-dialog.component';

export interface UserDataDto {
  id: string;
  email: string;
  name: string;
  roles: RolesResourcesDto[];
  isActive: boolean;
  userGroups: UserGroupDto[];
}

export interface RolesResourcesDto {
  id: string;
  name: string;
  description: string;
  resources: ResourcesDto[];
}

export interface ResourcesDto {
  name: string;
  description: string;
  status: string;
}

export interface UserGroupDto {
  id: string;
  name: string;
  description: string;
  applications: ApplicationDto[];
}

export interface ApplicationDto {
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
})
export class AdminComponent implements OnInit {
  usersData: UserDataDto[] = [];
  rolesData: RolesResourcesDto[] = [];
  userGroupsData: UserGroupDto[] = [];
  applicationsData: ApplicationDto[] = [];
  resourcesData: ResourcesDto[] = [];
  selectedUser: UserDataDto = { id: '', email: '', name: '', roles: [], isActive: true, userGroups: [] };
  selectedRoles: string[] = [];
  selectedUserGroups: string[] = [];
  loading: boolean = true;
  displayedColumns: string[] = ['email', 'name', 'roles', 'userGroups', 'isActive', 'action'];

  constructor(
    private adminService: AdminService,
    private http: HttpClient,
    private loadingService: LoadingService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadingService.show();
    this.adminService.getUsersData().subscribe({
      next: (data) => {
        this.usersData = data;
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Error loading user data:', error);
        this.loadingService.hide();
      }
    });
    this.adminService.getRoles().subscribe({
      next: (data) => {
        this.rolesData = data;
      },
      error: (error) => {
        console.error('Error loading roles data:', error);
      }
    });
    this.adminService.getUserGroups().subscribe({
      next: (data) => {
        this.userGroupsData = data;
      },
      error: (error) => {
        console.error('Error loading user groups data:', error);
      }
    });
    this.adminService.getApplications().subscribe({
      next: (data) => {
        this.applicationsData = data;
      },
      error: (error) => {
        console.error('Error loading applications data:', error);
      }
    });
    this.adminService.getResources().subscribe({
      next: (data) => {
        this.resourcesData = data;
      },
      error: (error) => {
        console.error('Error loading resources data:', error);
      }
    });
  }

  openModal(user: UserDataDto) {
    this.selectedUser = { ...user };
    this.selectedRoles = user.roles.map((role) => role.id);
    this.selectedUserGroups = user.userGroups.map((group) => group.id);
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
    this.dialog.open(RolesDialogComponent, {
      width: '80vw',
      height: '80vh',
      maxWidth: '80vw',
      maxHeight: '80vh',
      data: { roles: this.rolesData }
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

    dialogRef.afterClosed().subscribe((changedUserGroups: UserGroupDto[]) => {
      if (changedUserGroups && changedUserGroups.length > 0) {
        this.updateUserGroups(changedUserGroups);
      }
    });
  }

  updateUserGroups(changedUserGroups: UserGroupDto[]) {
    console.log('Updating User Groups:', changedUserGroups);
    this.loadingService.show();
    this.adminService.updateUserGroups(changedUserGroups).subscribe({
      next: (response) => {
        console.log('User groups updated successfully:', response);
        this.loadData();
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Error updating user groups:', error);
        this.loadingService.hide();
      }
    });
  }

  saveChanges() {
    this.loadingService.show();

    const rolesWithoutResources = this.selectedRoles.map((roleId) => {
      const role = this.rolesData.find((r) => r.id === roleId);
      if (role) {
        const { resources, ...rest } = role;
        return rest;
      }
      return null;
    }).filter(role => role !== null);

    const userGroupsWithoutApplications = this.selectedUserGroups.map((groupId) => {
      const group = this.userGroupsData.find((g) => g.id === groupId);
      if (group) {
        const { applications, ...rest } = group;
        return rest;
      }
      return null;
    }).filter(group => group !== null);

    const updatedUser = {
      ...this.selectedUser,
      roles: rolesWithoutResources,
      userGroups: userGroupsWithoutApplications
    };

    const userId = this.selectedUser.id;
    const headers = new HttpHeaders(); // No need to set Authorization header explicitly
    console.log(updatedUser);

    this.http.put(`http://localhost:5206/api/User/UpdateUser/${userId}`, updatedUser, { headers, withCredentials: true }).subscribe({
      next: (response) => {
        console.log('Put request successful:', response);
        this.loadData(); // Reload data after successful update
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Error in Put request for .../api/User/update-user:', error);
        this.loadingService.hide();
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
    this.loadingService.show();

    const updatedUser = {
      ...user,
      isActive: false
    };

    const userId = updatedUser.id;
    const headers = new HttpHeaders(); // No need to set Authorization header explicitly

    this.http.put(`http://localhost:5206/api/User/UpdateUser/${userId}`, updatedUser, { headers, withCredentials: true }).subscribe({
      next: (response) => {
        console.log('User deactivated successfully:', response);
        this.loadData(); // Reload data after successful deactivation
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Error in deactivating user:', error);
        this.loadingService.hide();
      }
    });
  }

  undeleteUser(user: UserDataDto) {
    this.loadingService.show();

    const updatedUser = {
      ...user,
      isActive: true
    };

    const userId = updatedUser.id;
    const headers = new HttpHeaders(); // No need to set Authorization header explicitly

    this.http.put(`http://localhost:5206/api/User/UpdateUser/${userId}`, updatedUser, { headers, withCredentials: true }).subscribe({
      next: (response) => {
        console.log('User reactivated successfully:', response);
        this.loadData(); // Reload data after successful reactivation
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Error in reactivating user:', error);
        this.loadingService.hide();
      }
    });
  }
}
