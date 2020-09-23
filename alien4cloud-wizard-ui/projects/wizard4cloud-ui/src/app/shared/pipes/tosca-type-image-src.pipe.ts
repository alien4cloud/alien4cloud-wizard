import {Inject, Pipe, PipeTransform} from '@angular/core';
import * as _ from 'lodash';
import {HasTags} from "@app/core/models";
import {BOOTSTRAP_SETTINGS, BootstrapSettings} from "@alien4cloud/wizard4cloud-commons";

/**
 * Returns the image url of a given NodeType by exploring it's tags.
 */
@Pipe({
  name: 'toscaTypeImageSrc'
})
export class ToscaTypeImageSrcPipe implements PipeTransform {

  constructor(@Inject(BOOTSTRAP_SETTINGS) private bootstrapSettings: BootstrapSettings) {
  }

  transform(value: HasTags): string {
    let tagValue = _.get(_.find(value.tags, {name:'icon'}), 'value');
    return this.bootstrapSettings.urlPrefix + `../img?id=${tagValue}&quality=QUALITY_64`;
  }

}
