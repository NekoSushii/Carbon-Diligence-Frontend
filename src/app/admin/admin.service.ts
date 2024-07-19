import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:5076/api/Session/get-admin-user-list';

  constructor(private http: HttpClient) {}

  getUsersData(): Observable<{ email: string, name: string, roles: string, id: string }[]> {
    return this.http.get<{ email: string, name: string, roles: string, id: string }[]>(this.apiUrl);
  }
}
