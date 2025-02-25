import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {TechnologyInterface} from "../../../interfaces/project/technology.interface";
import {FrameworkInterface} from "../../../interfaces/project/framework.interface";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ProjectFilterInterface} from "../../../interfaces/project/project-filter.interface";
import {ProjectFilterFormGroup} from "../../../../core/types/form-groups/project-filter-form-group";

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
  @Input() public menuIsClosed: boolean;

  @Output() public projectFilters = new EventEmitter<ProjectFilterInterface>();

  public projectFilterFormGroup: FormGroup<ProjectFilterFormGroup>;

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
    });
  }
}
