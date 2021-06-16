import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'w4cEmphase'
})
export class EmphasePipe implements PipeTransform {

  transform(value: string, query: string): any {
    return _.replace(value, query, "<strong>" + query + "</strong>");
  }

}
