import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {finalize, Subject, takeUntil} from "rxjs";
import {ProjectRequestInterface} from "../../../../shared/interfaces/project/project-request.interface";
import {ProjectRequestService} from "../../../../shared/services/project-request.service";
import {SpinnerService} from "../../../../shared/services/spinner.service";
import {SnackBarService} from "../../../../shared/services/snack-bar.service";

@Component({
  selector: 'collabro-project-requests-section',
  templateUrl: './project-requests-section.component.html',
  styleUrl: './project-requests-section.component.scss'
})
export class ProjectRequestsSectionComponent implements OnDestroy {
  @Input() projectId: string;
  @Input() projectRequests: ProjectRequestInterface[] = [];

  @Output() projectRequestsUpdated: EventEmitter<void> = new EventEmitter<void>();

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly projectRequestService: ProjectRequestService,
              private readonly spinnerService: SpinnerService,
              private readonly notificationService: SnackBarService) {
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
          this.projectRequestsUpdated.emit();
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
          this.projectRequestsUpdated.emit();
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      })
  }
}
