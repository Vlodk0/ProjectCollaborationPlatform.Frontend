import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environment";
import {
  GetDashboardAggregationDataRequestInterface
} from "../../interfaces/admin/dashboard/get-dashboard-aggregation-data-request.interface";
import {Observable} from "rxjs";
import {DashboardAggregationDataInterface} from "../../interfaces/admin/dashboard/dashboard-aggregation-data.interface";

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {

  private apiUrl: string = `${environment.apiUrl}/AdminDashboard`

  constructor(private readonly httpClient: HttpClient) { }

  public searchDashboardAggregation(request: GetDashboardAggregationDataRequestInterface): Observable<DashboardAggregationDataInterface> {
    return this.httpClient.post<DashboardAggregationDataInterface>(`${this.apiUrl}/search`, request)
  }
}
