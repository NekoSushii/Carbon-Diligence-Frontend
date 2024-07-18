import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from './admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  usersData: { email: string, name: string, roles: string }[] = [];
  selectedUser: { email: string, name: string, roles: string } = { email: '', name: '', roles: '' }; // Initialize selectedUser here

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.getUsersData().subscribe(data => {
      this.usersData = data;
      console.log(this.usersData);
    });
  }

  openModal(user: { email: string, name: string, roles: string }) {
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
    // TODO: make the role and permission fields multiselect dropdown using values stored in database
    console.log(`Email: ${this.selectedUser.email}`);
    console.log(`Name: ${this.selectedUser.name}`);
    console.log(`Roles: ${this.selectedUser.roles}`);
  }
}
