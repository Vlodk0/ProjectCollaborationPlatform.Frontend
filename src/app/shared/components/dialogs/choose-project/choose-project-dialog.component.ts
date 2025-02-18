import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {finalize, Subject, takeUntil} from "rxjs";
import {ProjectInterface} from "../../../interfaces/project/project.interface";
import {SpinnerService} from "../../../services/spinner.service";
import {ProjectsService} from "../../../services/projects.service";
import {NotificationService} from "../../../services/notification.service";
import {FormBuilder, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'collabro-choose-project',
  templateUrl: './choose-project-dialog.component.html',
  styleUrl: './choose-project-dialog.component.scss'
})
export class ChooseProjectDialogComponent implements OnInit, OnDestroy {
  public projectId = this.fb.control<string>('', [
    Validators.required,
  ])
  public isLoadingProjects = true;
  public projects: ProjectInterface[] = [];

  private projectsCurrentPage: number = 0;
  private totalProjects: number = 0;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly spinnerService: SpinnerService,
              private readonly projectService: ProjectsService,
              private readonly notificationService: NotificationService,
              private readonly fb: FormBuilder,
              private readonly dialogRef: MatDialogRef<ChooseProjectDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {
                developerId: string
              }) {
  }

  ngOnInit(): void {
    this.getProjectOwnerProjects();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public addDeveloperToProject(): void {
    this.spinnerService.showSpinner();

    this.projectService.addDeveloperToProject(this.projectId.value, [this.data?.developerId])
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


  public loadingProjects(resetPage: boolean) {
    if (resetPage) {
      this.getProjectOwnerProjects(false);
    } else if (this.totalProjects > this.projects.length && !this.isLoadingProjects) {
      this.getProjectOwnerProjects(true);
    }
  }

  private getProjectOwnerProjects(onScroll = false): void {
    this.spinnerService.showSpinner();

    if (!onScroll) {
      this.projectsCurrentPage = 0;
    }

    this.isLoadingProjects = true;

    this.projectService.getProjectOwnerProjects(this.projectsCurrentPage, 20)
      .pipe(finalize(() => {
          this.isLoadingProjects = false;
          this.spinnerService.hideSpinner();
        }),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: result => {
          this.totalProjects = result.total;
          this.projectsCurrentPage++;

          if (onScroll) {
            this.projects.push(...result.items);
          } else {
            this.projects = result.items;
          }

        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      })
  }
}
