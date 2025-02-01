import { Injectable } from '@angular/core';
import {environment} from "../../environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Technology} from "../interfaces/technology";
import {CountTechnologyOnProjects} from "../interfaces/count-technology-on-projects";
import {TechnologyInterface} from "../interfaces/project/technology.interface";

@Injectable({
  providedIn: 'root'
})
export class TechnologyService {

  private apiUrl: string = `${environment.apiUrl}/Technology`

  constructor(private readonly httpClient: HttpClient) { }

  public getAllTechnologies(): Observable<TechnologyInterface[]> {
    return this.httpClient.get<TechnologyInterface[]>(this.apiUrl);
  }

  public getAllProjectTechnologies(projectId: string): Observable<Technology[]> {
    return this.httpClient.get<Technology[]>(this.apiUrl + `/${projectId}`)
  }

  public getTechnologyStatisticByProjects(): Observable<CountTechnologyOnProjects[]> {
    return this.httpClient.get<CountTechnologyOnProjects[]>(this.apiUrl + '/statistic')
  }
}
