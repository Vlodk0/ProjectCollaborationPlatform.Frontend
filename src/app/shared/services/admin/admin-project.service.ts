import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Page} from "../../interfaces/general/page.interface";
import {AdminGetProjectsRequestInterface} from "../../interfaces/admin/projects/admin-get-projects-request.interface";
import {AdminProjectDataInterface} from "../../interfaces/admin/projects/admin-project-data.interface";

@Injectable({
  providedIn: 'root'
})
export class AdminProjectService {

  private apiUrl: string = `${environment.apiUrl}/AdminProject`;

  constructor(private readonly httpClient: HttpClient) { }

  public getProjects(request: AdminGetProjectsRequestInterface): Observable<Page<AdminProjectDataInterface>> {
    return this.httpClient.post<Page<AdminProjectDataInterface>>(`${this.apiUrl}/projects`, request)
  }
}
