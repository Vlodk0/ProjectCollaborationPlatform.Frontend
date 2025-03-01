import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {debounceTime, finalize, Observable, Subject, takeUntil} from "rxjs";
import {DeveloperService} from "../../../shared/services/developer.service";
import {GetUser} from "../../../shared/interfaces/get-user";
import {UserService} from "../../../shared/services/user.service";
import {SpinnerService} from "../../../shared/services/spinner.service";
import {DeveloperInterface} from "../../../shared/interfaces/developer/developer.interface";
import {NotificationService} from "../../../shared/services/notification.service";
import {DeveloperRequestFormGroup} from "../../../core/types/form-groups/developer-request-form-group";
import {FormBuilder, FormGroup} from "@angular/forms";
import {DeveloperRequestInterface} from "../../../shared/interfaces/developer/developer-request.interface";
import {MatMenuTrigger} from "@angular/material/menu";
import {CountryInterface} from "../../../shared/interfaces/country-interface";
import {StaticDataService} from "../../../shared/services/static-data.service";
import {TechnologyInterface} from "../../../shared/interfaces/project/technology.interface";
import {TechnologyService} from "../../../shared/services/technology.service";
import {FrameworkInterface} from "../../../shared/interfaces/project/framework.interface";
import {FrameworkService} from "../../../shared/services/framework.service";
import {DeveloperFilterInterface} from "../../../shared/interfaces/developer/developer-filter.interface";

@Component({
  selector: 'app-all-developers-page',
  templateUrl: './all-developers-page.component.html',
  styleUrl: './all-developers-page.component.scss'
})
export class AllDevelopersPageComponent implements OnDestroy, OnInit, AfterViewInit {
  @ViewChild('filterMenu') public filterMenu: MatMenuTrigger;

  public countries$: Observable<CountryInterface[]> = this.staticDataService.getAllCountries();

  public technologies: TechnologyInterface[];
  public frameworks: FrameworkInterface[];
  public isLoadingDevelopers = true;
  public developers: DeveloperInterface[] = []
  public developersFormGroup: FormGroup<DeveloperRequestFormGroup>;
  public user: GetUser = null;
  public menuIsClosed: boolean;

  private developersCurrentPage: number = 0;
  private totalDevelopers: number = 0;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly developerService: DeveloperService,
              private readonly userService: UserService,
              private readonly fb: FormBuilder,
              private readonly staticDataService: StaticDataService,
              private readonly spinnerService: SpinnerService,
              private readonly technologyService: TechnologyService,
              private readonly frameworkService: FrameworkService,
              private readonly notificationService: NotificationService) {
  }

  ngOnInit() {
    this.getUser();
    this.getDevelopers();
    this.setForm();
    this.subscribeToSearchTerm();
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

  public resetSearch(): void {
    this.developersFormGroup.patchValue({ searchTerm: '' });
    this.getDevelopers();
  }

  private subscribeToSearchTerm(): void {
    this.developersFormGroup.get('searchTerm').valueChanges
      .pipe(takeUntil(this.unsubscribe$), debounceTime(500))
      .subscribe({
        next: () => {
            this.developersFormGroup.patchValue({ currentPage: 0 });
            if (this.developersFormGroup.get('searchTerm').value.length) {
              this.filterDevelopers();
            }
        }
      });
  }

  private createParams(): DeveloperRequestInterface {
    const params: DeveloperRequestInterface = {} as DeveloperRequestInterface;

    for (const key in this.developersFormGroup.value) {
      if (this.developersFormGroup.value.hasOwnProperty(key) &&
        this.developersFormGroup.value[key] !== null) {
        params[key] = this.developersFormGroup.value[key];
      }
    }

    return params;
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

  public applyFilters(filters: DeveloperFilterInterface): void {
    this.developersFormGroup.patchValue({
      countryCodes: filters.selectedCountry,
      technologyIds: filters.selectedTechnologies,
      frameworkIds: filters.selectedFrameworks,
      currentPage: 0
    });

    this.filterMenu.closeMenu();

    this.filterDevelopers();
  }


  public loadingDevelopers(resetPage: boolean) {
    if (resetPage) {
      this.getDevelopers(false);
    } else if (this.totalDevelopers > this.developers.length && !this.isLoadingDevelopers) {
      this.getDevelopers(true);
    }
  }

  private getDevelopers(onScroll = false): void {
    this.spinnerService.showSpinner();

    if (!onScroll) {
      this.developersCurrentPage = 0;
    }

    this.isLoadingDevelopers = true;

    this.developerService.getDevelopers(this.developersCurrentPage, 20)
      .pipe(finalize(() => {
        this.isLoadingDevelopers = false;
        this.spinnerService.hideSpinner();
      }),
      takeUntil(this.unsubscribe$))
      .subscribe({
        next: result => {
          this.totalDevelopers = result.total;
          this.developersCurrentPage++;

          if (onScroll) {
            this.developers.push(...result.items);
          } else {
            this.developers = result.items;
          }
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      })
  }

  private filterDevelopers(onScroll = false): void {
    this.spinnerService.showSpinner();

    this.developerService.filterDevelopers(this.createParams())
      .pipe(
        finalize(() => {
          this.isLoadingDevelopers = false;
          this.spinnerService.hideSpinner();
        }),
        takeUntil(this.unsubscribe$))
    .subscribe({
      next: (value) => {
        onScroll ? this.developers.push(...value.items) : this.developers = value.items;

        this.totalDevelopers = value.total;
        this.developersFormGroup.patchValue({currentPage: this.developersFormGroup.get('currentPage').value + 1});
      },
      error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
    })
  }

  private setForm(): void {
    this.developersFormGroup = this.fb.group<DeveloperRequestFormGroup>({
      searchTerm: this.fb.control(''),
      countryCodes: this.fb.control([]),
      technologyIds: this.fb.control([]),
      frameworkIds: this.fb.control([]),
      currentPage: this.fb.control(0),
      pageSize: this.fb.control(20)
    });
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
}
