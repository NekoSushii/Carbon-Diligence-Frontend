import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { IMODto } from '../gth-admin/gth-admin.component';
import { ODVNoonReportData, odvReportCreateDto, VesselData, VesselDto, VesselTypeDto } from './vessels.component';

@Injectable({
  providedIn: 'root'
})
export class VesselsService {
  private apiUrl = 'http://localhost:5206/api/';

  constructor(private http: HttpClient) {}

  loadAllData(): Observable<{ vessels: VesselDto[]; vesselTypes: VesselTypeDto[]; }> {
    return forkJoin({
      vessels: this.http.get<VesselDto[]>(`${this.apiUrl}Vessel/GetVessels`, { withCredentials: true }),
      vesselTypes: this.http.get<VesselTypeDto[]>(`${this.apiUrl}Vessel/GetVesselTypes`, { withCredentials: true })

    });
  }

  getVessels(): Observable<VesselDto[]>{
    return this.http.get<VesselDto[]>(`${this.apiUrl}Vessel/GetVessels`, { withCredentials: true })
  }

  getIMOs(): Observable<IMODto[]>{
    return this.http.get<IMODto[]>(`${this.apiUrl}Imo/GetImos`, { withCredentials: true })
  }

  getODVReport(vesselId: number): Observable<any>{
    return this.http.get(`${this.apiUrl}ODV/GetOdvReportByVesselId/${vesselId}`, { withCredentials: true })
  }

  getODVReports(): Observable<any>{
    return this.http.get(`${this.apiUrl}ODV/GetOdvReports`, { withCredentials: true })
  }

  getODVNoonReports(): Observable<any>{
    return this.http.get(`${this.apiUrl}ODV/GetOdvNoonReports`, { withCredentials: true })
  }

  updateVessel(vessel: VesselData): Observable<any> {
    return this.http.put(`${this.apiUrl}Vessel/UpdateVessel/${vessel.id}`, vessel, { withCredentials: true });
  }

  createVessel(vessel: VesselData): Observable<any> {
    return this.http.post(`${this.apiUrl}Vessel/AddVessel`, vessel, { withCredentials: true });
  }

  createODVReport(odvReport: odvReportCreateDto): Observable<any> {
    return this.http.post(`${this.apiUrl}ODV/AddOdvReport`, odvReport, { withCredentials: true })
  }

  addODVNoonReport(noonReport: ODVNoonReportData): Observable<any> {
    return this.http.post(`${this.apiUrl}ODV/AddOdvNoonReport`, noonReport, { withCredentials: true })
  }

  deleteVesselById(vesselId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}Vessel/DeleteVessel/${vesselId}`, { withCredentials: true });
  }

  deleteODVReport(odvReportId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}ODV/DeleteOdvReport/${odvReportId}`, { withCredentials: true });
  }

}
