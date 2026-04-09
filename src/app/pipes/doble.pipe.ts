import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'doble',
  standalone: true
})
export class DoblePipe implements PipeTransform {

  transform(value: number): number {
    return value * 2;
  }

}
