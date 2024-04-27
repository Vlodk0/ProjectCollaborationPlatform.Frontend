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

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private apiUrl: string = `${environment.apiUrl}/Project`

  constructor(private readonly httpClient: HttpClient) {
  }

  public getAllProjects(filter: PaginationFilter): Observable<PaginationResponse<ProjectPagination[]>> {
    let params = new HttpParams()
      .set('pageNumber', filter.pageNumber.toString())
      .set('pageSize', filter.pageSize.toString())
      .set('sortColumn', filter.sortColumn.toString())
      .set('sortDirection', (filter.sortDirection === 1) ? 'asc' : 'desc');

    return this.httpClient.get<PaginationResponse<ProjectPagination[]>>(this.apiUrl, {params});
  }

  public getProjectById(projectId: string): Observable<ProjectInfo> {
    return this.httpClient.get<ProjectInfo>(this.apiUrl + `/${projectId}`)
  }

  public getAllProjectsByProjectOwner(filter: PaginationFilter): Observable<PaginationResponse<ProjectPagination[]>> {
    let params = new HttpParams()
      .set('pageNumber', filter.pageNumber.toString())
      .set('pageSize', filter.pageSize.toString())
      .set('sortColumn', filter.sortColumn.toString())
      .set('sortDirection', (filter.sortDirection === 1) ? 'asc' : 'desc');

    return this.httpClient.get<PaginationResponse<ProjectPagination[]>>(this.apiUrl + `/my-projects`, {params});
  }

  public getProjectOwnerProjects(): Observable<ProjectInfo[]> {
    return this.httpClient.get<ProjectInfo[]>(this.apiUrl + '/projectOwner/projects');
  }

  public addDevelopersOnProject(projectId: string, devId: string[]) {
    return this.httpClient.post(this.apiUrl + `/developers/${projectId}`, devId)
  }

  public createProject(projectObj: CreateProject): Observable<CreateProject> {
    return this.httpClient.post<CreateProject>(this.apiUrl, projectObj)
  }

  public addTechnologiesForProject(projId: string, techId: string[]) {
    return this.httpClient.post(this.apiUrl + `/technologies/${projId}`, techId)
  }

  public removeTechnologyFromProject(projId: string, techId: string[]) {
    const options = {
      body: techId
    }
    return this.httpClient.delete(this.apiUrl + `/technologies/${projId}`, options)
  }

  public updateProject(projId: string, projObj: UpdateProject) {
    return this.httpClient.put(this.apiUrl + `/${projId}`, projObj)
  }

  public updateProjectDetails(projId: string, description: ProjectDetail) {
    return this.httpClient.put(this.apiUrl + `/ProjectDetails/${projId}`, description)
  }

  public deleteProject(id: string) {
    return this.httpClient.delete(this.apiUrl + `/${id}`)
  }
}
