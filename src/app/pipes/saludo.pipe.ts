import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'saludo',
  standalone: true
})
export class SaludoPipe implements PipeTransform {

  transform(nombre: string): string {
    return `¡Hola, ${nombre}!`;

  }

}
