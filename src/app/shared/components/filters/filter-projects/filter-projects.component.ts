import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {TechnologyInterface} from "../../../interfaces/project/technology.interface";
import {FrameworkInterface} from "../../../interfaces/project/framework.interface";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ProjectFilterInterface} from "../../../interfaces/project/project-filter.interface";
import {ProjectFilterFormGroup} from "../../../../core/types/form-groups/project-filter-form-group";
import {PaymentTypeEnum} from "../../../../core/enums/payment-type.enum";
import {ProjectStatusEnum} from "../../../../core/enums/project-status.enum";
import { paymentTypeListConstant } from '../../../../core/constants/payment-type-list.constant';
import {projectStatusListConstant} from "../../../../core/constants/project-status-list.constant";

@Component({
  selector: 'collabro-filter-projects',
  templateUrl: './filter-projects.component.html',
  styleUrl: './filter-projects.component.scss'
})
export class FilterProjectsComponent implements OnInit, OnChanges {
  @Input() technologies: TechnologyInterface[];
  @Input() frameworks: FrameworkInterface[];
  @Input() public selectedTechnology: string[] | null;
  @Input() public selectedFramework: string[] | null;
  @Input() public selectedPaymentTypes: PaymentTypeEnum[] | null;
  @Input() public selectedProjectStatuses: ProjectStatusEnum[] | null;
  @Input() public menuIsClosed: boolean;

  @Output() public projectFilters = new EventEmitter<ProjectFilterInterface>();

  public projectFilterFormGroup: FormGroup<ProjectFilterFormGroup>;
  public paymentTypeListConstant = paymentTypeListConstant;
  public projectStatusListConstant = projectStatusListConstant;

  constructor(private readonly fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.setForm();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if ('menuIsClosed' in changes) {
      this.setForm();
    }
  }

  public clearFilters(): void {
    this.projectFilterFormGroup.reset();
    this.projectFilters.emit(this.projectFilterFormGroup.value as ProjectFilterInterface);
  }

  public applyFilters(): void {
    this.projectFilters.emit(this.projectFilterFormGroup.value as ProjectFilterInterface);
  }

  private setForm(): void {
    this.projectFilterFormGroup = this.fb.group<ProjectFilterFormGroup>({
      selectedFrameworks: this.fb.control( this.selectedFramework ?? null),
      selectedTechnologies: this.fb.control(this.selectedTechnology ?? null),
      selectedPaymentTypes: this.fb.control(this.selectedPaymentTypes ?? null),
      selectedProjectStatuses: this.fb.control(this.selectedProjectStatuses ?? [ProjectStatusEnum.Active])
    });
  }
}
