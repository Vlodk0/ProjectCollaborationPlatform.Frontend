import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {PaginationFilter} from "../interfaces/pagination-filter";
import {Observable} from "rxjs";
import {PaginationResponse} from "../interfaces/pagination-response";
import {ProjectPagination} from "../interfaces/project-pagination";
import {environment} from "../../environment";
import {ProjectInfo} from "../interfaces/project-info";
import {CreateProject} from "../interfaces/create-project";
import {UpdateProject} from "../interfaces/update-project";
import {ProjectDetail} from "../interfaces/project-detail";
import {CreateProjectInterface} from "../interfaces/project/create-project.interface";
import {PageProjectInterface} from "../interfaces/project/page-project.interface";
import {ProjectInterface} from "../interfaces/project/project.interface";
import {DeveloperInterface} from "../interfaces/developer/developer.interface";

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private apiUrl: string = `${environment.apiUrl}/Project`

  constructor(private readonly httpClient: HttpClient) {
  }

  public getProjects(currentPage: number, pageSize: number): Observable<PageProjectInterface> {
    let params = new HttpParams()
      .set('currentPage', currentPage.toString())
      .set('pageSize', pageSize.toString())

    return this.httpClient.get<PageProjectInterface>(`${this.apiUrl}/projects`, {params});
  }

  public getProjectOwnerProjects(currentPage: number, pageSize: number): Observable<PageProjectInterface> {
    let params = new HttpParams()
      .set('currentPage', currentPage.toString())
      .set('pageSize', pageSize.toString())

    return this.httpClient.get<PageProjectInterface>(`${this.apiUrl}/myProjects`, {params});
  }

  public getProjectById(projectId: string): Observable<ProjectInterface> {
    return this.httpClient.get<ProjectInterface>(this.apiUrl + `/${projectId}`)
  }

  public addDevelopersOnProject(projectId: string, devId: string[]) {
    return this.httpClient.post(this.apiUrl + `/developers/${projectId}`, devId)
  }

  public createProject(projectObj: CreateProjectInterface): Observable<void> {
    return this.httpClient.post<void>(this.apiUrl, projectObj)
  }

  public deleteProject(id: string) {
    return this.httpClient.delete(this.apiUrl + `/${id}`)
  }

  public addDeveloperToProject(projectId: string, devId: string[]): Observable<void> {
    return this.httpClient.post<void>(this.apiUrl + `/${projectId}/developers`, devId)
  }

  public getProjectDevelopers(projectId: string): Observable<Array<DeveloperInterface>> {
    return this.httpClient.get<Array<DeveloperInterface>>(`${this.apiUrl}/${projectId}/developers`)
  }

  public removeDeveloperFromProject(projectId: string, developerId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${projectId}/developers?developerId=${developerId}`)
  }
}
