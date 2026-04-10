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
      const eventSource = new EventSource('http://localhost:3000/events');

      eventSource.onopen = () => {
        this.connectionStatus.set('Abierta');
        console.log('Conexión SSE abierta');
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          observer.next(data); // Envía el objeto al suscriptor
          console.log('Dato recibido (message):', data);
        } catch (error) {
          console.error('Error parseando JSON:', error);
        }
      };

      eventSource.addEventListener('progress', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          observer.next({...data, type: 'progreso'}); // Diferenciación de tipo message para tto en html
          console.log('Progreso:', data);
        } catch (error) {
          console.error('Error en SSE (progress-mesagge):', error);
        }

      });

      eventSource.onerror = (error) => {
        console.error('Fallo en la conexión SSE. Reconectando...');
        this.connectionStatus.set('Reconectando...');
        // Puesto que SSE intenta reconectar automáticamente, no es necesario finalizar el observer, pero se podría
        // observer.error(error);
      };

      return () => {
        console.log('Cerrando conexión...');
        this.setDisconnectedStatus();
        eventSource.close();
      };
    });
  }
}

// const socket = new WebSocket('ws://localhost:3000'); // Crear conexión

// socket.onopen = () => { // Detectar apertura de conexión
//   console.log('Conexión WebSocket abierta');
// };

// socket.onmessage = (event) => { // recibir mensajes
//   console.log('Mensaje recibido:', event.data);
// };
// const data = JSON.parse(event.data);

// socket.send(JSON.stringify({ type: 'ping', message: 'Hola servidor' })); // Enviar mensajes al servidor

// socket.onerror = (error) => { // manejar errores
//   console.error('Error en WebSocket:', error);
// };

// socket.onclose = () => { // detectar cierre de conexión
//   console.log('Conexión cerrada');
// };

// socket.close(); //cerrar conexión manualmente