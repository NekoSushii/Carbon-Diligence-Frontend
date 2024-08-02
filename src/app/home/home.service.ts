import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDataDto } from '../gth-admin/gth-admin.component';

interface SessionUser {
  id: number,
  name: string,
  email: string,
  roles: number[],
  userGroups: number[],
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiUrl = 'http://localhost:5206/api';

  constructor(private http: HttpClient) {}

  getUsersData(): Observable<UserDataDto> {
    const userString = sessionStorage.getItem('user');
    if (!userString) {
      throw new Error('User not found in session storage');
    }

    const currUser: SessionUser = JSON.parse(userString);

    return this.http.get<UserDataDto>(`${this.apiUrl}/abs/User/GetUserByEmail/${currUser.email}`, { withCredentials: true });
  }
}
