import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from './admin.service';
import { HttpClient } from '@angular/common/http'; // Import HttpClient

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

  constructor(private adminService: AdminService, private http: HttpClient) {}

  ngOnInit() {
    this.adminService.getUsersData().subscribe(data => {
      this.usersData = data;
      console.log(this.usersData);
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
    this.http.put('http://localhost:5076/api/Session/update-user', this.selectedUser).subscribe(response => {
      console.log('Put request successful:', response);
    }, error => {
      console.error('Error making PUT request:', error);
    });
  }
}
