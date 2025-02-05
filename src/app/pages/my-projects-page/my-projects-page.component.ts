import {Component, OnDestroy, OnInit} from '@angular/core';
import {DeveloperTechnology} from "../../shared/interfaces/developer-technology";
import {finalize, Subject, takeUntil} from "rxjs";
import {ProjectsService} from "../../shared/services/projects.service";
import {FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {GetUser} from "../../shared/interfaces/get-user";
import {UserService} from "../../shared/services/user.service";
import {SpinnerService} from "../../shared/services/spinner.service";
import {ProjectInterface} from "../../shared/interfaces/project/project.interface";
import {NotificationService} from "../../shared/services/notification.service";

@Component({
  selector: 'app-my-projects-page',
  templateUrl: './my-projects-page.component.html',
  styleUrl: './my-projects-page.component.scss',
})
export class MyProjectsPageComponent implements OnDestroy, OnInit {
  public isLoadingProjects = true;
  public projects: ProjectInterface[] = [];

  private projectsCurrentPage: number = 0;
  private totalProjects: number = 0;

  visible: boolean = false;
  creationVisible: boolean = false;
  technologies: DeveloperTechnology[];
  creationProjectForm: FormGroup;

  private unsubscribe$: Subject<void> = new Subject<void>();

  user: GetUser = {
    id: '',
    lastName: '',
    firstName: '',
    email: '',
    roleName: '',
    isDeleted: false
  }

  constructor(private readonly projectService: ProjectsService,
              private readonly userService: UserService,
              private readonly activatedRoute: ActivatedRoute,
              private readonly router: Router,
              private readonly spinnerService: SpinnerService,
              private readonly notificationService: NotificationService) {
  }

  ngOnInit() {
    this.creationProjectForm = new FormGroup({
      title: new FormControl(''),
      shortInfo: new FormControl(''),
      payment: new FormControl(0),
      description: new FormControl('')
    })

    this.getUser();
    this.getProjectOwnerProjects();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public navigateToCreateProject() {
    this.router.navigate(['create-project'], { relativeTo: this.activatedRoute }).then();
  }

  showDialog(technologies: DeveloperTechnology[]) {
    this.technologies = technologies
    this.visible = true
  }

  getUser() {
    this.userService.getUser()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: value => {
          this.user = value;
        },
        error: err => {
          console.log(err)
        }
      })
  }

  showProjectCreationDialog() {
    this.creationVisible = true
  }
  //
  // loadProjects($event: TableLazyLoadEvent) {
  //   console.log($event);
  //
  //   this.paginationFilter.pageNumber = $event.first || 0;
  //   this.paginationFilter.pageSize = $event.rows || 10;
  //   this.paginationFilter.sortColumn = $event.sortField?.toString() || "Payment";
  //   this.paginationFilter.sortDirection = $event.sortOrder || 1;
  //
  //   this.userService.getAllProjects(this.paginationFilter)
  //     .pipe(takeUntil(this.isSubscribe))
  //     .subscribe(response => {
  //       this.projects = response.data;
  //       this.totalRecords = response.totalRecords;
  //     })
  // }

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
