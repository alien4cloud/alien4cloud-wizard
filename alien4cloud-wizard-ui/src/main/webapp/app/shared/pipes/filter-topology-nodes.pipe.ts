import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'w4cFilterTopologyNodes'
})
export class FilterTopologyNodesPipe implements PipeTransform {
  transform(nodes : Map<string,any> , outputAttributes: Map<string,any> ) : Map<string,any>  {
    return  new Map(Object.entries(nodes).filter(([key, value]) => Object.keys(outputAttributes).includes(key)));
  }

}