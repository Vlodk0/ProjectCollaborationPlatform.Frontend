import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {SearchAdminUserFormGroup} from "../../../core/types/form-groups/admin/search-admin-user-form-group";
import {Page} from "../../../shared/interfaces/general/page.interface";
import {debounceTime, distinctUntilChanged, finalize, Observable, Subject, takeUntil} from "rxjs";
import {CountryInterface} from "../../../shared/interfaces/country-interface";
import {SpinnerService} from "../../../shared/services/spinner.service";
import {MatDialog} from "@angular/material/dialog";
import {SnackBarService} from "../../../shared/services/snack-bar.service";
import {StaticDataService} from "../../../shared/services/static-data.service";
import {
  AdminProjectOwnerDataInterface
} from "../../../shared/interfaces/admin/project-owners/admin-project-owner-data.interface";
import {AdminProjectOwnerService} from "../../../shared/services/admin/admin-project-owner.service";
import {UserSortingClauseEnum} from "../../../core/enums/admin/user-sorting-clause.enum";
import {PagingEvent} from "../../../shared/interfaces/admin/developers/paging-event.interface";
import {
  AdminGetUsersRequestInterface
} from "../../../shared/interfaces/admin/developers/admin-get-users-request.interface";

@Component({
  selector: 'collabro-project-owners',
  templateUrl: './project-owners.component.html',
  styleUrl: './project-owners.component.scss'
})
export class ProjectOwnersComponent implements OnInit, OnDestroy {
  public form: FormGroup<SearchAdminUserFormGroup>;
  public developers: Page<AdminProjectOwnerDataInterface>;

  public countries$: Observable<CountryInterface[]> = this.staticDataService.getAllCountries();

  private readonly unsubscribe$: Subject<void> = new Subject<void>()

  constructor(private readonly spinnerService: SpinnerService,
              private readonly fb: FormBuilder,
              private readonly cdr: ChangeDetectorRef,
              private readonly matDialog: MatDialog,
              private readonly adminProjectOwnerService: AdminProjectOwnerService,
              private readonly notificationService: SnackBarService,
              private readonly staticDataService: StaticDataService) {
  }

  ngOnInit(): void {
    this.setupForm();
    this.getAdminProjectOwners();
    this.subscribeToSearchTermFormControl();
    this.subscribeToCountryCodesFormControl();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private getAdminProjectOwners(): void {
    this.spinnerService.showSpinner();

    this.adminProjectOwnerService.getProjectOwners(this.form.value as AdminGetUsersRequestInterface)
      .pipe(
        finalize(() => this.spinnerService.hideSpinner()),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: data => {
          this.developers = data;
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      });

    this.cdr.detectChanges();
  }

  public resetSearch(): void {
    this.form.controls.searchTerm.setValue('');
  }

  public paging(event: PagingEvent): void {
    this.form.controls.currentPage.setValue(event.offset);
    this.getAdminProjectOwners();
  }

  public sort(event: { sorts: { prop: UserSortingClauseEnum; dir: 'asc' | 'desc' }[] }): void {
    if (event.sorts.length > 0) {
      const sort = event.sorts[0];

      if (Object.values(UserSortingClauseEnum).includes(sort.prop)) {
        this.form.controls.sortByProperty.setValue(sort.prop);
      } else {
        this.form.controls.sortByProperty.setValue(UserSortingClauseEnum.FirstName);
      }

      this.form.controls.sortOrder.setValue(sort.dir);
      this.getAdminProjectOwners();
    }
  }

  public rowIdentity = (row: AdminProjectOwnerDataInterface) => row.id;

  private subscribeToSearchTermFormControl(): void {
    this.form.controls['searchTerm'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => {
        this.getAdminProjectOwners();
      });
  }

  private subscribeToCountryCodesFormControl(): void {
    this.form.controls['countryCodes'].valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(value => {
        this.form.patchValue({ countryCodes: value }, { emitEvent: false });

        this.getAdminProjectOwners();
      });

  }

  private setupForm(): void {
    this.form = this.fb.group<SearchAdminUserFormGroup>({
      searchTerm: this.fb.control(''),
      countryCodes: this.fb.control<string[]>(["UA", "US"]),
      currentPage: this.fb.control<number>(0),
      pageSize: this.fb.control<number>(20),
      sortByProperty: this.fb.control<UserSortingClauseEnum>(UserSortingClauseEnum.FirstName),
      sortOrder: this.fb.control<'desc' | 'asc'>('desc')
    });
  }
}
