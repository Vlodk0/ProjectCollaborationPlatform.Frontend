import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DeveloperInterface} from "../../../interfaces/developer/developer.interface";
import {finalize, Subject, takeUntil} from "rxjs";
import {SpinnerService} from "../../../services/spinner.service";
import {SnackBarService} from "../../../services/snack-bar.service";
import {ChooseProjectDialogComponent} from "../choose-project/choose-project-dialog.component";
import {FeedbackInterface} from "../../../interfaces/feedback/feedback.interface";
import {DeveloperFeedbackService} from "../../../services/developer-feedback.service";
import {UserService} from "../../../services/user.service";
import {GetUser} from "../../../interfaces/get-user";
import {ApplicationRoleEnum} from "../../../../core/enums/application-role.enum";
import {DeveloperService} from "../../../services/developer.service";

@Component({
  selector: 'collabro-developer-info',
  templateUrl: './developer-info-dialog.component.html',
  styleUrl: './developer-info-dialog.component.scss'
})
export class DeveloperInfoDialogComponent implements OnDestroy, OnInit {
  public isLoadingFeedbacks = true;
  public feedbacks: FeedbackInterface[] = [];
  public imageData: string | ArrayBuffer | null;
  public avatarData: string | ArrayBuffer | null;
  public user: GetUser = null;
  public roleEnum = ApplicationRoleEnum;

  private feedbacksCurrentPage: number = 0;
  private totalFeedbacks: number = 0;

  private readonly unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly dialogRef: MatDialogRef<DeveloperInfoDialogComponent>,
              private readonly feedbackService: DeveloperFeedbackService,
              private readonly matDialog: MatDialog,
              private readonly userService: UserService,
              private readonly cdr: ChangeDetectorRef,
              private readonly spinnerService: SpinnerService,
              private readonly developerService: DeveloperService,
              private readonly notificationService: SnackBarService,
              @Inject(MAT_DIALOG_DATA) public data: {
                developer: DeveloperInterface,
                developerAvatar?: string | ArrayBuffer
              }) {
  }

  ngOnInit(): void {
    this.subscribeToCurrentUser();

    if (this.data?.developerAvatar) {
      this.getProfileAvatar();
    }

    this.getAllDeveloperFeedback()
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public deleteDeveloper(developerId: string): void {
    this.spinnerService.showSpinner();

    this.developerService.deleteDeveloper(developerId)
      .pipe(
        finalize(() => this.spinnerService.hideSpinner()),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccessNotification();
          this.dialogRef.close(true);
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      })
  }

  public openProjectsDialog(developerId: string): void {
    const dialogRef = this.matDialog.open(ChooseProjectDialogComponent, {
      disableClose: true,
      data: {
        developerId
      }
    });

    dialogRef.afterClosed().subscribe();
  }

  public loadingFeedbacks(resetPage: boolean) {
    if (resetPage) {
      this.getAllDeveloperFeedback(false);
    } else if (this.totalFeedbacks > this.feedbacks.length && !this.isLoadingFeedbacks) {
      this.getAllDeveloperFeedback(true);
    }
  }

  public subscribeToCurrentUser(): void {
    this.userService.currentUser$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: user => {
          this.user = user;
        }
      });
  }

  private getAllDeveloperFeedback(onScroll = false): void {
    this.spinnerService.showSpinner();

    if (!onScroll) {
      this.feedbacksCurrentPage = 0;
    }

    this.isLoadingFeedbacks = true;

    this.feedbackService.getAllDeveloperFeedback(this.data?.developer.id, this.feedbacksCurrentPage, 20)
      .pipe(finalize(() => {
          this.isLoadingFeedbacks = false;
          this.spinnerService.hideSpinner();
        }),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: result => {
          this.totalFeedbacks = result.total;
          this.feedbacksCurrentPage++;

          if (onScroll) {
            this.feedbacks.push(...result.items);
          } else {
            this.feedbacks = result.items;
          }

          this.getFeedbackAvatars();

        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      })
  }

  private getFeedbackAvatars(): void {
    if (!this.feedbacks?.length) {
      return;
    }

    this.spinnerService.showSpinner();

    this.feedbacks.forEach(feedback => {
      if (!feedback.avatarName) {
        return;
      }

      this.userService.getAvatar(feedback.avatarName)
        .pipe(
          finalize(() => this.spinnerService.hideSpinner()),
          takeUntil(this.unsubscribe$)
        )
        .subscribe({
          next: result => {
            this.createImageFromBlob(result, false);
          }
        });
    });
  }

  private getProfileAvatar(): void {
    this.spinnerService.showSpinner();

    this.userService.getAvatar(this.data?.developerAvatar as string)
      .pipe(
        finalize(() => this.spinnerService.hideSpinner()),
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
        next: result => {
          this.createImageFromBlob(result, true);
        }
      });
  }

  private createImageFromBlob(image: Blob, isAvatar: boolean): void {
    if (!image) {
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (isAvatar) {
        this.avatarData = reader.result;
      } else {
        this.imageData = reader.result;
      }
      this.spinnerService.hideSpinner();
      this.cdr.detectChanges();
    }, false);

    reader.readAsDataURL(image);
  }
}
