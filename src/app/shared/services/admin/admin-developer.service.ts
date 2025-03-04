import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {AdminGetUsersRequestInterface} from "../../interfaces/admin/developers/admin-get-users-request.interface";
import {Observable} from "rxjs";
import {PageAdminDeveloperDataInterface} from "../../interfaces/admin/developers/page-admin-developer-data.interface";
import {AdminDeveloperDataInterface} from "../../interfaces/admin/developers/admin-developer-data.interface";

@Injectable({
  providedIn: 'root'
})
export class AdminDeveloperService {

  private apiUrl: string = `${environment.apiUrl}/AdminDeveloper`

  constructor(private readonly httpClient: HttpClient) { }

  public getDevelopers(request: AdminGetUsersRequestInterface): Observable<PageAdminDeveloperDataInterface> {
    return this.httpClient.post<PageAdminDeveloperDataInterface>(`${this.apiUrl}/developers`, request)
  }

  public getDeveloper(developerId: string): Observable<AdminDeveloperDataInterface> {
    return this.httpClient.get<AdminDeveloperDataInterface>(`${this.apiUrl}/${developerId}`)
  }
}
