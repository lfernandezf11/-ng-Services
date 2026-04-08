import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-spinner',
  imports: [],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent implements OnInit, OnDestroy {
  private loadingService = inject(LoadingService);
  isVisible = false;
  private sub!: Subscription; //Necesario el operador de aserción no nula (!) porque se inicializa en ngOnInit, no en el constructor.

  ngOnInit() {
    this.sub = this.loadingService.loading$.subscribe(value => {
      this.isVisible = value;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    // this.loadingService.loading$.unsubscribe() da error porque loading$ es un Observable, no una Subscription. Solo las Subscription tienen el método unsubscribe().
  }

  // Alternativa para el pipe async (línea única de la clase)
  // public loadingService = inject(LoadingService);
}
