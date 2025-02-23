import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {PaginationResponse} from "../interfaces/pagination-response";
import {PaginationDeveloper} from "../interfaces/pagination-developer";
import {environment} from "../../environment";
import {PaginationFilterDevs} from "../interfaces/pagination-filter-devs";
import {Technology} from "../interfaces/technology";
import {PageDeveloperInterface} from "../interfaces/developer/page-developer.interface";
import {DeveloperInterface} from "../interfaces/developer/developer.interface";

@Injectable({
  providedIn: 'root'
})
export class DeveloperService {

  private apiUrl: string = `${environment.apiUrl}/Developer`

  constructor(private readonly httpClient: HttpClient) { }

  public getDevelopers(currentPage: number, pageSize: number): Observable<PageDeveloperInterface> {
    let params = new HttpParams()
      .set('currentPage', currentPage.toString())
      .set('pageSize', pageSize.toString())

    return this.httpClient.get<PageDeveloperInterface>(this.apiUrl + '/developers', {params})
  }

  public getDeveloper(developerId: string): Observable<DeveloperInterface> {
    return this.httpClient.get<DeveloperInterface>(this.apiUrl + `/${developerId}`)
  }

  public deleteDeveloper(id: string) {
    return this.httpClient.delete(this.apiUrl + `/${id}`)
  }

  public addTechnologyForDev(techId: string[]) {
    return this.httpClient.post(this.apiUrl + '/Technologies', techId)
  }

  public getAllDeveloperTechnologies(): Observable<Technology[]> {
    return this.httpClient.get<Technology[]>(this.apiUrl + '/Technologies')
  }

  public getAllDevTechnologies(devId: string): Observable<Technology[]> {
    return this.httpClient.get<Technology[]>(this.apiUrl + `/Technologies/dev/${devId}`)
  }
}
