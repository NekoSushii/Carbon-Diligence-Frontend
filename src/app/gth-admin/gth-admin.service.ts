import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, from } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { ApplicationDto, IMODto, OrganizationDto, SubscriptionDto, UserDataDto } from './gth-admin.component';

@Injectable({
  providedIn: 'root'
})
export class GthAdminService {
  private apiUrl = 'http://localhost:5206/api';

  constructor(private http: HttpClient) {}

  getUsersData(): Observable<UserDataDto[]> {
    return this.http.get<UserDataDto[]>(`${this.apiUrl}/abs/User/GetUsers`, { withCredentials: true });
  }

  getOrganizations(): Observable<OrganizationDto[]> {
    return this.http.get<OrganizationDto[]>(`${this.apiUrl}/abs/User/GetOrganizations`, { withCredentials: true });
  }

  getSubscriptions(): Observable<SubscriptionDto[]> {
    return this.http.get<SubscriptionDto[]>(`${this.apiUrl}/abs/User/GetSubscriptions`, { withCredentials: true });
  }

  getApplications(): Observable<ApplicationDto[]> {
    return this.http.get<ApplicationDto[]>(`${this.apiUrl}/abs/User/GetApplications`, { withCredentials: true });
  }

  getImoByOrganization(organizationId: number): Observable<IMODto[]> {
    return this.http.get<IMODto[]>(`${this.apiUrl}/Imo/GetImos`, { withCredentials: true });
  }

  loadAllData(): Observable<{
    usersData: UserDataDto[],
    organizationsData: OrganizationDto[],
    subscriptionsData: SubscriptionDto[],
    applicationsData: ApplicationDto[],
  }> {
    return forkJoin({
      usersData: this.getUsersData(),
      organizationsData: this.getOrganizations(),
      subscriptionsData: this.getSubscriptions(),
      applicationsData: this.getApplications(),
    });
  }

  updateOrganizations(changedOrganizations: OrganizationDto[]): Observable<any> {
    return from(changedOrganizations).pipe(
      concatMap(org =>
        this.http.put(`${this.apiUrl}/abs/User/UpdateOrganization`, org, { withCredentials: true })
      )
    );
  }

  updateOrganization(id: number, organization: OrganizationDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/abs/User/UpdateOrganization`, organization, { withCredentials: true });
  }

  updateUser(user: UserDataDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/abs/User/UpdateUser`, user, { withCredentials: true });
  }

  updateSubscriptions(changedSubscriptions: SubscriptionDto[]): Observable<any> {
    return from(changedSubscriptions).pipe(
      concatMap(subscription =>
        this.http.put(`${this.apiUrl}/abs/User/UpdateSubscription`, subscription, { withCredentials: true })
      )
    );
  }

  updateSubscription(id: number, subscription: SubscriptionDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/abs/User/UpdateSubscription`, subscription, { withCredentials: true });
  }

  createSubscription(subscription: SubscriptionDto): Observable<SubscriptionDto> {
    return this.http.post<SubscriptionDto>(`${this.apiUrl}/abs/User/AddSubscription`, subscription, { withCredentials: true });
  }

  createOrganization(organization: OrganizationDto): Observable<OrganizationDto> {
    return this.http.post<OrganizationDto>(`${this.apiUrl}/abs/User/AddOrganization`, organization, { withCredentials: true });
  }

  createImo(organizationId: number, IMOData: IMODto): Observable<number> { // In the future, change to support organization
    return this.http.post<number>(`${this.apiUrl}/Imo/AddImo`, IMOData, { withCredentials: true });
  }

  deleteImo(organizationId: number, IMOId: number): Observable<number> { // In the future, change to support organization
    return this.http.delete<number>(`${this.apiUrl}/Imo/DeleteImo/${IMOId}`, { withCredentials: true });
  }

  deleteSubscription(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/abs/User/DeleteSubscription/${id}`, { withCredentials: true });
  }

}
