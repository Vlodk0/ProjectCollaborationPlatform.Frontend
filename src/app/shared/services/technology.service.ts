import { Injectable } from '@angular/core';
import {environment} from "../../environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Technology} from "../interfaces/technology";

@Injectable({
  providedIn: 'root'
})
export class TechnologyService {

  private apiUrl: string = `${environment.apiUrl}/Technology`

  constructor(private readonly httpClient: HttpClient) { }

  public getAllTechnologies(): Observable<Technology[]> {
    return this.httpClient.get<Technology[]>(this.apiUrl);
  }

  public getAllProjectTechnologies(projectId: string): Observable<Technology[]> {
    return this.httpClient.get<Technology[]>(this.apiUrl + `/${projectId}`)
  }
}
