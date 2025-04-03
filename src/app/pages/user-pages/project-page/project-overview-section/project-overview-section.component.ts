import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {ProjectInterface} from "../../../../shared/interfaces/project/project.interface";
import {GetUser} from "../../../../shared/interfaces/get-user";
import {ApplicationRoleEnum} from "../../../../core/enums/application-role.enum";
import {FeedbackDialogComponent} from "../../../../shared/components/dialogs/feedback/feedback-dialog.component";
import {filter, Subject, takeUntil} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {
  ProjectSettingsDialogComponent
} from "../../../../shared/components/dialogs/project-settings/project-settings-dialog.component";
import {ProjectStatusEnum} from "../../../../core/enums/project-status.enum";

@Component({
  selector: 'collabro-project-overview-section',
  templateUrl: './project-overview-section.component.html',
  styleUrl: './project-overview-section.component.scss'
})
export class ProjectOverviewSectionComponent implements OnDestroy {
  @Input() project: ProjectInterface;
  @Input() currentUser: GetUser;

  @Output() loadProject: EventEmitter<void> = new EventEmitter();

  public roleEnum = ApplicationRoleEnum;

  private readonly unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly matDialog: MatDialog) {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public openSettingsDialog(projectId?: string, projectStatus?: ProjectStatusEnum): void {
    const dialogRef = this.matDialog.open(ProjectSettingsDialogComponent, {
      disableClose: false,
      data: {
        projectId,
        projectStatus
      }
    });

    dialogRef.afterClosed()
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((result) => result)
      )
      .subscribe({
        next: () => {
          this.loadProject.emit();
        }
      });
  }
}
