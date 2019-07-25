import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimName'
})
export class TrimNamePipe implements PipeTransform {

  transform(value: string): string {
    return value.replace(/\s/g, "")
  }

}
