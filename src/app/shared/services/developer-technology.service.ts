import {Injectable} from '@angular/core';
import {environment} from "../../environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DeveloperTechnologyService {

  private apiUrl: string = `${environment.apiUrl}/Developer/Technologies`;

  constructor(private readonly httpClient: HttpClient) {
  }

  public addTechnologyForDeveloper(technologyIds: string[]): Observable<void> {
    return this.httpClient.post<void>(this.apiUrl, technologyIds);
  }

  public addFrameworksForDeveloper(frameworkIds: string[]): Observable<void> {
    return this.httpClient.post<void>(this.apiUrl, frameworkIds);
  }
}
