import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from './admin.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  usersData: { email: string, name: string, roles: string, id: string }[] = [];
  selectedUser: { email: string, name: string, roles: string, id: string } = { email: '', name: '', roles: '', id: this.usersData.length > 0 ? this.usersData[0].id : '' };
  loading: boolean = true;

  constructor(private adminService: AdminService, private http: HttpClient) {}

  ngOnInit() {
    this.adminService.getUsersData().subscribe(data => {
      this.usersData = data;
      this.loading = false;
    });
  }

  openModal(user: { email: string, name: string, roles: string, id: string }) {
    this.selectedUser = { ...user };
    const modal = document.getElementById('myModal');
    if (modal) {
      modal.style.display = 'block';
    } else {
      console.error('Modal element not found');
    }
  }

  closeModal() {
    const modal = document.getElementById('myModal');
    if (modal) {
      modal.style.display = 'none';
    } else {
      console.error('Modal element not found');
    }
  }

  saveChanges() {
    // TODO: add in validation checks
    console.log(this.selectedUser);

    const userId = this.selectedUser.id;
    const token = sessionStorage.getItem('jwtToken'); // Retrieve the token from session storage
    console.log(token);

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Set the Authorization header

    this.http.put(`http://localhost:5076/api/User/${userId}`, this.selectedUser, { headers })
      .subscribe(response => {
        console.log('Put request successful:', response);
      }, error => {
        console.error('Error in Put request for .../api/User/update-user:', error);
      });
  }
}
