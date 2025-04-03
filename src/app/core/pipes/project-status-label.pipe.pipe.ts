import { Pipe, PipeTransform } from '@angular/core';
import {projectStatusListConstant} from "../constants/project-status-list.constant";
import {ProjectStatusEnum} from "../enums/project-status.enum";

@Pipe({
  name: 'projectStatusLabel'
})
export class ProjectStatusLabelPipe implements PipeTransform {

  transform(projectStatus: ProjectStatusEnum): string {
    const projectStatusItem = projectStatusListConstant.find(item => item.type === projectStatus);
    return projectStatusItem ? projectStatusItem.label : '';
  }
}
