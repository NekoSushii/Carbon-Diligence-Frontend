import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, from } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { ApplicationDto, CreateUserDto, RolesVesselsDto, UserDataDto, UserGroupDto, VesselDto } from './admin.component';

export interface CreateRoleDto {
  name: string;
  description: string;
  permissions: string[];
  resources: number[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:5206/api';

  constructor(private http: HttpClient) {}

  getUsersData(): Observable<UserDataDto[]> {
    return this.http.get<UserDataDto[]>(`${this.apiUrl}/User/GetUsers`, { withCredentials: true });
  }

  getRoles(): Observable<RolesVesselsDto[]> {
    return this.http.get<RolesVesselsDto[]>(`${this.apiUrl}/UserManagement/GetRoles`, { withCredentials: true });
  }

  getUserGroups(): Observable<UserGroupDto[]> {
    return this.http.get<UserGroupDto[]>(`${this.apiUrl}/UserManagement/GetUserGroups`, { withCredentials: true });
  }

  getApplications(): Observable<ApplicationDto[]> {
    return this.http.get<ApplicationDto[]>(`${this.apiUrl}/UserManagement/GetApplications`, { withCredentials: true });
  }

  getVessels(): Observable<VesselDto[]> {
    return this.http.get<VesselDto[]>(`${this.apiUrl}/Vessel/GetVessels`, { withCredentials: true });
  }

  loadRolesAndVessels(): Observable<{ roles: RolesVesselsDto[], vessels: VesselDto[] }> {
    return forkJoin({
      roles: this.getRoles(),
      vessels: this.getVessels()
    });
  }

  loadUserGroupsAndApplications(): Observable<{ userGroups: UserGroupDto[], applications: ApplicationDto[] }> {
    return forkJoin({
      userGroups: this.getUserGroups(),
      applications: this.getApplications()
    });
  }

  loadAllData(): Observable<{
    usersData: UserDataDto[],
    rolesData: RolesVesselsDto[],
    userGroupsData: UserGroupDto[],
    applicationsData: ApplicationDto[],
    vesselsData: VesselDto[]
  }> {
    return forkJoin({
      usersData: this.getUsersData(),
      rolesData: this.getRoles(),
      userGroupsData: this.getUserGroups(),
      applicationsData: this.getApplications(),
      vesselsData: this.getVessels()
    });
  }

  updateRoles(changedRoles: RolesVesselsDto[]): Observable<any> {
    return from(changedRoles).pipe(
      concatMap(roles =>
        this.http.put(`${this.apiUrl}/UserManagement/UpdateRole/${roles.id}`, roles, { withCredentials: true })
      )
    );
  }

  updateUserGroups(userGroups: UserGroupDto[]): Observable<any> {
    return from(userGroups).pipe(
      concatMap(userGroup =>
        this.http.put(`${this.apiUrl}/UserManagement/UpdateUserGroup/${userGroup.id}`, userGroup, { withCredentials: true })
      )
    );
  }

  createRole(role: RolesVesselsDto): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/UserManagement/AddRole`, role, { withCredentials: true });
  }


  createUserGroup(userGroup: UserGroupDto): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/UserManagement/AddUserGroup`, userGroup, { withCredentials: true });
  }

  createUser(newUser: UserDataDto): Observable<CreateUserDto> {
    const newUserDto = {
      authorizationId: "",
      WCN: "",
      displayName: newUser.name,
      email: newUser.email,
      userName: newUser.name,
      isActive: true,
      organizationId: 1
    }
    return this.http.post<CreateUserDto>(`${this.apiUrl}/User/AddUser`, newUserDto, {withCredentials: true});
  }

  deleteRole(roleId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/UserManagement/DeleteRole/${roleId}`, { withCredentials: true });
  }

  deleteUserGroup(userGroupId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/UserManagement/DeleteUserGroup/${userGroupId}`, { withCredentials: true });
  }

  updateUser(user: UserDataDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/User/UpdateUser/${user.id}`, user, { withCredentials: true });
  }
}
