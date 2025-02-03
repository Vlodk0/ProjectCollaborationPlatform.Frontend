import {Component, OnDestroy, OnInit} from '@angular/core';
import {TechnologyInterface} from "../../../interfaces/project/technology.interface";
import {Subject, takeUntil} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {TechnologyService} from "../../../services/technology.service";

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
              private readonly technologyService: TechnologyService) {
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
}
