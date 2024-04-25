import { Injectable } from '@angular/core';
import {environment} from "../../environment";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {GetUser} from "../interfaces/get-user";
import {UpdateUser} from "../interfaces/update-user";
import {PaginationFilter} from "../interfaces/pagination-filter";
import {PaginationResponse} from "../interfaces/pagination-response";
import {ProjectPagination} from "../interfaces/project-pagination";
import {FormGroup} from "@angular/forms";
import {UserInfoWithAvatar} from "../interfaces/user-info-with-avatar";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl: string = `${environment.apiUrl}/User`

  constructor(private readonly httpClient: HttpClient) { }

  public getUser(): Observable<GetUser> {
    return this.httpClient.get<GetUser>(this.apiUrl);
  }

  public updateUser(user: UpdateUser) {
    return this.httpClient.patch<UpdateUser>(this.apiUrl, user)
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
}
