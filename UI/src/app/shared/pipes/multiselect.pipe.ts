import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'multiselectzero'
})

export class MultiSelectPipe implements PipeTransform {

    transform(value: any[], args?: string[]): any {
      if (!value || value.length === 0) {
        return value;
      }
      return value.filter(o => o !== 0);
    }
}
