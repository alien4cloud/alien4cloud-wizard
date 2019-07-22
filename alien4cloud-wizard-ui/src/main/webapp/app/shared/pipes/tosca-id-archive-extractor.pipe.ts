import { Pipe, PipeTransform } from '@angular/core';
import {HasTags, NodeType} from '@app/core';
import * as _ from 'lodash';

/**
 * Returns the image url of a given NodeType by exploring it's tags.
 */
@Pipe({
  name: 'w4cToscaIdArchiveExtractor'
})
export class ToscaIdArchiveExtractorPipe implements PipeTransform {

  transform(value: string): string {
    return _.split(value, ":")[0];
  }

}
