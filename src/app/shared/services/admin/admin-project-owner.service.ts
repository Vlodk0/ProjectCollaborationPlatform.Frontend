import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {AdminGetUsersRequestInterface} from "../../interfaces/admin/developers/admin-get-users-request.interface";
import {Observable} from "rxjs";
import {AdminProjectOwnerDataInterface} from "../../interfaces/admin/project-owners/admin-project-owner-data.interface";
import {Page} from "../../interfaces/general/page.interface";

@Injectable({
  providedIn: 'root'
})
export class AdminProjectOwnerService {

  private apiUrl: string = `${environment.apiUrl}/AdminProjectOwner`

  constructor(private readonly httpClient: HttpClient) { }

  public getProjectOwners(request: AdminGetUsersRequestInterface): Observable<Page<AdminProjectOwnerDataInterface>> {
    return this.httpClient.post<Page<AdminProjectOwnerDataInterface>>(`${this.apiUrl}/project-owners`, request)
  }

  public getProjectOwner(projectOwnerId: string): Observable<AdminProjectOwnerDataInterface> {
    return this.httpClient.get<AdminProjectOwnerDataInterface>(`${this.apiUrl}/project-owners`)
  }
}
