import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

/**
 * Get the last part of dotted name. For example if the value is 'org.alien4cloud.Stuff', returns 'Stuff'.
 */
@Pipe({
  name: 'toscaTypeShortName'
})
export class ToscaTypeShortNamePipe implements PipeTransform {

  transform(value: string): string {
    return _.last(_.split(value, "."));
  }

}
