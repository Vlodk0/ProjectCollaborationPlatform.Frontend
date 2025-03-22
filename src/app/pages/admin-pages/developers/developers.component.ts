import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {SpinnerService} from "../../../shared/services/spinner.service";
import {AdminDeveloperService} from "../../../shared/services/admin/admin-developer.service";
import {SnackBarService} from "../../../shared/services/snack-bar.service";
import {StaticDataService} from "../../../shared/services/static-data.service";
import {debounceTime, distinctUntilChanged, filter, finalize, Observable, Subject, takeUntil} from "rxjs";
import {CountryInterface} from "../../../shared/interfaces/country-interface";
import {FormBuilder, FormGroup} from "@angular/forms";
import {SearchAdminUserFormGroup} from "../../../core/types/form-groups/admin/search-admin-user-form-group";
import {UserSortingClauseEnum} from "../../../core/enums/admin/user-sorting-clause.enum";
import {
  AdminGetUsersRequestInterface
} from "../../../shared/interfaces/admin/developers/admin-get-users-request.interface";
import {PagingEvent} from "../../../shared/interfaces/admin/developers/paging-event.interface";
import {DeveloperInterface} from "../../../shared/interfaces/developer/developer.interface";
import {
  DeveloperInfoDialogComponent
} from "../../../shared/components/dialogs/developer-info/developer-info-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {AdminDeveloperDataInterface} from "../../../shared/interfaces/admin/developers/admin-developer-data.interface";
import {Page} from "../../../shared/interfaces/general/page.interface";
import {developerPositionListConstant} from "../../../core/constants/developer-position-list.constant";

@Component({
  selector: 'collabro-developers',
  templateUrl: './developers.component.html',
  styleUrl: './developers.component.scss'
})
export class DevelopersComponent implements OnInit, OnDestroy {
  public form: FormGroup<SearchAdminUserFormGroup>;
  public developers: Page<AdminDeveloperDataInterface>;
  public developerPositionListConstant = developerPositionListConstant;

  public countries$: Observable<CountryInterface[]> = this.staticDataService.getAllCountries();

  private readonly unsubscribe$: Subject<void> = new Subject<void>()

  constructor(private readonly spinnerService: SpinnerService,
              private readonly fb: FormBuilder,
              private readonly cdr: ChangeDetectorRef,
              private readonly matDialog: MatDialog,
              private readonly adminDeveloperService: AdminDeveloperService,
              private readonly notificationService: SnackBarService,
              private readonly staticDataService: StaticDataService) {
  }

  ngOnInit(): void {
    this.setupForm();
    this.getAdminDevelopers();
    this.subscribeToSearchTermFormControl();
    this.subscribeToCountryCodesFormControl();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public openDeveloperInfoDialog(developer: DeveloperInterface, developerAvatar?: string | ArrayBuffer): void {
    const dialogRef = this.matDialog.open(DeveloperInfoDialogComponent, {
      disableClose: false,
      data: {
        developer: developer,
        developerAvatar: developerAvatar
      }
    });

    dialogRef.afterClosed()
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((result) => result)
      )
      .subscribe({
        next: () => {
          this.getAdminDevelopers();
        }
      });
  }

  private getAdminDevelopers(): void {
    this.spinnerService.showSpinner();

    this.adminDeveloperService.getDevelopers(this.form.value as AdminGetUsersRequestInterface)
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
    this.getAdminDevelopers();
  }

  public sort(event: { sorts: { prop: UserSortingClauseEnum; dir: 'asc' | 'desc' }[] }): void {
    if (event.sorts.length > 0) {
      const sort = event.sorts[0];

      if (Object.values(UserSortingClauseEnum).includes(sort.prop)) {
        this.form.controls.sortByProperty.setValue(sort.prop);
      } else {
        this.form.controls.sortByProperty.setValue(UserSortingClauseEnum.FirstName); // Default fallback
      }

      this.form.controls.sortOrder.setValue(sort.dir);
      this.getAdminDevelopers();
    }
  }


  public rowIdentity = (row: DeveloperInterface) => row.id;

  private subscribeToSearchTermFormControl(): void {
    this.form.controls['searchTerm'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => {
        this.getAdminDevelopers();
      });
  }

  private subscribeToCountryCodesFormControl(): void {
    this.form.controls['countryCodes'].valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(value => {
        this.form.patchValue({ countryCodes: value }, { emitEvent: false });

        this.getAdminDevelopers();
      });

  }

  private setupForm(): void {
    this.form = this.fb.group<SearchAdminUserFormGroup>({
      searchTerm: this.fb.control(''),
      countryCodes: this.fb.control<string[]>(["UA", "US"]),
      currentPage: this.fb.control<number>(0),
      pageSize: this.fb.control<number>(10),
      sortByProperty: this.fb.control<UserSortingClauseEnum>(UserSortingClauseEnum.FirstName),
      sortOrder: this.fb.control<'desc' | 'asc'>('desc')
    });
  }
}
