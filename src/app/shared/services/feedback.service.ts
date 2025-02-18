import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environment";
import {GetFeedback} from "../interfaces/get-feedback";
import {Feedback} from "../interfaces/feedback";
import {PaginationFilterDevs} from "../interfaces/pagination-filter-devs";
import {PaginationResponse} from "../interfaces/pagination-response";
import {PageFeedbackInterface} from "../interfaces/feedback/page-feedback.interface";

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  private apiUrl: string = `${environment.apiUrl}/Feedback`;

  constructor(private httpClient: HttpClient) {
  }

  public getAllDeveloperFeedback(developerId: string, currentPage: number, pageSize: number): Observable<PageFeedbackInterface> {
    return this.httpClient.get<PageFeedbackInterface>(`${this.apiUrl}?developerId=${developerId}&currentPage=${currentPage}&pageSize=${pageSize}`);
  }

  public addFeedback(devId: string, message: string): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/${devId}`, {message: message});
  }

  public editFeedback(id: string, message: string): Observable<void> {
    return this.httpClient.patch<void>(`${this.apiUrl}/${id}`, {message: message});
  }
  public getAllFeedbacks(filter: PaginationFilterDevs): Observable<PaginationResponse<GetFeedback[]>> {
    const params = new HttpParams()
      .set('pageNumber', filter.pageNumber.toString())
      .set('pageSize', filter.pageSize.toString());
    return this.httpClient.get<PaginationResponse<GetFeedback[]>>(`${this.apiUrl}/feedbacks`, {params});
  }

  public deleteFeedback(id: string): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/${id}`);
  }

  public getAllFeedbackForCurrentDeveloper(filter: PaginationFilterDevs): Observable<PaginationResponse<GetFeedback[]>> {
    const params = new HttpParams()
      .set('pageNumber', filter.pageNumber.toString())
      .set('pageSize', filter.pageSize.toString());
    return this.httpClient.get<PaginationResponse<GetFeedback[]>>(this.apiUrl, {params});
  }
}
