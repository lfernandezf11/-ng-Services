import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SseService {
  public connectionStatus = signal<string>('Conectado');

  setConnectingStatus(): void {
    this.connectionStatus.set('Abierta');
  }

  setDisconnectedStatus(): void {
    this.connectionStatus.set('Cerrada');
  }

  getServerEvents(): Observable<any> {
    return new Observable((observer) => {
      const eventSource = new EventSource('http://localhost:3001/events');

      eventSource.onopen = () => {
        this.connectionStatus.set('Abierta');
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // Evita que un payload de progreso entre también como mensaje general.
          if (data && typeof data === 'object' && 'progress' in data) {
            return;
          }

          const type = data.type === undefined ? 'general' : data.type;
          observer.next({ ...data, type }); // Envía el objeto al suscriptor
        } catch (error) {
          console.error('Error parseando JSON:', error);
        }
      };

      eventSource.addEventListener('progress', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          observer.next({ ...data, type: 'progreso' }); // Diferenciación de tipo message para tto en html
        } catch (error) {
          console.error('Error en SSE (progress-mesagge):', error);
        }

      });

      eventSource.onerror = (error) => {
        this.connectionStatus.set('Reconectando...');
        // Puesto que SSE intenta reconectar automáticamente, no es necesario finalizar el observer, pero se podría
        // observer.error(error);
      };

      return () => {
        this.setDisconnectedStatus();
        eventSource.close();
      };
    });
  }
}
