import { Pipe, PipeTransform } from '@angular/core';
import {TimeDuration} from "../enums/time-duration.enum";
import {timeDurationListConstant} from "../constants/time-duration-list.constant";

@Pipe({ name: 'timeDurationLabel' })
export class ProjectTimeDurationLabelPipe implements PipeTransform {
  transform(duration: TimeDuration): string {
    const durationItem = timeDurationListConstant.find(item => item.duration === duration);
    return durationItem ? durationItem.label : '';
  }
}
