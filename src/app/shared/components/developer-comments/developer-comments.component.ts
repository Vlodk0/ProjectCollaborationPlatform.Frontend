import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {FeedbackInterface} from "../../interfaces/feedback/feedback.interface";
import {FeedbackDialogComponent} from "../dialogs/feedback/feedback-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {filter, Subject, takeUntil} from "rxjs";
import {GetUser} from "../../interfaces/get-user";
import {ApplicationRoleEnum} from "../../../core/enums/application-role.enum";

@Component({
  selector: 'collabro-developer-comments',
  templateUrl: './developer-comments.component.html',
  styleUrl: './developer-comments.component.scss'
})
export class DeveloperCommentsComponent implements OnDestroy {
  @Input() feedbacks: FeedbackInterface[] = [];
  @Input() developerId: string;
  @Input() projectOwnerId: string;
  @Input() imageData: string | ArrayBuffer | null;
  @Input() currentUser: GetUser;

  @Output() public loadData = new EventEmitter<boolean>();

  public roleEnum = ApplicationRoleEnum;

  private readonly unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly matDialog: MatDialog) {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  public openFeedbackDialog(feedbackId?: string, message?: string): void {
    const dialogRef = this.matDialog.open(FeedbackDialogComponent, {
      disableClose: false,
      data: {
        developerId: this.developerId,
        projectOwnerId: this.projectOwnerId,
        currentUser: this.currentUser,
        feedbackId,
        message
      }
    });

    dialogRef.afterClosed()
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((result) => result)
      )
      .subscribe({
        next: () => {
          this.loadData.emit(true);
        }
      });
  }
}
