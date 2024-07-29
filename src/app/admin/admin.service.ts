import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDataDto, RolesResourcesDto, UserGroupDto } from './admin.component';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:5206/api';

  constructor(private http: HttpClient, private cookieService: CookieService,) {}

  getUsersData(): Observable<UserDataDto[]> {
    const token = this.cookieService.get('jwtToken');
    console.log(token);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<UserDataDto[]>(`${this.apiUrl}/User/GetUsers`, { headers });

  }

  getRoles(): Observable<RolesResourcesDto[]> {
    const token = this.cookieService.get('jwtToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<RolesResourcesDto[]>(`${this.apiUrl}/UserManagement/GetRoles`, {headers});
  }

  getUserGroup(): Observable<UserGroupDto[]> {
    const token = this.cookieService.get('jwtToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<UserGroupDto[]>(`${this.apiUrl}/UserManagement/GetUserGroups`, {headers})
  }
}
