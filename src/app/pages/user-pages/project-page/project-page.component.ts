import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProjectsService} from "../../../shared/services/projects.service";
import {ActivatedRoute} from "@angular/router";
import {finalize, Subject, takeUntil} from "rxjs";
import {FunctionalityBlockService} from "../../../shared/services/functionality-block.service";
import {GetUser} from "../../../shared/interfaces/get-user";
import {UserService} from "../../../shared/services/user.service";
import {ProjectInterface} from "../../../shared/interfaces/project/project.interface";
import {SpinnerService} from "../../../shared/services/spinner.service";
import {NotificationService} from "../../../shared/services/notification.service";
import {ProjectPageTabsEnum} from "../../../core/enums/pages/project-page-tabs.enum";
import {DeveloperInterface} from "../../../shared/interfaces/developer/developer.interface";
import {TaskStatus} from "../../../core/enums/task-status.enum";
import {FunctionalityBlockInterface} from "../../../shared/interfaces/functionality-block/functionality-block.interface";
import {ProjectRequestService} from "../../../shared/services/project-request.service";
import {ProjectRequestInterface} from "../../../shared/interfaces/project/project-request.interface";

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss'],
  providers: [FunctionalityBlockService]
})
export class ProjectPageComponent implements OnInit, OnDestroy {
  public project: ProjectInterface = null;
  public tabIndex: ProjectPageTabsEnum = ProjectPageTabsEnum.Overview;
  public developers: Array<DeveloperInterface>;
  public projectTasks: FunctionalityBlockInterface[];
  public todoTasks: FunctionalityBlockInterface[] = [];
  public inProgressTasks: FunctionalityBlockInterface[] = [];
  public doneTasks: FunctionalityBlockInterface[] = [];
  public projectRequests: ProjectRequestInterface[] = [];

  private projectId: string;

  private unsubscribe$: Subject<void> = new Subject<void>();


  constructor(
    private projectService: ProjectsService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private readonly spinnerService: SpinnerService,
    private readonly notificationService: NotificationService,
    private readonly functionalityBlockService: FunctionalityBlockService,
    private readonly projectRequestService: ProjectRequestService
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

  public getProjectDevelopers(): void {
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

  public getProjectTasks(): void {
    this.spinnerService.showSpinner();

    this.functionalityBlockService.getProjectTasks(this.projectId)
      .pipe(takeUntil(this.unsubscribe$),
        finalize(() => this.spinnerService.hideSpinner()))
      .subscribe({
        next: (result) => {
          this.projectTasks = result;
          this.initializeTaskArrays();
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      });
  }

  private initializeTaskArrays() {
    this.todoTasks = this.projectTasks.filter(task => task.status === TaskStatus.Todo);
    this.inProgressTasks = this.projectTasks.filter(task => task.status === TaskStatus.InProgress);
    this.doneTasks = this.projectTasks.filter(task => task.status === TaskStatus.Done);
  }

  public getProjectRequests(): void {
    this.spinnerService.showSpinner();

    this.projectRequestService.getProjectRequests(this.projectId)
      .pipe(finalize(() => {
          this.spinnerService.hideSpinner();
        }),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: result => {
          this.projectRequests = result;
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      })
  }

  public selectedTabChange(): void {
    if (this.tabIndex === ProjectPageTabsEnum.Overview) {
      this.project = null;
      this.getProject();
    } else if (this.tabIndex === ProjectPageTabsEnum.Team) {
      this.developers = [];
      this.getProjectDevelopers();
    } else if (this.tabIndex === ProjectPageTabsEnum.Board) {
      this.projectTasks = [];
      this.getProjectTasks();
    } else if (this.tabIndex === ProjectPageTabsEnum.Requests) {
      this.projectRequests = [];
      this.getProjectRequests();
    }
  }
}
