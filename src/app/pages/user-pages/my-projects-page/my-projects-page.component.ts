import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {debounceTime, finalize, Subject, takeUntil} from "rxjs";
import {ProjectsService} from "../../../shared/services/projects.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {GetUser} from "../../../shared/interfaces/get-user";
import {UserService} from "../../../shared/services/user.service";
import {SpinnerService} from "../../../shared/services/spinner.service";
import {ProjectInterface} from "../../../shared/interfaces/project/project.interface";
import {SnackBarService} from "../../../shared/services/snack-bar.service";
import {TechnologyInterface} from "../../../shared/interfaces/project/technology.interface";
import {FrameworkInterface} from "../../../shared/interfaces/project/framework.interface";
import {ProjectRequestFormGroup} from "../../../core/types/form-groups/project-request-form-group";
import {ProjectFilterInterface} from "../../../shared/interfaces/project/project-filter.interface";
import {MatMenuTrigger} from "@angular/material/menu";
import {FilterProjectRequestInterface} from "../../../shared/interfaces/project/filter-project-request.interface";
import {TechnologyService} from "../../../shared/services/technology.service";
import {FrameworkService} from "../../../shared/services/framework.service";
import {ApplicationRoleEnum} from "../../../core/enums/application-role.enum";

@Component({
  selector: 'app-my-projects-page',
  templateUrl: './my-projects-page.component.html',
  styleUrl: './my-projects-page.component.scss',
})
export class MyProjectsPageComponent implements OnDestroy, OnInit, AfterViewInit {
  @ViewChild('filterMenu') public filterMenu: MatMenuTrigger;

  public isLoadingProjects = true;
  public projects: ProjectInterface[] = [];
  public technologies: TechnologyInterface[];
  public frameworks: FrameworkInterface[];
  public menuIsClosed: boolean;
  public projectsFormGroup: FormGroup<ProjectRequestFormGroup>;
  public applicationRoleEnum = ApplicationRoleEnum;

  private projectsCurrentPage: number = 0;
  private totalProjects: number = 0;

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
              private readonly fb: FormBuilder,
              private readonly technologyService: TechnologyService,
              private readonly frameworkService: FrameworkService,
              private readonly spinnerService: SpinnerService,
              private readonly notificationService: SnackBarService) {
  }

  public ngAfterViewInit(): void {
    this.filterMenu?.menuClosed
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => this.menuIsClosed = !this.menuIsClosed
      });
  }

  ngOnInit() {
    this.creationProjectForm = new FormGroup({
      title: new FormControl(''),
      shortInfo: new FormControl(''),
      payment: new FormControl(0),
      description: new FormControl('')
    })

    this.subscribeToCurrentUser();
    this.getProjectOwnerProjects();
    this.setForm();
    this.subscribeToSearchTerm();
    this.getTechnologies();
    this.getAllFrameworks();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public applyFilters(filters: ProjectFilterInterface): void {
    this.projectsFormGroup.patchValue({
      technologyIds: filters.selectedTechnologies,
      frameworkIds: filters.selectedFrameworks,
      paymentTypes: filters.selectedPaymentTypes,
      projectStatuses: filters.selectedProjectStatuses,
      currentPage: 0
    });

    this.filterMenu.closeMenu();

    this.filterProjects();
  }

  private filterProjects(onScroll = false): void {
    this.spinnerService.showSpinner();

    const filterProjects$ = this.user.roleName === this.applicationRoleEnum.Dev
      ? this.projectService.filterDeveloperProjects(this.createParams())
      : this.projectService.filterProjectOwnerProjects(this.createParams());

    filterProjects$
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

  public navigateToCreateProject() {
    this.router.navigate(['create-project'], {relativeTo: this.activatedRoute}).then();
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

  public resetSearch(): void {
    this.projectsFormGroup.patchValue({searchTerm: ''});
    this.filterProjects();
  }

  private subscribeToSearchTerm(): void {
    this.projectsFormGroup.get('searchTerm').valueChanges
      .pipe(takeUntil(this.unsubscribe$), debounceTime(500))
      .subscribe({
        next: () => {
          this.projectsFormGroup.patchValue({currentPage: 0});
          if (this.projectsFormGroup.get('searchTerm').value.length) {
            this.filterProjects();
          }
        }
      });
  }

  private setForm(): void {
    this.projectsFormGroup = this.fb.group<ProjectRequestFormGroup>({
      technologyIds: this.fb.control([]),
      frameworkIds: this.fb.control([]),
      searchTerm: this.fb.control(''),
      projectStatuses: this.fb.control([]),
      paymentTypes: this.fb.control([]),
      currentPage: this.fb.control(0),
      pageSize: this.fb.control(20)
    });
  }
}
