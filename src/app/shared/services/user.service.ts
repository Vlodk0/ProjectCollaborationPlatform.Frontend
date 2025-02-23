import { Injectable } from '@angular/core';
import {environment} from "../../environment";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {GetUser} from "../interfaces/get-user";
import {UpdateUserInfoInterface} from "../interfaces/user/update-user-info.interface";
import {PaginationFilter} from "../interfaces/pagination-filter";
import {PaginationResponse} from "../interfaces/pagination-response";
import {ProjectPagination} from "../interfaces/project-pagination";
import {FormGroup} from "@angular/forms";
import {UserInfoWithAvatar} from "../interfaces/user-info-with-avatar";
import {UpdateAddressInterface} from "../interfaces/user/update-address.interface";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl: string = `${environment.apiUrl}/User`

  private currentUserSubject$: BehaviorSubject<GetUser> = new BehaviorSubject(null);
  public currentUser$: Observable<GetUser> = this.currentUserSubject$.asObservable();

  constructor(private readonly httpClient: HttpClient) { }

  public getUser(): Observable<GetUser> {
    return this.httpClient.get<GetUser>(this.apiUrl);
  }

  public updateUser(user: UpdateUserInfoInterface): Observable<void> {
    return this.httpClient.patch<void>(this.apiUrl, user)
  }

  public getAllProjects(filter: PaginationFilter): Observable<PaginationResponse<ProjectPagination[]>> {
    let params = new HttpParams()
      .set('pageNumber', filter.pageNumber.toString())
      .set('pageSize', filter.pageSize.toString())
      .set('sortColumn', filter.sortColumn.toString())
      .set('sortDirection', (filter.sortDirection === 1) ? 'asc' : 'desc');

    return this.httpClient.get<PaginationResponse<ProjectPagination[]>>(this.apiUrl + `/projects`, {params});
  }

  public uploadAvatar(userAvatar: File) {
    let formData = new FormData();
    formData.append('avatar', userAvatar);

    const headers = new HttpHeaders()
      .append("Content-Disposition", 'multipart/form-data')

    return this.httpClient.post(this.apiUrl + '/photo', formData, {headers})
  }

  public getUserWithAvatar(): Observable<UserInfoWithAvatar> {
    return this.httpClient.get<UserInfoWithAvatar>(this.apiUrl + `/user`);
  }

  public getAvatar(avatarName: string) {
    return this.httpClient.get(this.apiUrl + `/${avatarName}`, {responseType: "blob"})
  }

  public initUser(user: GetUser): void {
    this.currentUserSubject$.next(user);
  }

  public updateAddress(updateUserAddress: UpdateAddressInterface): Observable<void> {
    return this.httpClient.patch<void>(this.apiUrl + '/address', updateUserAddress)
  }
}
