import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {FeedbackService} from "../../../services/feedback.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SpinnerService} from "../../../services/spinner.service";
import {SnackBarService} from "../../../services/snack-bar.service";
import {finalize, Subject, takeUntil} from "rxjs";

@Component({
  selector: 'collabro-feedback',
  templateUrl: './feedback-dialog.component.html',
  styleUrl: './feedback-dialog.component.scss'
})
export class FeedbackDialogComponent implements OnInit, OnDestroy {
  public feedbackMessageControl = this.fb.control<string>('', [
    Validators.required,
  ])

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly feedbackService: FeedbackService,
              private readonly spinnerService: SpinnerService,
              private readonly notificationService: SnackBarService,
              private readonly fb: FormBuilder,
              private readonly dialogRef: MatDialogRef<FeedbackDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {
                developerId: string,
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

    this.feedbackService.addFeedback(this.data?.developerId, this.feedbackMessageControl.value)
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

    this.feedbackService.deleteFeedback(this.data?.feedbackId)
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

    this.feedbackService.editFeedback(this.data?.feedbackId, this.feedbackMessageControl.value)
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
