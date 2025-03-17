import {Component, OnDestroy, OnInit} from '@angular/core';
import {SpinnerService} from "../../../shared/services/spinner.service";
import {ProjectRequestService} from "../../../shared/services/project-request.service";
import {finalize, Subject, takeUntil} from "rxjs";
import {SnackBarService} from "../../../shared/services/snack-bar.service";
import {ProjectRequestInterface} from "../../../shared/interfaces/project/project-request.interface";
import {AlertsService} from "../../../shared/services/alerts.service";

@Component({
  selector: 'collabro-invitations',
  templateUrl: './invitations.component.html',
  styleUrl: './invitations.component.scss'
})
export class InvitationsComponent implements OnInit, OnDestroy {
  public isLoadingInvitations = true;
  public invitations: ProjectRequestInterface[] = [];

  private invitationsCurrentPage: number = 0;
  private totalInvitations: number = 0;

  private readonly unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly spinnerService: SpinnerService,
              private readonly snackBarService: SnackBarService,
              private readonly alertService: AlertsService,
              private readonly projectRequestService: ProjectRequestService,
  ) {
  }

  ngOnInit(): void {
    this.getInvitations();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public acceptProjectRequest(projectRequestId: string, projectId: string): void {
    this.spinnerService.showSpinner();

    this.projectRequestService.acceptProjectRequest(projectRequestId, projectId)
      .pipe(
        finalize(() => this.spinnerService.hideSpinner()),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.snackBarService.showSuccessNotification();
          this.alertService.setNewAlert(null);
          this.getInvitations();
        },
        error: error => this.snackBarService.showErrorNotification(error?.error?.detail)
      });
  }

  public declineProjectRequest(projectRequestId: string, projectId: string): void {
    this.spinnerService.showSpinner();

    this.projectRequestService.declineProjectRequest(projectRequestId, projectId)
      .pipe(
        finalize(() => this.spinnerService.hideSpinner()),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.snackBarService.showSuccessNotification();
          this.alertService.setNewAlert(null);
          this.getInvitations();
        },
        error: error => this.snackBarService.showErrorNotification(error?.error?.detail)
      });
  }

  public loadingInvitations(resetPage: boolean) {
    if (resetPage) {
      this.getInvitations(false);
    } else if (this.totalInvitations > this.invitations.length && !this.isLoadingInvitations) {
      this.getInvitations(true);
    }
  }

  private getInvitations(onScroll = false): void {
    this.spinnerService.showSpinner();

    if (!onScroll) {
      this.invitationsCurrentPage = 0;
    }

    this.isLoadingInvitations = true;

    this.projectRequestService.getDeveloperProjectRequests(this.invitationsCurrentPage, 20)
      .pipe(finalize(() => {
          this.isLoadingInvitations = false;
          this.spinnerService.hideSpinner();
        }),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: result => {
          this.totalInvitations = result.total;
          this.invitationsCurrentPage++;

          if (onScroll) {
            this.invitations.push(...result.items);
          } else {
            this.invitations = result.items;
          }

        },
        error: (error) => this.snackBarService.showErrorNotification(error?.error?.detail)
      })
  }
}
