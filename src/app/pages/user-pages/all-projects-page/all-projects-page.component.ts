import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ProjectsService} from "../../../shared/services/projects.service";
import {finalize, Subject, takeUntil} from "rxjs";
import {ProjectInterface} from "../../../shared/interfaces/project/project.interface";
import {SpinnerService} from "../../../shared/services/spinner.service";
import {SnackBarService} from "../../../shared/services/snack-bar.service";
import {UserService} from "../../../shared/services/user.service";
import {GetUser} from "../../../shared/interfaces/get-user";
import {MatMenuTrigger} from "@angular/material/menu";
import {TechnologyInterface} from "../../../shared/interfaces/project/technology.interface";
import {FrameworkInterface} from "../../../shared/interfaces/project/framework.interface";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ProjectRequestFormGroup} from "../../../core/types/form-groups/project-request-form-group";
import {ProjectFilterInterface} from "../../../shared/interfaces/project/project-filter.interface";
import {TechnologyService} from "../../../shared/services/technology.service";
import {FrameworkService} from "../../../shared/services/framework.service";
import {FilterProjectRequestInterface} from "../../../shared/interfaces/project/filter-project-request.interface";

@Component({
  selector: 'app-all-projects-page',
  templateUrl: './all-projects-page.component.html',
  styleUrl: './all-projects-page.component.scss',
  providers: [ProjectsService]
})

export class AllProjectsPageComponent implements OnDestroy, OnInit, AfterViewInit {
  @ViewChild('filterMenu') public filterMenu: MatMenuTrigger;

  public isLoadingProjects = true;
  public projects: ProjectInterface[] = [];
  public user: GetUser = null;
  public technologies: TechnologyInterface[];
  public frameworks: FrameworkInterface[];
  public menuIsClosed: boolean;
  public projectsFormGroup: FormGroup<ProjectRequestFormGroup>;


  private projectsCurrentPage: number = 0;
  private totalProjects: number = 0;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly projectService: ProjectsService,
              private readonly spinnerService: SpinnerService,
              private readonly technologyService: TechnologyService,
              private readonly frameworkService: FrameworkService,
              private readonly notificationService: SnackBarService,
              private readonly fb: FormBuilder,
              private readonly userService: UserService) {
  }

  ngOnInit(): void {
    this.getProjects()
    this.subscribeToCurrentUser();
    this.setForm();
    this.getTechnologies();
    this.getAllFrameworks();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public ngAfterViewInit(): void {
    this.filterMenu.menuClosed
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => this.menuIsClosed = !this.menuIsClosed
      });
  }

  public subscribeToCurrentUser(): void {
    this.userService.currentUser$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: user => {
          this.user = user;
        }
      });
  }

  public applyFilters(filters: ProjectFilterInterface): void {
    this.projectsFormGroup.patchValue({
      technologyIds: filters.selectedTechnologies,
      frameworkIds: filters.selectedFrameworks,
      currentPage: 0
    });

    this.filterMenu.closeMenu();

    this.filterProjects();
  }

  private createParams(): FilterProjectRequestInterface {
    const params: FilterProjectRequestInterface = {} as FilterProjectRequestInterface;

    for (const key in this.projectsFormGroup.value) {
      if (this.projectsFormGroup.value.hasOwnProperty(key) &&
        this.projectsFormGroup.value[key] !== null) {
        params[key] = this.projectsFormGroup.value[key];
      }
    }

    return params;
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

  private filterProjects(onScroll = false): void {
    this.spinnerService.showSpinner();

    this.projectService.filterProjects(this.createParams())
      .pipe(
        finalize(() => {
          this.isLoadingProjects = false;
          this.spinnerService.hideSpinner();
        }),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: (value) => {
          onScroll ? this.projects.push(...value.items) : this.projects = value.items;

          this.totalProjects = value.total;
          this.projectsFormGroup.patchValue({currentPage: this.projectsFormGroup.get('currentPage').value + 1});
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      })
  }

  private getTechnologies(): void {
    this.technologyService.getAllTechnologies()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (technologies: TechnologyInterface[]) => {
          this.technologies = technologies;
        }
      });
  }

  private getAllFrameworks(): void {
    this.frameworkService.getAllFrameworks()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (frameworks: FrameworkInterface[]) => {
          this.frameworks = frameworks;
        }
      });
  }

  private setForm(): void {
    this.projectsFormGroup = this.fb.group<ProjectRequestFormGroup>({
      technologyIds: this.fb.control([]),
      frameworkIds: this.fb.control([]),
      currentPage: this.fb.control(0),
      pageSize: this.fb.control(20)
    });
  }
}


