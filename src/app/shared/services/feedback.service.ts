import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environment";
import {GetFeedback} from "../interfaces/get-feedback";
import {Feedback} from "../interfaces/feedback";
import {PaginationFilterDevs} from "../interfaces/pagination-filter-devs";
import {PaginationResponse} from "../interfaces/pagination-response";

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  private apiUrl: string = `${environment.apiUrl}/Feedback`

  constructor(private httpClient: HttpClient) {
  }


  public getAllDeveloperFeedback(devId: string, filter: PaginationFilterDevs): Observable<PaginationResponse<GetFeedback[]>> {
    let params = new HttpParams()
      .set('pageNumber', filter.pageNumber.toString())
      .set('pageSize', filter.pageSize.toString());
    return this.httpClient.get<PaginationResponse<GetFeedback[]>>(this.apiUrl + `/${devId}`, {params})
  }

  public addFeedback(devId: string, feedbackObj: Feedback) {
    return this.httpClient.post(this.apiUrl + `/${devId}`, feedbackObj)
  }

  public getAllFeedbackForCurrentDeveloper(filter: PaginationFilterDevs): Observable<PaginationResponse<GetFeedback[]>> {
    let params = new HttpParams()
      .set('pageNumber', filter.pageNumber.toString())
      .set('pageSize', filter.pageSize.toString());

    return this.httpClient.get<PaginationResponse<GetFeedback[]>>(this.apiUrl, {params})
  }
}
