import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationDto, ResourcesDto, RolesResourcesDto, UserDataDto, UserGroupDto } from './admin.component';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:5206/api';

  constructor(private http: HttpClient) {}

  getUsersData(): Observable<UserDataDto[]> {
    return this.http.get<UserDataDto[]>(`${this.apiUrl}/User/GetUsers`, { withCredentials: true });
  }

  getRoles(): Observable<RolesResourcesDto[]> {
    return this.http.get<RolesResourcesDto[]>(`${this.apiUrl}/UserManagement/GetRoles`, { withCredentials: true });
  }

  getUserGroups(): Observable<UserGroupDto[]> {
    return this.http.get<UserGroupDto[]>(`${this.apiUrl}/UserManagement/GetUserGroups`, { withCredentials: true });
  }

  getApplications(): Observable<ApplicationDto[]> {
    return this.http.get<ApplicationDto[]>(`${this.apiUrl}/UserManagement/GetApplications`, { withCredentials: true });
  }

  getResources(): Observable<ResourcesDto[]> {
    return this.http.get<ResourcesDto[]>(`${this.apiUrl}/UserManagement/GetResources`, { withCredentials: true });
  }

  updateUserGroups(userGroups: UserGroupDto[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/UserManagement/UpdateUserGroups`, userGroups, { withCredentials: true });
  }
}
