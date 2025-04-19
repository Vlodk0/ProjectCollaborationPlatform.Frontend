import { Injectable } from '@angular/core';
import {environment} from "../../environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Page} from "../interfaces/general/page.interface";
import {FeedbackInterface} from "../interfaces/feedback/feedback.interface";

@Injectable({
  providedIn: 'root'
})
export class ProjectOwnerFeedbackService {

  private apiUrl: string = `${environment.apiUrl}/ProjectOwnerFeedback`;

  constructor(private httpClient: HttpClient) {
  }

  public getAllProjectOwnerFeedbacks(projectOwnerId: string): Observable<Array<FeedbackInterface>> {
    return this.httpClient.get<Array<FeedbackInterface>>(`${this.apiUrl}?projectOwnerId=${projectOwnerId}`);
  }

  public addFeedback(projectOwnerId: string, message: string): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/${projectOwnerId}`, {message: message});
  }

  public editFeedback(id: string, message: string): Observable<void> {
    return this.httpClient.patch<void>(`${this.apiUrl}/${id}`, {message: message});
  }

  public deleteFeedback(id: string): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/${id}`);
  }
}
