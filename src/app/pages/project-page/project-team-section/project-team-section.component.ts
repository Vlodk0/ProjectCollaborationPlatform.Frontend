import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ProjectsService} from "../../../shared/services/projects.service";
import {SpinnerService} from "../../../shared/services/spinner.service";
import {DeveloperInterface} from "../../../shared/interfaces/developer/developer.interface";
import {finalize, Subject, takeUntil} from "rxjs";
import {
  DeveloperInfoDialogComponent
} from "../../../shared/components/dialogs/developer-info/developer-info-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {NotificationService} from "../../../shared/services/notification.service";

@Component({
  selector: 'collabro-project-team-section',
  templateUrl: './project-team-section.component.html',
  styleUrl: './project-team-section.component.scss'
})
export class ProjectTeamSectionComponent implements OnInit, OnDestroy {
  @Input() projectId: string;
  @Input() developers: Array<DeveloperInterface>;

  public developerTableColumns = ['fullName', 'location', 'action'];

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly projectService: ProjectsService,
              private readonly spinnerService: SpinnerService,
              private readonly matDialog: MatDialog,
              private readonly notificationService: NotificationService) {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    //this.getProjectDevelopers()
  }

  private getProjectDevelopers(): void {
    this.spinnerService.showSpinner();

    this.projectService.getProjectDevelopers(this.projectId)
      .pipe(finalize(() => {
          this.spinnerService.hideSpinner();
        }),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: result => {
          this.developers = result;
        }
      });
  }

  public openDeveloperInfoDialog(developer: DeveloperInterface): void {
    const dialogRef = this.matDialog.open(DeveloperInfoDialogComponent, {
      disableClose: false,
      data: {
        developer: developer
      }
    });

    dialogRef.afterClosed().subscribe();
  }

  public removeDeveloperFromProject(developerId: string): void {
    this.spinnerService.showSpinner();

    this.projectService.removeDeveloperFromProject(this.projectId, developerId)
      .pipe(finalize(() => {
          this.spinnerService.hideSpinner();
        }),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccessNotification();
          this.getProjectDevelopers();
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      });
  }
}
