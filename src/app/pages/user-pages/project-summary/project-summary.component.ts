import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {finalize, Subject, takeUntil} from "rxjs";
import {ProjectsService} from "../../../shared/services/projects.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../shared/services/user.service";
import {SpinnerService} from "../../../shared/services/spinner.service";
import {SnackBarService} from "../../../shared/services/snack-bar.service";
import {GetUser} from "../../../shared/interfaces/get-user";
import {ProjectInterface} from "../../../shared/interfaces/project/project.interface";
import {ProjectRequestService} from "../../../shared/services/project-request.service";
import {ApplicationRoleEnum} from "../../../core/enums/application-role.enum";
import {AlertsService} from "../../../shared/services/alerts.service";

@Component({
  selector: 'collabro-project-summary',
  templateUrl: './project-summary.component.html',
  styleUrl: './project-summary.component.scss'
})
export class ProjectSummaryComponent implements OnInit, OnDestroy {
  public user: GetUser;
  public project: ProjectInterface = null;
  protected readonly applicationRoleEnum = ApplicationRoleEnum;

  private projectId: string;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private projectService: ProjectsService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private readonly router: Router,
    private readonly projectRequestService: ProjectRequestService,
    private readonly spinnerService: SpinnerService,
    private readonly notificationService: SnackBarService,
    private readonly alertService: AlertsService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['id'];
    });

    this.subscribeToCurrentUser();
    this.getProject();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  private getProject(): void {
    this.spinnerService.showSpinner();

    this.projectService.getProjectById(this.projectId)
      .pipe(finalize(() => {
          this.spinnerService.hideSpinner();
        }),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: result => {
          this.project = result;
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      })
  }

  public subscribeToCurrentUser(): void {
    this.userService.currentUser$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: user => {
          this.user = user;
          console.log(this.user.id);
        }
      });
  }

  public sendRequestForJoiningTheProject(): void {
    this.spinnerService.showSpinner();

    this.projectRequestService.createProjectRequest(this.projectId)
      .pipe(finalize(() => {
          this.spinnerService.hideSpinner();
        }),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: (value: any) => {
          this.notificationService.showSuccessNotification();
          this.router.navigate(['/all-projects']);
          this.alertService.setNewAlert(value);
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      })
  }
}
