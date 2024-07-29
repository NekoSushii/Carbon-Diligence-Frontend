import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDataDto, RolesResourcesDto } from './admin.component';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:5206/api';

  constructor(private http: HttpClient) {}

  getUsersData(): Observable<UserDataDto[]> {
    const token = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<UserDataDto[]>(`${this.apiUrl}/User/GetUsers`, { headers });

  }

  getRoles(): Observable<RolesResourcesDto[]> {
    const token = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<RolesResourcesDto[]>(`${this.apiUrl}/UserManagement/GetRoles`, {headers});

  }
}
