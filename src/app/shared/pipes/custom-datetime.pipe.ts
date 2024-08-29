import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { Constant } from '../common/app.constants';

@Pipe({ name: 'customdatetime' })
export class CustomDatetimePipe implements PipeTransform {
    transform(value: any, day: string, month: string, year: string): string {
        const dateTimeValue = moment(day + '-' + month + '-' + year, Constant.DateFormat);
        if (dateTimeValue.isValid()) {
            return dateTimeValue.format(Constant.DateFormat);
        }

        return null;
    }
}
