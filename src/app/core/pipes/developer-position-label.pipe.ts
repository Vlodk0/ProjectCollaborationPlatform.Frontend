import { Pipe, PipeTransform } from '@angular/core';
import {DeveloperPositionEnum} from "../enums/developer-position.enum";
import {developerPositionListConstant} from "../constants/developer-position-list.constant";

@Pipe({
  name: 'developerPositionLabel'
})
export class DeveloperPositionLabelPipe implements PipeTransform {
  transform(developerPosition: DeveloperPositionEnum): string {
    const projectTypeItem = developerPositionListConstant.find(item => item.type === developerPosition);
    return projectTypeItem ? projectTypeItem.label : '';
  }
}
