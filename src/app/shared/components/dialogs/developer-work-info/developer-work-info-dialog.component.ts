import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {finalize, Subject, takeUntil} from "rxjs";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DeveloperPositionEnum} from "../../../../core/enums/developer-position.enum";
import {SpinnerService} from "../../../services/spinner.service";
import {SnackBarService} from "../../../services/snack-bar.service";
import {DeveloperService} from "../../../services/developer.service";
import {developerPositionListConstant} from "../../../../core/constants/developer-position-list.constant";

@Component({
  selector: 'collabro-developer-work-info',
  templateUrl: './developer-work-info-dialog.component.html',
  styleUrl: './developer-work-info-dialog.component.scss'
})
export class DeveloperWorkInfoDialogComponent implements OnInit, OnDestroy {
  public developerInfoFormGroup: FormGroup;
  public developerPositionListConstant = developerPositionListConstant;

  private readonly unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly spinnerService: SpinnerService,
    private readonly snackBarService: SnackBarService,
    private readonly dialogRef: MatDialogRef<DeveloperWorkInfoDialogComponent>,
    private readonly developerService: DeveloperService,
    @Inject(MAT_DIALOG_DATA) public data: {
      position: DeveloperPositionEnum,
      hourlyPayment: number
    }) {
  }

  ngOnInit(): void {
    this.setForm();
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public updateDeveloperInfo(): void {
    this.spinnerService.showSpinner();

    this.developerService.updateDeveloperInfo(this.developerInfoFormGroup.value)
      .pipe(
        finalize(() => this.spinnerService.hideSpinner()),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.snackBarService.showSuccessNotification()
          this.dialogRef.close(true);
        },
        error: (error) => this.snackBarService.showErrorNotification(error?.error?.detail)
      })
  }

  private setForm(): void {
    this.developerInfoFormGroup = this.fb.group({
      position: this.fb.control<DeveloperPositionEnum>(this.data?.position ?? null, [Validators.required]),
      hourlyPayment: this.fb.control<number>(this.data?.hourlyPayment ?? null, [Validators.required])
    })
  }
}
