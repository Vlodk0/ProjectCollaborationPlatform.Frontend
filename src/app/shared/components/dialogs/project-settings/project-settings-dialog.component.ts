import {Component, Inject, OnDestroy} from '@angular/core';
import {finalize, Subject, takeUntil} from "rxjs";
import {ProjectsService} from "../../../services/projects.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SpinnerService} from "../../../services/spinner.service";
import {SnackBarService} from "../../../services/snack-bar.service";
import {ProjectStatusEnum} from "../../../../core/enums/project-status.enum";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ScheduleProjectInterface} from "../../../interfaces/project/schedule-project.interface";

@Component({
  selector: 'collabro-project-settings',
  templateUrl: './project-settings-dialog.component.html',
  styleUrl: './project-settings-dialog.component.scss'
})
export class ProjectSettingsDialogComponent implements OnDestroy {
  public projectStatusEnum = ProjectStatusEnum;
  public minDate: Date = new Date();
  public scheduleOptionsFormGroup: FormGroup = new FormGroup({
    startDate: new FormControl<string>(null, [Validators.required]),
    endDate: new FormControl<string>(null, [Validators.required]),
  })


  private readonly unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly projectService: ProjectsService,
              private readonly spinnerService: SpinnerService,
              private readonly dialogRef: MatDialogRef<ProjectSettingsDialogComponent>,
              private readonly fb: FormBuilder,
              private readonly snackBar: SnackBarService,
              @Inject(MAT_DIALOG_DATA) public data: {
                projectId: string,
                projectStatus: ProjectStatusEnum
              }) {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public pauseProject(): void {
    this.spinnerService.showSpinner();

    this.projectService.pauseProject(this.data?.projectId)
      .pipe(finalize(() => {
          this.spinnerService.hideSpinner();
        }),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.snackBar.showSuccessNotification();
          this.dialogRef.close();
        },
        error: (error) => this.snackBar.showErrorNotification(error?.error?.detail)
      });
  }

  public scheduleProject(): void {
    this.spinnerService.showSpinner();

    const request: ScheduleProjectInterface = {
      startDate: this.scheduleOptionsFormGroup.get('startDate').value,
      endDate: this.scheduleOptionsFormGroup.get('endDate').value
    }

    this.projectService.scheduleProject(this.data?.projectId, request)
      .pipe(finalize(() => {
          this.spinnerService.hideSpinner();
        }),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.snackBar.showSuccessNotification();
          this.dialogRef.close(true);
        },
        error: (error) => this.snackBar.showErrorNotification(error?.error?.detail)
      });
  }
}
