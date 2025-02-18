import { Injectable } from '@angular/core';
import {environment} from "../../environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ProjectRequestInterface} from "../interfaces/project/project-request.interface";

@Injectable({
  providedIn: 'root'
})
export class ProjectRequestService {

  private apiUrl = `${environment.apiUrl}/ProjectRequest`

  constructor(private httpClient: HttpClient) { }

  public createProjectRequest(projectId: string): Observable<void> {
    return  this.httpClient.post<void>(`${this.apiUrl}?projectId=${projectId}`, {})
  }

  public getProjectRequests(projectId: string): Observable<Array<ProjectRequestInterface>> {
    return this.httpClient.get<Array<ProjectRequestInterface>>(`${this.apiUrl}/project/${projectId}`)
  }

  public acceptProjectRequest(projectRequestId: string, projectId: string): Observable<void> {
    return this.httpClient.patch<void>(`${this.apiUrl}/accept/${projectRequestId}?projectId=${projectId}`, {})
  }

  public declineProjectRequest(projectRequestId: string, projectId: string): Observable<void> {
    return this.httpClient.patch<void>(`${this.apiUrl}/decline/${projectRequestId}?projectId=${projectId}`, {})
  }
}
