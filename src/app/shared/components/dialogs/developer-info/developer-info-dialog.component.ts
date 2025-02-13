import {Component, Inject, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DeveloperInterface} from "../../../interfaces/developer/developer.interface";
import {finalize, Subject, takeUntil} from "rxjs";
import {ProjectsService} from "../../../services/projects.service";
import {SpinnerService} from "../../../services/spinner.service";
import {NotificationService} from "../../../services/notification.service";

@Component({
  selector: 'collabro-developer-info',
  templateUrl: './developer-info-dialog.component.html',
  styleUrl: './developer-info-dialog.component.scss'
})
export class DeveloperInfoDialogComponent implements OnDestroy {

  private readonly unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly dialogRef: MatDialogRef<DeveloperInfoDialogComponent>,
              private readonly projectService: ProjectsService,
              private readonly spinnerService: SpinnerService,
              private readonly notificationService: NotificationService,
              @Inject(MAT_DIALOG_DATA) public data: {
                developer: DeveloperInterface
              }) {
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public addDeveloperToProject(): void {
    this.spinnerService.showSpinner();

    this.projectService.addDeveloperToProject('asd', [this.data?.developer.id])
      .pipe(
        finalize(() => this.spinnerService.hideSpinner()),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccessNotification();
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      })
  }
}
