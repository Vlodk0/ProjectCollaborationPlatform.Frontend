import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {NotificationInterface} from "../interfaces/notification.interface";

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  private alertInfo$: BehaviorSubject<NotificationInterface> = new BehaviorSubject(null);
  private newAlert$: Subject<NotificationInterface> = new Subject();


  public setAlertInfo(alert: NotificationInterface): void {
    this.alertInfo$.next(alert)
  }

  public getAlertInfo(): Observable<NotificationInterface> {
    return this.alertInfo$
  }

  public setNewAlert(alert: NotificationInterface): void {
    debugger
    this.newAlert$.next(alert)
  }

  public getNewAlert(): Observable<NotificationInterface> {
    return this.newAlert$
  }
}
