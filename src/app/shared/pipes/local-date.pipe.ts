import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';


@Pipe({ name: 'localDate' })
export class LocalDatePipe implements PipeTransform {
  constructor() {
  }

  public transform(date: any, format = 'longDate'): any {
    let dateFormat;
    switch (format) {
      case 'longDateTime':
        dateFormat = 'MMMM dd, y HH:mm';
        break;
      case 'shortDate':
        dateFormat = 'MMMM dd, y';
        break;
      case 'shortTime':
        dateFormat = 'HH:mm';
        break;
      default:
        dateFormat = format;
        break;
    }

    const datePipe = new DatePipe('en-US');

    return datePipe.transform(date, dateFormat);
  }
}
