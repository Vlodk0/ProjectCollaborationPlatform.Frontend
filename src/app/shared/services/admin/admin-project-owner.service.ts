import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {AdminGetUsersRequestInterface} from "../../interfaces/admin/developers/admin-get-users-request.interface";
import {Observable} from "rxjs";
import {AdminProjectOwnerDataInterface} from "../../interfaces/admin/project-owners/admin-project-owner-data.interface";
import {Page} from "../../interfaces/general/page.interface";
import {AdminProjectDataInterface} from "../../interfaces/admin/projects/admin-project-data.interface";
import {FeedbackInterface} from "../../interfaces/feedback/feedback.interface";
import {AdminFeedbackDataInterface} from "../../interfaces/admin/project-owners/admin-feedback-data.interface";

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
    return this.httpClient.get<AdminProjectOwnerDataInterface>(`${this.apiUrl}/projectOwners/${projectOwnerId}`)
  }

  public getProjectOwnerProjects(projectOwnerId: string, currentPage: number, pageSize: number): Observable<Page<AdminProjectDataInterface>> {
    return this.httpClient.get<Page<AdminProjectDataInterface>>(`${this.apiUrl}/projectOwners/${projectOwnerId}/projects?currentPage=${currentPage}&pageSize=${pageSize}`)
  }

  public getProjectOwnerFeedbacks(projectOwnerId: string, currentPage: number, pageSize: number): Observable<Page<AdminFeedbackDataInterface>> {
    return this.httpClient.get<Page<AdminFeedbackDataInterface>>(`${this.apiUrl}/projectOwners/${projectOwnerId}/feedbacks?currentPage=${currentPage}&pageSize=${pageSize}`);
  }
}
