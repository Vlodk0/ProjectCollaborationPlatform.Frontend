import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {PaginationFilter} from "../interfaces/pagination-filter";
import {Observable} from "rxjs";
import {PaginationResponse} from "../interfaces/pagination-response";
import {ProjectPagination} from "../interfaces/project-pagination";
import {environment} from "../../environment";
import {ProjectInfo} from "../interfaces/project-info";

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private apiUrl: string = `${environment.apiUrl}/Project`

  constructor(private readonly httpClient: HttpClient) { }

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
}
