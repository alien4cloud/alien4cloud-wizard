import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'w4cSplitAndGet'
})
export class SplitAndGetPipe implements PipeTransform {

  transform(text: String,separator: any, indexToReturn : any ): any {
    if (text!== undefined) {
      separator = separator || '.'; // by defult . if not defined
      if (text.indexOf(separator) < 0) {
        return text;
      }
      let res = text.split(separator);
      if(indexToReturn === 'last') {
        indexToReturn = res.length - 1;
      }
      if (parseInt(indexToReturn) && indexToReturn >= 0) {
        return res[indexToReturn];
      }
    } else {
      return;
    }
  }

}
