import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {finalize, Subject, takeUntil} from "rxjs";
import {StaticDataService} from "../../../services/static-data.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../../../services/user.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SpinnerService} from "../../../services/spinner.service";
import {NotificationService} from "../../../services/notification.service";

@Component({
  selector: 'collabro-user-personal-info',
  templateUrl: './user-personal-info-dialog.component.html',
  styleUrl: './user-personal-info-dialog.component.scss'
})
export class UserPersonalInfoDialogComponent implements OnInit, OnDestroy {
  public userPersonalInfoFormGroup: FormGroup;

  private readonly unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly staticDataService: StaticDataService,
              private readonly dialogRef: MatDialogRef<UserPersonalInfoDialogComponent>,
              private readonly userService: UserService,
              private readonly fb: FormBuilder,
              private readonly spinnerService: SpinnerService,
              private readonly notificationService: NotificationService,
              @Inject(MAT_DIALOG_DATA) public data: {
                firstName: string,
                lastName: string,
                bio: string,
              }) {
  }

  ngOnInit(): void {
    this.setForm();
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public updateUserPersonalInfo(): void {
    this.spinnerService.showSpinner();

    this.userService.updateUser(this.userPersonalInfoFormGroup.value)
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

  private setForm(): void {
    this.userPersonalInfoFormGroup = this.fb.group({
      firstName: this.fb.control<string>(this.data?.firstName ?? '', [Validators.required]),
      lastName: this.fb.control<string>(this.data?.lastName ?? '', [Validators.required]),
      bio: this.fb.control<string>(this.data?.bio ?? '')
    })
  }
}
