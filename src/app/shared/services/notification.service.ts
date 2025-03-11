import {Injectable} from '@angular/core';
import {environment} from "../../environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Page} from "../interfaces/general/page.interface";
import {NotificationInterface} from "../interfaces/notification.interface";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = `${environment.apiUrl}/Notification`;

  constructor(private httpClient: HttpClient) {
  }

  public getNotifications(
    developerId?: string,
    projectOwnerId?: string,
    currentPage: number = 0,
    pageSize: number = 20
  ): Observable<Page<NotificationInterface>> {

    const params: any = {}

    if (developerId) {
      params.developerId = developerId;
    }
    if (projectOwnerId) {
      params.projectOwnerId = projectOwnerId;
    }

    params.currentPage = currentPage.toString();
    params.pageSize = pageSize.toString();

    return this.httpClient.get<Page<NotificationInterface>>(`${this.apiUrl}/notifications`, {params});
  }

  public updateNotifications(
    notificationIds: string[],
    developerId?: string,
    projectOwnerId?: string
  ): Observable<void> {
    const params: any = {};

    if (projectOwnerId) {
      params.projectOwnerId = projectOwnerId;
    }

    return this.httpClient.patch<void>(`${this.apiUrl}`, {notificationIds}, {params});
  }

  public deleteNotification(notificationId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${notificationId}`);
  }
}
