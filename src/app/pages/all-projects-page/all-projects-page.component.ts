import {Component, OnDestroy, OnInit} from '@angular/core';
import {PaginationFilter} from "../../shared/interfaces/pagination-filter";
import {ProjectsService} from "../../shared/services/projects.service";
import {finalize, Subject, takeUntil} from "rxjs";
import {ProjectInterface} from "../../shared/interfaces/project/project.interface";
import {SpinnerService} from "../../shared/services/spinner.service";
import {NotificationService} from "../../shared/services/notification.service";
import {UserService} from "../../shared/services/user.service";
import {GetUser} from "../../shared/interfaces/get-user";

@Component({
  selector: 'app-all-projects-page',
  templateUrl: './all-projects-page.component.html',
  styleUrl: './all-projects-page.component.scss',
  providers: [ProjectsService]
})

export class AllProjectsPageComponent implements OnDestroy, OnInit {
  public isLoadingProjects = true;
  public projects: ProjectInterface[] = [];
  public user: GetUser = null;

  private projectsCurrentPage: number = 0;
  private totalProjects: number = 0;

  private unsubscribe$: Subject<void> = new Subject<void>();

  paginationFilter: PaginationFilter = {
    pageNumber: 0,
    pageSize: 15,
    sortColumn: "Payment",
    sortDirection: 1
  }


  constructor(private readonly projectService: ProjectsService,
              private readonly spinnerService: SpinnerService,
              private readonly notificationService: NotificationService,
              private readonly userService: UserService) {
  }

  ngOnInit(): void {
    this.getProjects()
    this.subscribeToCurrentUser();
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

  public loadingProjects(resetPage: boolean) {
    if (resetPage) {
      this.getProjects(false);
    } else if (this.totalProjects > this.projects.length && !this.isLoadingProjects) {
      this.getProjects(true);
    }
  }

  private getProjects(onScroll = false): void {
    this.spinnerService.showSpinner();

    if (!onScroll) {
      this.projectsCurrentPage = 0;
    }

    this.isLoadingProjects = true;

    this.projectService.getProjects(this.projectsCurrentPage, 20)
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


