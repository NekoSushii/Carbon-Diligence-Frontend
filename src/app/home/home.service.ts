import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ApplicationDto {
  id: string,
  name: string,
  description: string
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiUrl = 'http://localhost:5206/api';

  constructor(private http: HttpClient) {}

  getApplications(): Observable<any[]> {
    return this.http.get<ApplicationDto[]>(`${this.apiUrl}/abs/User/GetApplications`, { withCredentials: true });
  }
}
