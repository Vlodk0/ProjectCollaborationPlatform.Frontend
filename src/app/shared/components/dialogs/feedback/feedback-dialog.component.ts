import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {DeveloperFeedbackService} from "../../../services/developer-feedback.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SpinnerService} from "../../../services/spinner.service";
import {SnackBarService} from "../../../services/snack-bar.service";
import {finalize, Subject, takeUntil} from "rxjs";
import {GetUser} from "../../../interfaces/get-user";
import {ApplicationRoleEnum} from "../../../../core/enums/application-role.enum";
import {ProjectOwnerFeedbackService} from "../../../services/project-owner-feedback.service";
import {ValidationService} from "../../../services/validation.service";

@Component({
  selector: 'collabro-feedback',
  templateUrl: './feedback-dialog.component.html',
  styleUrl: './feedback-dialog.component.scss'
})
export class FeedbackDialogComponent implements OnInit, OnDestroy {
  public feedbackMessageControl = this.fb.control<string>('', [
    Validators.required, this.validationService.whitespaceValidator
  ])

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly feedbackService: DeveloperFeedbackService,
              private readonly spinnerService: SpinnerService,
              private readonly notificationService: SnackBarService,
              private readonly fb: FormBuilder,
              private readonly projectOwnerFeedbackService: ProjectOwnerFeedbackService,
              private readonly validationService: ValidationService,
              private readonly dialogRef: MatDialogRef<FeedbackDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {
                developerId: string,
                projectOwnerId: string,
                currentUser: GetUser,
                feedbackId: string,
                message: string
              }) {
  }

  ngOnInit(): void {
    if (this.data?.feedbackId) {
      this.feedbackMessageControl.setValue(this.data.message);
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  public addFeedback(): void {
    this.spinnerService.showSpinner();

    const request$ = this.data?.currentUser?.roleName === ApplicationRoleEnum.Dev
      ? this.projectOwnerFeedbackService.addFeedback(this.data.projectOwnerId, this.feedbackMessageControl.value)
      : this.feedbackService.addFeedback(this.data?.developerId, this.feedbackMessageControl.value)

    request$
      .pipe(
      finalize(() => this.spinnerService.hideSpinner()),
      takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccessNotification();
          this.dialogRef.close(true);
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      });
  }

  public deleteFeedback(): void {
    this.spinnerService.showSpinner();

    const request$ = this.data?.currentUser?.roleName === ApplicationRoleEnum.Dev
    ? this.projectOwnerFeedbackService.deleteFeedback(this.data?.feedbackId)
    : this.feedbackService.deleteFeedback(this.data?.feedbackId);


    request$
      .pipe(
        finalize(() => this.spinnerService.hideSpinner()),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccessNotification();
          this.dialogRef.close(true);
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      });
  }

  public editFeedback(): void {
    this.spinnerService.showSpinner();

    const request$ = this.data?.currentUser?.roleName === ApplicationRoleEnum.Dev
    ? this.projectOwnerFeedbackService.editFeedback(this.data?.feedbackId, this.feedbackMessageControl.value)
    : this.feedbackService.editFeedback(this.data?.feedbackId, this.feedbackMessageControl.value)


    request$
      .pipe(
        finalize(() => this.spinnerService.hideSpinner()),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccessNotification();
          this.dialogRef.close(true);
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      });
  }
}
