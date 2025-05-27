import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {TechnologyInterface} from "../../../interfaces/project/technology.interface";
import {finalize, Subject, takeUntil} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {TechnologyService} from "../../../services/technology.service";
import {SpinnerService} from "../../../services/spinner.service";
import {SnackBarService} from "../../../services/snack-bar.service";
import {DeveloperTechnologyService} from "../../../services/developer-technology.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'collabro-technology-dialog',
  templateUrl: './technology-dialog.component.html',
  styleUrl: './technology-dialog.component.scss'
})
export class TechnologyDialogComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject();

  public technologies: TechnologyInterface[] = [];
  public projectForm: FormGroup;
  public firstTechnologyColumn: TechnologyInterface[] = [];
  public secondTechnologyColumn: TechnologyInterface[] = [];
  public thirdTechnologyColumn: TechnologyInterface[] = [];

  constructor(private readonly fb: FormBuilder,
              private readonly technologyService: TechnologyService,
              private readonly spinnerService: SpinnerService,
              private readonly notificationService: SnackBarService,
              private readonly dialogRef: MatDialogRef<TechnologyDialogComponent>,
              private readonly developerTechnologyService: DeveloperTechnologyService,
              @Inject(MAT_DIALOG_DATA) public data: {
                developerTechnologies: TechnologyInterface[],
              }) {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.setForm();
    this.getTechnologies();
  }

  public onTechnologyCheckboxChange(id: string, isChecked: boolean): void {
    const currentIds: string[] = this.projectForm.get('technologyIds').value;
    const updatedIds = isChecked
      ? [...currentIds, id]
      : currentIds.filter(currentId => currentId !== id);
    this.projectForm.get('technologyIds').setValue(updatedIds);
  }

  private setForm(): void {
    this.projectForm = this.fb.group({
      technologyIds: this.fb.control<string[]>([])
    })

    if (this.data?.developerTechnologies) {
      const technologyIds = this.data?.developerTechnologies.map(item => item.id);
      this.projectForm.patchValue({
        technologyIds: technologyIds
      });
    }
  }

  private getTechnologies(): void {
    this.technologyService.getAllTechnologies()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (technologies: TechnologyInterface[]) => {
          this.technologies = technologies;

          this.firstTechnologyColumn = this.technologies.slice(0, 6);
          this.secondTechnologyColumn = this.technologies.slice(6, 12);
          this.thirdTechnologyColumn = this.technologies.slice(12, 18);
        }
      });
  }

  public addTechnologiesForDeveloper(): void {
    this.spinnerService.showSpinner()

    this.developerTechnologyService.addTechnologyForDeveloper(this.projectForm.value)
      .pipe(
        finalize(() => this.spinnerService.hideSpinner()),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccessNotification();
          this.dialogRef.close(true);
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      })
  }
}
