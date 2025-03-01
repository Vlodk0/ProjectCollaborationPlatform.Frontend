import {Component, Input} from '@angular/core';
import {ProjectInterface} from "../../../../shared/interfaces/project/project.interface";

@Component({
  selector: 'collabro-project-overview-section',
  templateUrl: './project-overview-section.component.html',
  styleUrl: './project-overview-section.component.scss'
})
export class ProjectOverviewSectionComponent {
  @Input() project: ProjectInterface;
}
