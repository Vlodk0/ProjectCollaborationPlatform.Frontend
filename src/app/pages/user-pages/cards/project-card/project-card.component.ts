import {Component, Input} from '@angular/core';
import {ProjectInterface} from "../../../../shared/interfaces/project/project.interface";
import {AdminProjectDataInterface} from "../../../../shared/interfaces/admin/projects/admin-project-data.interface";
import {ProjectStatusEnum} from "../../../../core/enums/project-status.enum";
import {PaymentTypeEnum} from "../../../../core/enums/payment-type.enum";

@Component({
  selector: 'collabro-project-card',
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss'
})
export class ProjectCardComponent {
  @Input() project: ProjectInterface | AdminProjectDataInterface;
  public projectStatusEnum = ProjectStatusEnum;
  public paymentTypeEnum = PaymentTypeEnum;
}
