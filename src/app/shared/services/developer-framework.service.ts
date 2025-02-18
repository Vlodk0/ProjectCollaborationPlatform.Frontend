import { Injectable } from '@angular/core';
import {environment} from "../../environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DeveloperFrameworkService {

  private apiUrl: string = `${environment.apiUrl}/Developer/Framework`;

  constructor(private readonly httpClient: HttpClient) {
  }

  public addFrameworksForDeveloper(frameworkIds: string[]): Observable<void> {
    return this.httpClient.post<void>(this.apiUrl, frameworkIds);
  }
}
