import {Component, Input} from '@angular/core';
import {ProjectInterface} from "../../../../shared/interfaces/project/project.interface";

@Component({
  selector: 'collabro-project-card',
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss'
})
export class ProjectCardComponent {
  @Input() project: ProjectInterface;
}
