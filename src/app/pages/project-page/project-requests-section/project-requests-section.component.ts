import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {finalize, Subject, takeUntil} from "rxjs";
import {ProjectRequestInterface} from "../../../shared/interfaces/project/project-request.interface";
import {ProjectRequestService} from "../../../shared/services/project-request.service";
import {SpinnerService} from "../../../shared/services/spinner.service";
import {NotificationService} from "../../../shared/services/notification.service";

@Component({
  selector: 'collabro-project-requests-section',
  templateUrl: './project-requests-section.component.html',
  styleUrl: './project-requests-section.component.scss'
})
export class ProjectRequestsSectionComponent implements OnInit, OnDestroy {
  @Input() projectId: string;

  public projectRequests: ProjectRequestInterface[] = [];

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly projectRequestService: ProjectRequestService,
              private readonly spinnerService: SpinnerService,
              private readonly notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.getProjectRequests();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public acceptProjectRequest(projectRequestId: string): void {
    this.spinnerService.showSpinner();

    this.projectRequestService.acceptProjectRequest(projectRequestId, this.projectId)
      .pipe(finalize(() => {
          this.spinnerService.hideSpinner();
        }),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccessNotification();
          this.getProjectRequests();
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      })
  }

  public declineProjectRequest(projectRequestId: string): void {
    this.spinnerService.showSpinner();

    this.projectRequestService.declineProjectRequest(projectRequestId, this.projectId)
      .pipe(finalize(() => {
          this.spinnerService.hideSpinner();
        }),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccessNotification();
          this.getProjectRequests();
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      })
  }


  public getProjectRequests(): void {
    this.spinnerService.showSpinner();

    this.projectRequestService.getProjectRequests(this.projectId)
      .pipe(finalize(() => {
          this.spinnerService.hideSpinner();
        }),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: result => {
          this.projectRequests = result;
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      })
  }
}
