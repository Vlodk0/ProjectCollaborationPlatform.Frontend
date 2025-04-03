import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {createProjectStepperListConstant} from "../../../core/constants/create-project-stepper-list.constant";
import {CreateProjectStepperListEnum} from "../../../core/enums/create-project-stepper-list.enum";
import {StepperSelectionEvent} from "@angular/cdk/stepper";
import {MatStepper} from "@angular/material/stepper";
import {projectTypeListConstant} from "../../../core/constants/project-type-list.constant";
import {timeDurationListConstant} from "../../../core/constants/time-duration-list.constant";
import {CreateProjectFormGroup} from "../../../core/types/form-groups/create-project-form-group";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TechnologyInterface} from "../../../shared/interfaces/project/technology.interface";
import {TechnologyService} from "../../../shared/services/technology.service";
import {finalize, Subject, takeUntil} from "rxjs";
import {FrameworkService} from "../../../shared/services/framework.service";
import {FrameworkInterface} from "../../../shared/interfaces/project/framework.interface";
import {ProjectType} from "../../../core/enums/project-type.enum";
import {TimeDuration} from "../../../core/enums/time-duration.enum";
import {ProjectsService} from "../../../shared/services/projects.service";
import {SpinnerService} from "../../../shared/services/spinner.service";
import {CreateProjectInterface} from "../../../shared/interfaces/project/create-project.interface";
import {SnackBarService} from "../../../shared/services/snack-bar.service";
import {PaymentTypeEnum} from "../../../core/enums/payment-type.enum";
import {paymentTypeListConstant} from "../../../core/constants/payment-type-list.constant";

@Component({
  selector: 'collabro-create-project',
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.scss'
})
export class CreateProjectComponent implements OnInit, OnDestroy {
  @ViewChild('stepper') public stepper: MatStepper;

  private unsubscribe$: Subject<void> = new Subject();

  public stepIndex: string = CreateProjectStepperListEnum.TitleAndType;
  public selectedIndex: string = '0';
  public createProjectStepperListEnum = CreateProjectStepperListEnum;
  public projectTypeListConstant = projectTypeListConstant;
  public timeDurationListConstant = timeDurationListConstant;
  public paymentTypeListConstant = paymentTypeListConstant;
  public projectForm: FormGroup<CreateProjectFormGroup>;
  public technologies: TechnologyInterface[] = [];
  public frameworks: FrameworkInterface[] = [];

  public firstTechnologyColumn = [];
  public secondTechnologyColumn = [];
  public thirdTechnologyColumn = [];

  public firstFrameworkColumn: FrameworkInterface[] = [];
  public secondFrameworkColumn: FrameworkInterface[] = [];
  public thirdFrameworkColumn: FrameworkInterface[] = [];


  constructor(private readonly location: Location,
              private readonly technologyService: TechnologyService,
              private readonly frameworkService: FrameworkService,
              private readonly fb: FormBuilder,
              private readonly projectService: ProjectsService,
              private readonly spinnerService: SpinnerService,
              private readonly notificationService: SnackBarService) {
    this.setForm();
  }

  public ngOnInit(): void {
    this.getTechnologies();
    this.getFrameworks();
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public get isValidStep(): boolean {
    switch (this.stepIndex) {
      case CreateProjectStepperListEnum.TitleAndType:
        return !!this.projectForm.get('title').value && !!this.projectForm.get('type').value;
      case CreateProjectStepperListEnum.ProjectDetails:
        return !!this.projectForm.get('projectDetails').value
      case CreateProjectStepperListEnum.PaymentAndDuration:
        return !!this.projectForm.get('payment').value
          && !!this.projectForm.get('timeDuration').value
          && !!this.projectForm.get('paymentType').value;
      case CreateProjectStepperListEnum.Technologies:
        return !!this.projectForm.get('technologyIds').value?.length
      case CreateProjectStepperListEnum.Frameworks:
        return !!this.projectForm.get('frameworkIds').value?.length;
      default:
        return false;
    }
  }

  public previousStep(): void {
    this.stepper.previous();
  }

  public nextStep(): void {
    this.stepper.next();
  }

  public goBack(): void {
    this.location.back();
  }

  public get title(): string {
    return createProjectStepperListConstant.find(el => el.index === this.stepIndex)?.label;
  }

  public selectionChange(step: StepperSelectionEvent): void {
    this.stepIndex = step.selectedStep.label;

    switch (this.stepIndex) {
      case CreateProjectStepperListEnum.TitleAndType:
        this.cleanToFirstStep()
        break;
      case CreateProjectStepperListEnum.ProjectDetails:
        this.cleanToSecondStep()
        break;
      case CreateProjectStepperListEnum.PaymentAndDuration:
        this.cleanToThirdStep()
        break;
      case CreateProjectStepperListEnum.Technologies:
        this.cleanToFourthStep();
        break;
      default:
        break;
    }
  }

  public createProject(): void {
    this.spinnerService.showSpinner();

    this.projectService.createProject(this.projectForm.value as CreateProjectInterface)
      .pipe(
        finalize(() => this.spinnerService.hideSpinner()),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.location.back();
          this.notificationService.showSuccessNotification()
          this.spinnerService.hideSpinner();
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      })
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

  private cleanToFirstStep(): void {
    this.projectForm.get('title').setValue(null);
    this.projectForm.get('type').setValue(null);
    this.projectForm.get('projectDetails').setValue(null);
    this.projectForm.get('payment').setValue(0);
    this.projectForm.get('timeDuration').setValue(null);
    this.projectForm.get('technologyIds').setValue([]);
    this.projectForm.get('frameworkIds').setValue([]);
  }

  private cleanToSecondStep(): void {
    this.projectForm.get('projectDetails').setValue(null);
    this.projectForm.get('payment').setValue(0);
    this.projectForm.get('timeDuration').setValue(null);
    this.projectForm.get('technologyIds').setValue([]);
    this.projectForm.get('frameworkIds').setValue([]);
  }

  private cleanToThirdStep(): void {
    this.projectForm.get('payment').setValue(0);
    this.projectForm.get('timeDuration').setValue(null);
    this.projectForm.get('technologyIds').setValue([]);
    this.projectForm.get('frameworkIds').setValue([]);
  }

  private cleanToFourthStep(): void {
    this.projectForm.get('technologyIds').setValue([]);
    this.projectForm.get('frameworkIds').setValue([]);
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
    this.projectForm = this.fb.group<CreateProjectFormGroup>({
      title: this.fb.control<string>('', Validators.required),
      payment: this.fb.control<number>(null, Validators.required),
      projectDetails: this.fb.control<string>('', Validators.required),
      type: this.fb.control<ProjectType>(null, Validators.required),
      timeDuration: this.fb.control<TimeDuration>(null, Validators.required),
      frameworkIds: this.fb.control([]),
      technologyIds: this.fb.control([]),
      paymentType: this.fb.control<PaymentTypeEnum>(null, Validators.required)
    });
  }
}
