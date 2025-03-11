import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {taskLabelTypeListConstant} from "../../../../core/constants/task-label-type-list.constant";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FunctionalityBlockService} from "../../../services/functionality-block.service";
import {finalize, Subject, takeUntil} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CreateProjectTaskFormGroup} from "../../../../core/types/form-groups/create-project-task-form-group";
import {TaskLabelType} from "../../../../core/enums/task-label-type.enum";
import {SpinnerService} from "../../../services/spinner.service";
import {SnackBarService} from "../../../services/snack-bar.service";
import {
  CreateFunctionalityBlockInterface
} from "../../../interfaces/functionality-block/create-functionality-block.interface";
import {DeveloperInterface} from "../../../interfaces/developer/developer.interface";
import {FunctionalityBlockInterface} from "../../../interfaces/functionality-block/functionality-block.interface";

@Component({
  selector: 'collabro-project-task',
  templateUrl: './project-task-dialog.component.html',
  styleUrl: './project-task-dialog.component.scss'
})
export class ProjectTaskDialogComponent implements OnDestroy, OnInit {
  public taskLabelTypeListConstant = taskLabelTypeListConstant;
  public projectTaskForm: FormGroup<CreateProjectTaskFormGroup>;

  private readonly unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly functionalityBlockService: FunctionalityBlockService,
              private readonly spinnerService: SpinnerService,
              private readonly notificationService: SnackBarService,
              private readonly fb: FormBuilder,
              private readonly dialogRef: MatDialogRef<ProjectTaskDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {
                projectId: string,
                task: FunctionalityBlockInterface,
                taskName: string,
                description: string,
                label: TaskLabelType,
                developers: DeveloperInterface[]
              }) {

  }

  ngOnInit(): void {
    this.setForm();
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public addProjectTask(): void {
    this.spinnerService.showSpinner();

    this.functionalityBlockService.createFunctionalityBlock(this.projectTaskForm.value as CreateFunctionalityBlockInterface, this.data.projectId)
      .pipe(
        finalize(() => this.spinnerService.hideSpinner()),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccessNotification();
          this.dialogRef.close(true);
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      });
  }

  public updateProjectTask(): void {
    this.spinnerService.showSpinner();

    this.functionalityBlockService.updateFunctionalityBlock(this.projectTaskForm.value as CreateFunctionalityBlockInterface, this.data?.task?.id)
      .pipe(
        finalize(() => this.spinnerService.hideSpinner()),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccessNotification();
          this.dialogRef.close(true);
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      });
  }

  public deleteProjectTask(): void {
    this.spinnerService.showSpinner();

    this.functionalityBlockService.deleteFunctionalityBlock(this.data?.task?.id)
      .pipe(
        finalize(() => this.spinnerService.hideSpinner()),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccessNotification();
          this.dialogRef.close(true);
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      });
  }

  public assignProjectTask(developerId: string): void {
    if (!developerId) return;

    this.spinnerService.showSpinner();

    this.functionalityBlockService.assignProjectTask(this.data?.task?.id, developerId)
      .pipe(
        finalize(() => this.spinnerService.hideSpinner()),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccessNotification();
          this.dialogRef.close(true);
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      });
  }

  private setForm(): void {
    this.projectTaskForm = this.fb.group<CreateProjectTaskFormGroup>({
      taskName: this.fb.control<string>('', Validators.required),
      description: this.fb.control<string>('', Validators.required),
      label: this.fb.control<TaskLabelType>(null, Validators.required)
    });

    if (this.data?.task?.id) {
      this.projectTaskForm.patchValue({
        taskName: this.data.taskName,
        description: this.data.description,
        label: this.data.label
      });
    }
  }
}
