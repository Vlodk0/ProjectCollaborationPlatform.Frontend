import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {finalize, Subject, takeUntil} from "rxjs";
import {SpinnerService} from "../../../../shared/services/spinner.service";
import {NotificationService} from "../../../../shared/services/notification.service";
import {SnackBarService} from "../../../../shared/services/snack-bar.service";
import {NotificationInterface} from "../../../../shared/interfaces/notification.interface";
import {AlertsService} from "../../../../shared/services/alerts.service";

@Component({
  selector: 'collabro-notification-list-item',
  templateUrl: './notification-list-item.component.html',
  styleUrl: './notification-list-item.component.scss'
})
export class NotificationListItemComponent implements OnInit, OnDestroy {
  @Input() notification: NotificationInterface;

  @Output() notificationDeleted: EventEmitter<void> = new EventEmitter<void>();

  public isCurrentAlert: boolean;

  private readonly unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly spinnerService: SpinnerService,
              private readonly notificationService: NotificationService,
              private readonly alertService: AlertsService,
              private readonly snackBarService: SnackBarService,) {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.subscribeToAlertInfo();
  }

  public deleteNotification(notificationId: string): void {
    this.spinnerService.showSpinner();

    this.notificationService.deleteNotification(notificationId)
      .pipe(finalize(() => {
          this.spinnerService.hideSpinner();
        }),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.snackBarService.showSuccessNotification();
          this.notificationDeleted.emit();
        },
        error: (error) => this.snackBarService.showErrorNotification(error?.error?.detail)
      })
  }

  public openAlert(): void {
    this.alertService.setAlertInfo(this.notification);
  }

  private subscribeToAlertInfo(): void {
    this.alertService.getAlertInfo()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (alert) => {
          if (alert) {
            this.isCurrentAlert = alert?.id === this.notification.id;
          }
        }
      });
  }
}
