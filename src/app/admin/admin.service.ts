import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, from } from 'rxjs';
import { concatMap } from 'rxjs/operators';
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

  loadAllData(): Observable<{
    usersData: UserDataDto[],
    rolesData: RolesResourcesDto[],
    userGroupsData: UserGroupDto[],
    applicationsData: ApplicationDto[],
    resourcesData: ResourcesDto[]
  }> {
    return forkJoin({
      usersData: this.getUsersData(),
      rolesData: this.getRoles(),
      userGroupsData: this.getUserGroups(),
      applicationsData: this.getApplications(),
      resourcesData: this.getResources()
    });
  }

  updateRoles(changedRoles: RolesResourcesDto[]): Observable<any> {
    return from(changedRoles).pipe(
      concatMap(roles => 
        this.http.put(`${this.apiUrl}/UserManagement/UpdateRole`, roles, { withCredentials: true })
      )
    );
  }

  updateUserGroups(userGroups: UserGroupDto[]): Observable<any> {
    return from(userGroups).pipe(
      concatMap(userGroup => 
        this.http.put(`${this.apiUrl}/UserManagement/UpdateUserGroup`, userGroup, { withCredentials: true })
      )
    );
  }

  createRole(role: RolesResourcesDto): Observable<RolesResourcesDto> {
    return this.http.post<RolesResourcesDto>(`${this.apiUrl}/UserManagement/AddRole`, role, { withCredentials: true });
  }
  
  createUserGroup(userGroup: UserGroupDto): Observable<UserGroupDto> {
    return this.http.post<UserGroupDto>(`${this.apiUrl}/UserManagement/AddUserGroup`, userGroup, { withCredentials: true });
  }

  deleteRole(roleId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/UserManagement/DeleteRole/${roleId}`, { withCredentials: true });
  }
  
  deleteUserGroup(userGroupId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/UserManagement/DeleteUserGroup/${userGroupId}`, { withCredentials: true });
  }

  updateUser(user: UserDataDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/User/UpdateUser`, user, { withCredentials: true });
  }
}
