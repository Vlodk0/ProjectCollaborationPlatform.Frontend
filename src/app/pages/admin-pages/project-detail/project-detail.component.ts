import {Component, Input} from '@angular/core';
import {AdminProjectDataInterface} from "../../../shared/interfaces/admin/projects/admin-project-data.interface";

@Component({
  selector: 'collabro-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent {
  @Input() project: AdminProjectDataInterface;

}
