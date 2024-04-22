import { Injectable } from '@angular/core';
import {environment} from "../../environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {PaginationFilterDevs} from "../interfaces/pagination-filter-devs";
import {Observable} from "rxjs";
import {PaginationResponse} from "../interfaces/pagination-response";
import {ProjectOwnerPagination} from "../interfaces/project-owner-pagination";

@Injectable({
  providedIn: 'root'
})
export class ProjectOwnerService {

  private apiUrl = `${environment.apiUrl}/ProjectOwner`

  constructor(private httpClient: HttpClient) { }

  public getAllProjectOwners(filter: PaginationFilterDevs): Observable<PaginationResponse<ProjectOwnerPagination[]>> {
    let params = new HttpParams()
      .set('pageNumber', filter.pageNumber.toString())
      .set('pageSize', filter.pageSize.toString());

    return this.httpClient.get<PaginationResponse<ProjectOwnerPagination[]>>(this.apiUrl + '/projectOwners', {params})
  }

  public deleteProjectOwner(id: string) {
    return this.httpClient.delete(this.apiUrl + `/${id}`)
  }
}
