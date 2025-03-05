import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environment";
import {Technology} from "../interfaces/technology";
import {DeveloperInterface} from "../interfaces/developer/developer.interface";
import {DeveloperRequestInterface} from "../interfaces/developer/developer-request.interface";
import { Page } from '../interfaces/general/page.interface';

@Injectable({
  providedIn: 'root'
})
export class DeveloperService {

  private apiUrl: string = `${environment.apiUrl}/Developer`

  constructor(private readonly httpClient: HttpClient) { }

  public getDevelopers(currentPage: number, pageSize: number): Observable<Page<DeveloperInterface>> {
    let params = new HttpParams()
      .set('currentPage', currentPage.toString())
      .set('pageSize', pageSize.toString())

    return this.httpClient.get<Page<DeveloperInterface>>(this.apiUrl + '/developers', {params})
  }

  public getDeveloper(developerId: string): Observable<DeveloperInterface> {
    return this.httpClient.get<DeveloperInterface>(this.apiUrl + `/${developerId}`)
  }

  public deleteDeveloper(developerId: string) {
    return this.httpClient.delete(`${this.apiUrl}/${developerId}`)
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

  public filterDevelopers(params: DeveloperRequestInterface | HttpParams): Observable<Page<DeveloperInterface>> {
    return this.httpClient.get<Page<DeveloperInterface>>(`${this.apiUrl}/search/developers`, { params: params as HttpParams });
  }
}
