import { Injectable } from '@angular/core';
import {environment} from "../../environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {FrameworkInterface} from "../interfaces/project/framework.interface";

@Injectable({
  providedIn: 'root'
})
export class FrameworkService {

  private apiUrl: string = `${environment.apiUrl}/Framework`;

  constructor(private readonly httpClient: HttpClient) { }

  public getAllFrameworks(): Observable<FrameworkInterface[]> {
    return this.httpClient.get<FrameworkInterface[]>(this.apiUrl);
  }
}
