import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {StaticDataService} from "../../../services/static-data.service";
import {finalize, Observable, Subject, take, takeUntil} from "rxjs";
import {CountryInterface} from "../../../interfaces/country-interface";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UpdateAddressFormGroup} from "../../../../core/types/form-groups/update-address-form-group";
import {SpinnerService} from "../../../services/spinner.service";
import {UserService} from "../../../services/user.service";
import {UpdateAddressInterface} from "../../../interfaces/user/update-address.interface";
import {NotificationService} from "../../../services/notification.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'collabro-user-address',
  templateUrl: './user-address-dialog.component.html',
  styleUrl: './user-address-dialog.component.scss'
})
export class UserAddressDialogComponent implements OnInit, OnDestroy {
  public addressForm: FormGroup<UpdateAddressFormGroup>;

  public countries$: Observable<CountryInterface[]> = this.staticDataService.getAllCountries();
  public states$: Observable<string[]> = this.staticDataService.getAllStates('us');

  private readonly unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly staticDataService: StaticDataService,
              private readonly dialogRef: MatDialogRef<UserAddressDialogComponent>,
              private readonly userService: UserService,
              private readonly fb: FormBuilder,
              private readonly spinnerService: SpinnerService,
              private readonly notificationService: NotificationService,
              @Inject(MAT_DIALOG_DATA) public data: {
                countryCode: string,
                city: string,
                state: string,
              }) {
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.setForm();
    if (this.data?.countryCode) {
      this.loadStates(this.data.countryCode);
    }
   this.handleCountryCodeChange();
  }

  private loadStates(countryCode: string): void {
    this.states$ = this.staticDataService.getAllStates(countryCode.toLowerCase());
    this.states$.pipe(take(1)).subscribe((states) => {
      if (states.includes(this.data?.state)) {
        this.addressForm.get('state')!.setValue(this.data?.state);
      }
    });
  }

  private handleCountryCodeChange(): void {
    this.addressForm.get('countryCode')!.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((countryCode: string) => {
        if (countryCode) {
          this.states$ = this.staticDataService.getAllStates(countryCode.toLowerCase());
          this.states$.pipe(take(1)).subscribe((states) => {
            const currentState = this.data?.state;
            if (states.includes(currentState)) {
              this.addressForm.get('state')!.setValue(currentState);
            } else {
              this.addressForm.get('state')!.reset();
            }
          });
        }
      });
  }



  private setForm(): void {
    this.addressForm = this.fb.group<UpdateAddressFormGroup>({
      countryCode: this.fb.control<string>(this.data?.countryCode ?? '', [Validators.required]),
      city: this.fb.control<string>(this.data?.city ?? '', [Validators.required]),
      state: this.fb.control<string>(this.data?.state ?? '', [Validators.required])
    });
  }

  public updateUserAddress(): void {
    this.spinnerService.showSpinner();

    this.userService.updateAddress(this.addressForm.value as UpdateAddressInterface)
      .pipe(
        finalize(() => this.spinnerService.hideSpinner()),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccessNotification()
          this.dialogRef.close(true);
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      })
  }
}
