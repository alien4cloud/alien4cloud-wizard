import { Pipe, PipeTransform } from '@angular/core';
import { NodeType } from '@app/core';
import * as _ from 'lodash';

/**
 * Returns the image url of a given NodeType by exploring it's tags.
 */
@Pipe({
  name: 'toscaTypeImageSrc'
})
export class ToscaTypeImageSrcPipe implements PipeTransform {

  transform(value: NodeType): string {
    let tagValue = _.get(_.find(value.tags, {name:'icon'}), 'value');
    return `api/img?id=${tagValue}&quality=QUALITY_64`;
  }

}
