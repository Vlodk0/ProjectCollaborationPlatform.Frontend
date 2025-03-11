import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {debounceTime, distinctUntilChanged, finalize, Observable, Subject, takeUntil} from "rxjs";
import {CountryInterface} from "../../../shared/interfaces/country-interface";
import {StaticDataService} from "../../../shared/services/static-data.service";
import {SpinnerService} from "../../../shared/services/spinner.service";
import {projectTypeListConstant} from "../../../core/constants/project-type-list.constant";
import {timeDurationListConstant} from "../../../core/constants/time-duration-list.constant";
import {FormBuilder, FormGroup} from "@angular/forms";
import {SnackBarService} from "../../../shared/services/snack-bar.service";
import {SearchAdminProjectFormGroup} from "../../../core/types/form-groups/admin/search-admin-project-form-group";
import {AdminProjectDataInterface} from "../../../shared/interfaces/admin/projects/admin-project-data.interface";
import {Page} from "../../../shared/interfaces/general/page.interface";
import {ProjectSortClauseEnum} from "../../../core/enums/admin/project-sort-clause.enum";
import {PagingEvent} from "../../../shared/interfaces/admin/developers/paging-event.interface";
import {AdminProjectService} from "../../../shared/services/admin/admin-project.service";
import {
  AdminGetProjectsRequestInterface
} from "../../../shared/interfaces/admin/projects/admin-get-projects-request.interface";
import {ProjectType} from "../../../core/enums/project-type.enum";
import {TimeDuration} from "../../../core/enums/time-duration.enum";

@Component({
  selector: 'collabro-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit, OnDestroy {
  public projectTypeListConstant = projectTypeListConstant;
  public timeDurationListConstant = timeDurationListConstant;
  public form: FormGroup<SearchAdminProjectFormGroup>;
  public projects: Page<AdminProjectDataInterface> = null;

  public countries$: Observable<CountryInterface[]> = this.staticDataService.getAllCountries();

  private readonly unsubscribe$: Subject<void> = new Subject<void>()

  constructor(private readonly spinnerService: SpinnerService,
              private readonly fb: FormBuilder,
              private readonly cdr: ChangeDetectorRef,
              private readonly adminProjectService: AdminProjectService,
              private readonly notificationService: SnackBarService,
              private readonly staticDataService: StaticDataService) {
  }

  ngOnInit(): void {
    this.setupForm();
    this.getAdminProjects();
    this.subscribeToSearchTermFormControl();
    this.subscribeToCountryCodesFormControl();
    this.subscribeToProjectTypeFormControl();
    this.subscribeToTimeDurationFormControl();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public resetSearch(): void {
    this.form.controls.searchTerm.setValue('');
  }

  public paging(event: PagingEvent): void {
    this.form.controls.currentPage.setValue(event.offset);
  }

  public sort(event: { sorts: { prop: ProjectSortClauseEnum; dir: 'asc' | 'desc' }[] }): void {
    if (event.sorts.length > 0) {
      const sort = event.sorts[0];

      if (Object.values(ProjectSortClauseEnum).includes(sort.prop)) {
        this.form.controls.sortByProperty.setValue(sort.prop);
      } else {
        this.form.controls.sortByProperty.setValue(ProjectSortClauseEnum.Title); // Default fallback
      }

      this.form.controls.sortOrder.setValue(sort.dir);
      this.getAdminProjects();
    }
  }

  public rowIdentity = (row: AdminProjectDataInterface) => row.id;

  private subscribeToSearchTermFormControl(): void {
    this.form.controls['searchTerm'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => {
        this.getAdminProjects();
      });
  }

  private subscribeToCountryCodesFormControl(): void {
    this.form.controls['countryCodes'].valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(value => {
        this.form.patchValue({ countryCodes: value }, { emitEvent: false });

        this.getAdminProjects();
      });

  }

  private subscribeToProjectTypeFormControl(): void {
    this.form.controls['projectTypes'].valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(value => {
        this.form.patchValue({ projectTypes: value }, { emitEvent: false });

        this.getAdminProjects();
      });

  }

  private subscribeToTimeDurationFormControl(): void {
    this.form.controls['projectTimeDurations'].valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(value => {
        this.form.patchValue({ projectTimeDurations: value }, { emitEvent: false });

        this.getAdminProjects();
      });

  }

  private getAdminProjects(): void {
    this.spinnerService.showSpinner();

    this.adminProjectService.getProjects(this.form.value as AdminGetProjectsRequestInterface)
      .pipe(
        finalize(() => this.spinnerService.hideSpinner()),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: data => {
          this.projects = data;
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      });

    this.cdr.detectChanges();
  }

  private setupForm(): void {
    this.form = this.fb.group<SearchAdminProjectFormGroup>({
      projectTimeDurations: this.fb.control<TimeDuration[]>([TimeDuration.PartTime, TimeDuration.FullTime]),
      projectTypes: this.fb.control<ProjectType[]>([]),
      searchTerm: this.fb.control(''),
      countryCodes: this.fb.control<string[]>(["UA", "US"]),
      currentPage: this.fb.control<number>(0),
      pageSize: this.fb.control<number>(20),
      sortByProperty: this.fb.control<ProjectSortClauseEnum>(ProjectSortClauseEnum.Title),
      sortOrder: this.fb.control<'desc' | 'asc'>('desc')
    });
  }
}
