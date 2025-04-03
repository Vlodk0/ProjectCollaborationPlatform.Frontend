import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environment";
import {CreateProjectInterface} from "../interfaces/project/create-project.interface";
import {ProjectInterface} from "../interfaces/project/project.interface";
import {DeveloperInterface} from "../interfaces/developer/developer.interface";
import {FilterProjectRequestInterface} from "../interfaces/project/filter-project-request.interface";
import {Page} from "../interfaces/general/page.interface";
import {ScheduleProjectInterface} from "../interfaces/project/schedule-project.interface";

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private apiUrl: string = `${environment.apiUrl}/Project`

  constructor(private readonly httpClient: HttpClient) {
  }

  public getProjects(currentPage: number, pageSize: number): Observable<Page<ProjectInterface>> {
    let params = new HttpParams()
      .set('currentPage', currentPage.toString())
      .set('pageSize', pageSize.toString())

    return this.httpClient.get<Page<ProjectInterface>>(`${this.apiUrl}/projects`, {params});
  }

  public getProjectOwnerProjects(currentPage: number, pageSize: number): Observable<Page<ProjectInterface>> {
    let params = new HttpParams()
      .set('currentPage', currentPage.toString())
      .set('pageSize', pageSize.toString())

    return this.httpClient.get<Page<ProjectInterface>>(`${this.apiUrl}/myProjects`, {params});
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

  public filterProjects(params: FilterProjectRequestInterface | HttpParams): Observable<Page<ProjectInterface>> {
    return this.httpClient.get<Page<ProjectInterface>>(`${this.apiUrl}/search/projects`, { params: params as HttpParams });
  }

  public filterProjectOwnerProjects(params: FilterProjectRequestInterface | HttpParams): Observable<Page<ProjectInterface>> {
    return this.httpClient.get<Page<ProjectInterface>>(`${this.apiUrl}/search/projectOwner/projects`, { params: params as HttpParams });
  }

  public filterDeveloperProjects(params: FilterProjectRequestInterface | HttpParams): Observable<Page<ProjectInterface>> {
    return this.httpClient.get<Page<ProjectInterface>>(`${this.apiUrl}/search/developer/projects`, { params: params as HttpParams });
  }

  public pauseProject(projectId: string): Observable<void> {
    return this.httpClient.patch<void>(`${this.apiUrl}/${projectId}/pause`, {});
  }

  public scheduleProject(projectId: string, request: ScheduleProjectInterface): Observable<void> {
    return this.httpClient.patch<void>(`${this.apiUrl}/${projectId}/schedule`, request);
  }
}
