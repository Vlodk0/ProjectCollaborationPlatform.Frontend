import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {PaginationResponse} from "../interfaces/pagination-response";
import {PaginationDeveloper} from "../interfaces/pagination-developer";
import {environment} from "../../environment";
import {PaginationFilterDevs} from "../interfaces/pagination-filter-devs";

@Injectable({
  providedIn: 'root'
})
export class DeveloperService {

  private apiUrl: string = `${environment.apiUrl}/Developer/developers`

  constructor(private readonly httpClient: HttpClient) { }

  public getAllDevelopers(filter: PaginationFilterDevs): Observable<PaginationResponse<PaginationDeveloper[]>> {
    let params = new HttpParams()
      .set('pageNumber', filter.pageNumber.toString())
      .set('pageSize', filter.pageSize.toString());

    return this.httpClient.get<PaginationResponse<PaginationDeveloper[]>>(this.apiUrl, {params})
  }
}