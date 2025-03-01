import {Component, Input} from '@angular/core';
import {FunctionalityBlockInterface} from "../../../../shared/interfaces/project/functionality-block.interface";

@Component({
  selector: 'collabro-project-task-card',
  templateUrl: './project-task-card.component.html',
  styleUrl: './project-task-card.component.scss'
})
export class ProjectTaskCardComponent {
  @Input() functionalityBlock: FunctionalityBlockInterface;

}
