import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Observable} from "rxjs";
import {CountryInterface} from "../../../interfaces/country-interface";
import {TechnologyInterface} from "../../../interfaces/project/technology.interface";
import {FrameworkInterface} from "../../../interfaces/project/framework.interface";
import {DeveloperFilterInterface} from "../../../interfaces/developer/developer-filter.interface";
import {DeveloperFilterFormGroup} from "../../../../core/types/form-groups/developer-filter-form-group";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'collabro-filter-developers',
  templateUrl: './filter-developers.component.html',
  styleUrl: './filter-developers.component.scss'
})
export class FilterDevelopersComponent implements OnInit, OnChanges {
  @Input() countries$: Observable<CountryInterface[]>;
  @Input() technologies: TechnologyInterface[];
  @Input() frameworks: FrameworkInterface[];
  @Input() public selectedCountry: string[] | null;
  @Input() public selectedTechnology: string[] | null;
  @Input() public selectedFramework: string[] | null;
  @Input() public menuIsClosed: boolean;

  @Output() public developerFilters = new EventEmitter<DeveloperFilterInterface>();

  public developerFilterFormGroup: FormGroup<DeveloperFilterFormGroup>;

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
    this.developerFilterFormGroup.reset();
    this.developerFilters.emit(this.developerFilterFormGroup.value as DeveloperFilterInterface);
  }

  public applyFilters(): void {
    this.developerFilters.emit(this.developerFilterFormGroup.value as DeveloperFilterInterface);
  }

  private setForm(): void {
    this.developerFilterFormGroup = this.fb.group<DeveloperFilterFormGroup>({
      selectedCountry: this.fb.control(this.selectedCountry ?? null),
      selectedFrameworks: this.fb.control( this.selectedFramework ?? null),
      selectedTechnologies: this.fb.control(this.selectedTechnology ?? null),
    });
  }

}
