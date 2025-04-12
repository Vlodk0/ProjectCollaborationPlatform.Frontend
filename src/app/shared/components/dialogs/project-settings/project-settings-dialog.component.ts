import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ProjectInterface} from "../../../interfaces/project/project.interface";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ProjectsService} from "../../../services/projects.service";
import {SnackBarService} from "../../../services/snack-bar.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {finalize, Subject, takeUntil} from "rxjs";
import {TimeDuration} from "../../../../core/enums/time-duration.enum";
import {PaymentTypeEnum} from "../../../../core/enums/payment-type.enum";
import {UpdateProjectFormGroup} from "../../../../core/types/form-groups/update-project-form-group";
import {SpinnerService} from "../../../services/spinner.service";
import {UpdateProjectInterface} from "../../../interfaces/project/update-project.interface";
import {paymentTypeListConstant} from "../../../../core/constants/payment-type-list.constant";
import {timeDurationListConstant} from "../../../../core/constants/time-duration-list.constant";
import {FrameworkInterface} from "../../../interfaces/project/framework.interface";
import {TechnologyInterface} from "../../../interfaces/project/technology.interface";
import {FrameworkService} from "../../../services/framework.service";
import {TechnologyService} from "../../../services/technology.service";

@Component({
  selector: 'collabro-project-settings',
  templateUrl: './project-settings-dialog.component.html',
  styleUrl: './project-settings-dialog.component.scss'
})
export class ProjectSettingsDialogComponent implements OnInit, OnDestroy {
  public projectForm: FormGroup<UpdateProjectFormGroup>;
  public paymentTypeListConstant = paymentTypeListConstant;
  public timeDurationListConstant = timeDurationListConstant;
  public technologies: TechnologyInterface[] = [];
  public frameworks: FrameworkInterface[] = [];

  public firstTechnologyColumn = [];
  public secondTechnologyColumn = [];
  public thirdTechnologyColumn = [];

  public firstFrameworkColumn: FrameworkInterface[] = [];
  public secondFrameworkColumn: FrameworkInterface[] = [];
  public thirdFrameworkColumn: FrameworkInterface[] = [];

  private readonly unsubscribe$: Subject<void> = new Subject();

  constructor(private readonly projectService: ProjectsService,
              private readonly dialogRef: MatDialogRef<ProjectSettingsDialogComponent>,
              private readonly spinnerService: SpinnerService,
              private readonly fb: FormBuilder,
              private readonly frameworkService: FrameworkService,
              private readonly technologyService: TechnologyService,
              private readonly snackBarService: SnackBarService,
              @Inject(MAT_DIALOG_DATA) public data: {
                project: ProjectInterface
              }) {
    this.setForm();
  }

  ngOnInit(): void {
    this.getTechnologies();
    this.getFrameworks();
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public onTechnologyCheckboxChange(id: string, isChecked: boolean): void {
    const currentIds: string[] = this.projectForm.get('technologyIds').value;
    const updatedIds = isChecked
      ? [...currentIds, id]
      : currentIds.filter(currentId => currentId !== id);
    this.projectForm.get('technologyIds').setValue(updatedIds);
  }

  public onFrameworkCheckboxChange(id: string, isChecked: boolean): void {
    const currentIds: string[] = this.projectForm.get('frameworkIds').value;
    const updatedIds = isChecked
      ? [...currentIds, id]
      : currentIds.filter(currentId => currentId !== id);
    this.projectForm.get('frameworkIds').setValue(updatedIds);
  }

  public updateProject(): void {
    this.spinnerService.showSpinner();

    this.projectService.updateProject(this.data?.project.id, this.projectForm.value as UpdateProjectInterface)
      .pipe(finalize(() => {
          this.spinnerService.hideSpinner();
        }),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.snackBarService.showSuccessNotification();
          this.dialogRef.close(true);
        },
        error: (error) => this.snackBarService.showErrorNotification(error?.error?.detail)
      })
  }

  private getTechnologies(): void {
    this.spinnerService.showSpinner();

    this.technologyService.getAllTechnologies()
      .pipe(finalize(() => {
          this.spinnerService.hideSpinner();
        }),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: (technologies: TechnologyInterface[]) => {
          this.technologies = technologies;

          this.firstTechnologyColumn = this.technologies.slice(0, 6);
          this.secondTechnologyColumn = this.technologies.slice(6, 12);
          this.thirdTechnologyColumn = this.technologies.slice(12, 18);
        }
      });
  }

  private getFrameworks(): void {
    this.spinnerService.showSpinner();

    this.frameworkService.getAllFrameworks()
      .pipe(finalize(() => {
          this.spinnerService.hideSpinner();
        }),
        takeUntil(this.unsubscribe$))
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
    this.projectForm = this.fb.group<UpdateProjectFormGroup>({
      title: this.fb.control<string>(this.data?.project?.title ?? null, [Validators.required]),
      payment: this.fb.control<number>(this.data?.project?.payment ?? null, [Validators.required]),
      projectDetails: this.fb.control<string>(this.data?.project?.projectDetails ?? null, [Validators.required]),
      timeDuration: this.fb.control<TimeDuration>(this.data?.project?.timeDuration ?? null, [Validators.required]),
      frameworkIds: this.fb.control<string[]>(this.data?.project?.frameworks?.map(t => t.id) ?? [], [Validators.required]),
      technologyIds: this.fb.control<string[]>(this.data?.project?.technologies?.map(t => t.id) ?? [], [Validators.required]),
      paymentType: this.fb.control<PaymentTypeEnum>(this.data?.project?.paymentType ?? null, [Validators.required])
    });
  }
}
