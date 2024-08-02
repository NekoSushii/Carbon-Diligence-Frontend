import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VesselDto } from './vessels.component';

@Injectable({
  providedIn: 'root'
})
export class VesselsService {
  private apiUrl = 'http://localhost:5206/api';

  constructor(private http: HttpClient) {}

  loadAllData(): Observable<VesselDto[]> {
    return this.http.get<VesselDto[]>(`${this.apiUrl}/GetVessels`);
  }

  updateVessel(vessel: VesselDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/vessels/${vessel.id}`, vessel);
  }
}
