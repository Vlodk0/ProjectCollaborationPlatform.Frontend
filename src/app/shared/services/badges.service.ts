import {Injectable} from '@angular/core';
import {environment} from "../../environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {BadgesInterface} from "../interfaces/badges.interface";

@Injectable({
  providedIn: 'root'
})
export class BadgesService {

  private apiUrl = `${environment.apiUrl}/Badges`;

  constructor(private httpClient: HttpClient) {
  }

  public getDeveloperBadges(developerId: string): Observable<BadgesInterface> {
    return this.httpClient.get<BadgesInterface>(`${this.apiUrl}/developer/${developerId}`);
  }

  public getProjectOwnerBadges(projectOwnerId: string): Observable<BadgesInterface> {
    return this.httpClient.get<BadgesInterface>(`${this.apiUrl}/projectOwner/${projectOwnerId}`);
  }
}
