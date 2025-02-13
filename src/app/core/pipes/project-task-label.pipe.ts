import { Pipe, PipeTransform } from '@angular/core';
import {taskLabelTypeListConstant} from "../constants/task-label-type-list.constant";
import {TaskLabelType} from "../enums/task-label-type.enum";

@Pipe({ name: 'projectTaskTypeLabel' })
export class ProjectTaskLabelPipe implements PipeTransform {
  transform(projectType: TaskLabelType): string {
    const projectTypeItem = taskLabelTypeListConstant.find(item => item.value === projectType);
    return projectTypeItem ? projectTypeItem.label : '';
  }
}
