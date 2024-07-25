import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from './clientAdmin.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingService } from '../../loading/loading.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './clientAdmin.component.html',
  styleUrls: ['./clientAdmin.component.css']
})
export class AdminComponent implements OnInit {
  usersData: { email: string, name: string, roles: string, id: string }[] = [];
  selectedUser: { email: string, name: string, roles: string, id: string } = { email: '', name: '', roles: '', id: this.usersData.length > 0 ? this.usersData[0].id : '' };
  loading: boolean = true;

  constructor(private adminService: AdminService, private http: HttpClient, private loadingService: LoadingService) {}

  ngOnInit() {
    this.loadingService.show();
    this.adminService.getUsersData().subscribe(data => {
      this.usersData = data;
      this.loadingService.hide();
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
    this.loadingService.show();

    // TODO: add in validation checks
    const userId = this.selectedUser.id;
    const token = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log(this.selectedUser);

    this.http.put(`http://localhost:5076/api/User/UpdateUser/${this.selectedUser.id}`, this.selectedUser, { headers })
      .subscribe(response => {
        console.log('Put request successful:', response);
        this.loadingService.hide();
      }, error => {
        console.error('Error in Put request for .../api/User/update-user:', error);
        this.loadingService.hide();
      });
  }
}
