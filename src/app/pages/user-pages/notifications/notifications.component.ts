import {Component, OnDestroy, OnInit} from '@angular/core';
import {NotificationService} from "../../../shared/services/notification.service";
import {SnackBarService} from "../../../shared/services/snack-bar.service";
import {SpinnerService} from "../../../shared/services/spinner.service";
import {finalize, Subject, takeUntil, tap} from "rxjs";
import {UserService} from "../../../shared/services/user.service";
import {GetUser} from "../../../shared/interfaces/get-user";
import {ApplicationRoleEnum} from "../../../core/enums/application-role.enum";
import {NotificationInterface} from "../../../shared/interfaces/notification.interface";
import {AlertsService} from "../../../shared/services/alerts.service";

@Component({
  selector: 'collabro-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit, OnDestroy {
  public user: GetUser;
  public isLoadingNotifications = true;
  public notifications: NotificationInterface[] = [];
  public totalNotifications: number = 0;
  public readNotifications: string[] = [];

  private notificationsCurrentPage: number = 0;

  private readonly unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly notificationService: NotificationService,
              private readonly snackBarService: SnackBarService,
              private readonly alertService: AlertsService,
              private readonly spinnerService: SpinnerService,
              private readonly userService: UserService) {
  }

  ngOnInit(): void {
    this.subscribeToCurrentUser();
    this.getNotifications();
    this.subscribeToAlertInfo();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    this.alertService.setAlertInfo(null);
  }

  private subscribeToCurrentUser(): void {
    this.userService.currentUser$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: user => {
          this.user = user;
        }
      });
  }

  public loadData(): void {
    if (this.totalNotifications > this.notifications.length && !this.isLoadingNotifications) {
      this.notificationsCurrentPage = this.notifications.length;
      this.getNotifications();
    }
  }

  private getNotifications(): void {
    this.spinnerService.showSpinner();
    this.isLoadingNotifications = true;

    const request$ = this.user?.roleName === ApplicationRoleEnum.Dev
      ? this.notificationService.getNotifications(this.user?.id, null, this.notificationsCurrentPage, 20)
      : this.notificationService.getNotifications(null, this.user?.id, this.notificationsCurrentPage, 20);

    request$
      .pipe(
        tap((notification) => {
          if (!this.notifications?.length) {
            this.alertService.setAlertInfo(notification?.items[0]);
          }
        }),
        finalize(() => {
          this.isLoadingNotifications = false;
          this.spinnerService.hideSpinner();
        }),

        takeUntil(this.unsubscribe$)
      )
      .subscribe({
        next: result => {
          this.notifications = this.notifications?.length
            ? this.notifications.concat(result.items)
            : result.items;

          this.totalNotifications = result.total;
        },
        error: (error) => this.snackBarService.showErrorNotification(error?.error?.detail)
      });
  }

  public updateNotifications(): void {
    if (this.readNotifications.length) {

      const request$ = this.user?.roleName === ApplicationRoleEnum.Dev
        ? this.notificationService.updateNotifications(this.readNotifications, this.user?.id, null)
        : this.notificationService.updateNotifications(this.readNotifications, null, this.user?.id)

      request$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: () => {
            if (this.readNotifications.length === 1) {
              const index = this.notifications.findIndex(element => element.id === this.readNotifications[0]);
              if (index !== -1) {
                this.notifications[index].delivered = true;
              }
            } else {
              this.notifications.forEach(element => {
                element.delivered = true;
              });
            }
            this.alertService.setNewAlert(null);
          },
          error: (error) => this.snackBarService.showErrorNotification(error?.error?.detail)
        });
    }
  }

  public readAllAlerts(): void {
    this.readNotifications = [];
    this.notifications.forEach(
      (element) => {
        if (!element.delivered) {
          this.readNotifications.push(element.id);
        }
      }
    );

    this.updateNotifications();
  }

  private subscribeToAlertInfo(): void {
    this.alertService.getAlertInfo()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
        next: (alert) => {
          if (alert?.id && !alert?.delivered) {
            this.readNotifications = [];
            this.readNotifications.push(alert.id);
            this.updateNotifications();
          }
        }
      });
  }
}
