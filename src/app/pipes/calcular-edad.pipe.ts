import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calcularEdad', 
  standalone: true
})
export class CalcularEdadPipe implements PipeTransform {

  transform(birth: Date): number {
    const today = new Date;
    const initial = new Date(birth);
    
    if (today > initial) {
      let age = today.getFullYear() - initial.getFullYear();
      if(today.getMonth() < initial.getMonth()){
        age--;
      }else if(today.getMonth() === initial.getMonth()){
        age = today.getDay() < initial.getDay() ? age-- : age;
      }
      return age;
    } else {
      return 0;
    }
  }

}
