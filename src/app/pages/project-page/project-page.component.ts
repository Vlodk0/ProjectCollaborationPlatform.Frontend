import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProjectsService} from "../../shared/services/projects.service";
import {ActivatedRoute} from "@angular/router";
import {finalize, Subject, takeUntil} from "rxjs";
import {FunctionalityBlockService} from "../../shared/services/functionality-block.service";
import {GetUser} from "../../shared/interfaces/get-user";
import {UserService} from "../../shared/services/user.service";
import {ProjectInterface} from "../../shared/interfaces/project/project.interface";
import {SpinnerService} from "../../shared/services/spinner.service";
import {NotificationService} from "../../shared/services/notification.service";
import {popResultSelector} from "rxjs/internal/util/args";

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss'],
  providers: [FunctionalityBlockService]
})
export class ProjectPageComponent implements OnInit, OnDestroy {
  public project: ProjectInterface = null;
  private projectId: string;

  private unsubscribe$: Subject<void> = new Subject<void>();


  constructor(
    private projectService: ProjectsService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private readonly spinnerService: SpinnerService,
    private readonly notificationService: NotificationService,
  ) {
  }

  public user: GetUser;

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

  protected readonly popResultSelector = popResultSelector;
}
