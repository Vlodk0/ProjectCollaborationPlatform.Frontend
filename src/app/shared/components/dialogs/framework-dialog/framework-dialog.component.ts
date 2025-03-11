import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {TechnologyInterface} from "../../../interfaces/project/technology.interface";
import {FrameworkInterface} from "../../../interfaces/project/framework.interface";
import {FrameworkService} from "../../../services/framework.service";
import {finalize, Subject, takeUntil} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {DeveloperFrameworkService} from "../../../services/developer-framework.service";
import {SpinnerService} from "../../../services/spinner.service";
import {SnackBarService} from "../../../services/snack-bar.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'collabro-framework-dialog',
  templateUrl: './framework-dialog.component.html',
  styleUrl: './framework-dialog.component.scss'
})
export class FrameworkDialogComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject();

  public technologies: TechnologyInterface[] = [];
  public frameworks: FrameworkInterface[] = [];
  public projectForm: FormGroup;

  public firstFrameworkColumn: FrameworkInterface[] = [];
  public secondFrameworkColumn: FrameworkInterface[] = [];
  public thirdFrameworkColumn: FrameworkInterface[] = [];

  constructor(private readonly frameworkService: FrameworkService,
              private readonly developerFrameworkService: DeveloperFrameworkService,
              private readonly spinnerService: SpinnerService,
              private readonly notificationService: SnackBarService,
              private readonly dialogRef: MatDialogRef<FrameworkDialogComponent>,
              private readonly fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: {
                developerFrameworks: FrameworkInterface[],
              }) {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.setForm();
    this.getFrameworks();
  }

  public addFrameworksForDeveloper(): void {
    this.spinnerService.showSpinner()

    this.developerFrameworkService.addFrameworksForDeveloper(this.projectForm.value)
      .pipe(
        finalize(() => this.spinnerService.hideSpinner()),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccessNotification();
          this.dialogRef.close();
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      })
  }

  public onFrameworkCheckboxChange(id: string, isChecked: boolean): void {
    const currentIds: string[] = this.projectForm.get('frameworkIds').value;
    const updatedIds = isChecked
      ? [...currentIds, id]
      : currentIds.filter(currentId => currentId !== id);
    this.projectForm.get('frameworkIds').setValue(updatedIds);
  }

  private getFrameworks(): void {
    this.frameworkService.getAllFrameworks()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (frameworks: FrameworkInterface[]) => {
          this.frameworks = frameworks;

          this.firstFrameworkColumn = this.frameworks.slice(0, 6);
          this.secondFrameworkColumn = this.frameworks.slice(6, 12);
          this.thirdFrameworkColumn = this.frameworks.slice(12, 18);
        }
      });
  }

  private setForm(): void {
    this.projectForm = this.fb.group({
      frameworkIds: this.fb.control<string[]>([])
    })

    if (this.data?.developerFrameworks) {
      const frameworkIds = this.data?.developerFrameworks.map(tech => tech.id);
      this.projectForm.patchValue({
        frameworkIds: frameworkIds
      });
    }
  }
}
