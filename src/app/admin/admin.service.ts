import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
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
        this.http.put(`${this.apiUrl}/UserManagement/UpdateUserGroups/${userGroup.id}`, userGroup, { withCredentials: true })
      )
    );
  }

  createRole(newRole: RolesResourcesDto): Observable<any> {
    const roleToCreate = {
      id: Number(newRole.id),
      name: newRole.name,
      description: newRole.description,
      resources: newRole.resources.length>0 ? newRole.resources : {id: 1, name: '', description: '', status: true}
    }
    console.log(roleToCreate);

    return this.http.post(`${this.apiUrl}/UserManagement/AddRole`, roleToCreate, { withCredentials: true });
  }

  createUserGroup(newUserGroup: UserGroupDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/UserManagement/AddUserGroup`, newUserGroup, { withCredentials: true });
  }

  deleteRole(roleId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/UserManagement/DeleteRole/${roleId}`, { withCredentials: true });
  }

  deleteUserGroup(userGroupId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/UserManagement/DeleteUserGroup/${userGroupId}`, { withCredentials: true });
  }
}
