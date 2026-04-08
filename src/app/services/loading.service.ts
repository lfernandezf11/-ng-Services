import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LoadingService {
 
  private loadingSubject = new BehaviorSubject<boolean>(false); 
  loading$ = this.loadingSubject.asObservable(); // Observable público para que los componentes se suscriban
  // Alternativa: utilizar un signal  que el spinner puede consumir directamente sin necesidad de suscribirse.
  // isLoading = signal<boolean>(false);

  setLoading(value: boolean) {
    this.loadingSubject.next(value); // .next() actualiza el valor y lo emite a los suscriptores
 // this.isLoading.set(value);
  }
}
