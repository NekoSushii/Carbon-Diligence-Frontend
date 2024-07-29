import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { AdminService } from './admin.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingService } from '../loading/loading.service';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog/confirm-dialog.component';
import { UserDialogComponent } from './user-dialog/user-dialog.component';

export interface UserDataDto {
  id: string;
  email: string;
  name: string;
  roles: RolesResourcesDto[];
  isActive: boolean;
}

export interface RolesResourcesDto {
  id: string;
  name: string;
  description: string;
  resources: {
    name: string;
    description: string;
    status: string;
  }[];
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
  ],
})
export class AdminComponent implements OnInit {
  usersData: UserDataDto[] = [];
  rolesData: RolesResourcesDto[] = [];
  selectedUser: UserDataDto = { id: '', email: '', name: '', roles: [], isActive: true };
  selectedRoles: string[] = [];
  loading: boolean = true;
  displayedColumns: string[] = ['email', 'name', 'roles', 'isActive', 'action'];

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
    this.adminService.getUsersData().subscribe((data) => {
      console.log(data);
      this.usersData = data;
      this.loadingService.hide();
    });
    this.adminService.getRoles().subscribe((data) => {
      console.log(data);
      this.rolesData = data;
    });
  }

  openModal(user: UserDataDto) {
    this.selectedUser = { ...user };
    this.selectedRoles = user.roles.map((role) => role.id);
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '250px',
      data: { user: this.selectedUser, rolesData: this.rolesData, selectedRoles: this.selectedRoles },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.selectedUser = result.user;
        this.selectedRoles = result.selectedRoles;
        this.saveChanges();
      }
    });
  }

  saveChanges() {
    this.loadingService.show();

    // Map the selectedRoles array back to the roles array without resourcesDtos
    const rolesWithoutResources = this.selectedRoles.map((roleId) => {
      const role = this.rolesData.find((r) => r.id === roleId);
      if (role) {
        const { resources, ...rest } = role;
        return rest;
      }
      return null;
    }).filter(role => role !== null);

    const updatedUser = {
      ...this.selectedUser,
      roles: rolesWithoutResources
    };

    const userId = this.selectedUser.id;
    const token = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log(updatedUser);

    this.http.put(`http://localhost:5206/api/User/UpdateUser/${userId}`, updatedUser, { headers }).subscribe(
      (response) => {
        console.log('Put request successful:', response);
        this.loadData(); // Reload data after successful update
        this.loadingService.hide();
      },
      (error) => {
        console.error('Error in Put request for .../api/User/update-user:', error);
        this.loadingService.hide();
      }
    );
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
    const token = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.put(`http://localhost:5206/api/User/UpdateUser/${userId}`, updatedUser, { headers }).subscribe(
      (response) => {
        console.log('User deactivated successfully:', response);
        this.loadData(); // Reload data after successful deactivation
        this.loadingService.hide();
      },
      (error) => {
        console.error('Error in deactivating user:', error);
        this.loadingService.hide();
      }
    );
  }

  undeleteUser(user: UserDataDto) {
    this.loadingService.show();

    const updatedUser = {
      ...user,
      isActive: true
    };

    const userId = updatedUser.id;
    const token = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.put(`http://localhost:5206/api/User/UpdateUser/${userId}`, updatedUser, { headers }).subscribe(
      (response) => {
        console.log('User reactivated successfully:', response);
        this.loadData(); // Reload data after successful reactivation
        this.loadingService.hide();
      },
      (error) => {
        console.error('Error in reactivating user:', error);
        this.loadingService.hide();
      }
    );
  }
}
