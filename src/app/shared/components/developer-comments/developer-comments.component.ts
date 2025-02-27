import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {FeedbackInterface} from "../../interfaces/feedback/feedback.interface";
import {FeedbackDialogComponent} from "../dialogs/feedback/feedback-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {filter, Subject, takeUntil} from "rxjs";

@Component({
  selector: 'collabro-developer-comments',
  templateUrl: './developer-comments.component.html',
  styleUrl: './developer-comments.component.scss'
})
export class DeveloperCommentsComponent implements OnDestroy {
  @Input() feedbacks: FeedbackInterface[] = [];
  @Input() developerId: string;
  @Input() imageData: string | ArrayBuffer | null;

  @Output() public loadData = new EventEmitter<boolean>();

  private unsubscribe$: Subject<void> = new Subject<void>();

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
