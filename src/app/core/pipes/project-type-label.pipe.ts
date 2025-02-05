import { Pipe, PipeTransform } from '@angular/core';
import {ProjectType} from "../enums/project-type.enum";
import {projectTypeListConstant} from "../constants/project-type-list.constant";

@Pipe({ name: 'projectTypeLabel' })
export class ProjectTypeLabelPipe implements PipeTransform {
  transform(projectType: ProjectType): string {
    const projectTypeItem = projectTypeListConstant.find(item => item.type === projectType);
    return projectTypeItem ? projectTypeItem.label : '';
  }
}
