import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'w4cFilterTopologyNodesAttributes'
})
export class FilterTopologyNodesAttributesPipe implements PipeTransform {

  transform(attributes :Map<string,string>,outputAttributes :Map<string,string>): Map<string,string> {  
    return new Map(Object.entries(attributes).filter(([key, value]) => Object.values(outputAttributes).includes(key)));  
  }

}
