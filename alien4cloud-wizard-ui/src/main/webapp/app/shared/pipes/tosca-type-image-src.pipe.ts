import {Pipe, PipeTransform} from '@angular/core';
import {HasTags} from '@app/core';
import * as _ from 'lodash';
import {environment} from '../../../environments/environment';

/**
 * Returns the image url of a given NodeType by exploring it's tags.
 */
@Pipe({
  name: 'toscaTypeImageSrc'
})
export class ToscaTypeImageSrcPipe implements PipeTransform {

  transform(value: HasTags): string {
    let tagValue = _.get(_.find(value.tags, {name:'icon'}), 'value');
    return environment.urlPrefix + `../img?id=${tagValue}&quality=QUALITY_64`;
  }

}
