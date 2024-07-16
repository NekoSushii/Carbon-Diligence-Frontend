import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  constructor(private http: HttpClient) {}

  createSession(): Observable<string> {
    // Replace 'your-backend-endpoint' with your actual backend endpoint
    return this.http.post<{ token: string }>('https://your-backend-endpoint/session', {}).pipe(
      map(response => response.token)
    );
  }
}
