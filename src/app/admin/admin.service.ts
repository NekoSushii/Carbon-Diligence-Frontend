import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) {}

  getUsersData(): Observable<{ email: string, name: string, roles: string, id: string }[]> {
    const token = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<{ email: string, name: string, roles: string, id: string }[]>("http://localhost:5076/api/User/GetUsers", { headers });
  }
}
