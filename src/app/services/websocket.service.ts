import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WsMessage } from '../models/ws-message';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  public connectionStatus = signal<string>('Cerrada');

  private socket?: WebSocket;
  // Canal interno de eventos. 
  // - Recibe mensajes del socket (onMessage) y los comunica a los suscriptores (.next()), como 
  // Observable para evitar exponer el Subject a cambios externos. 
  // - Envía mensajes al socket (.send())
  private readonly messagesSubject = new Subject<WsMessage>();
  public readonly messages$ = this.messagesSubject.asObservable();

  connect(url: string = 'ws://localhost:3002/socket'): Observable<WsMessage> {
    if (this.socket) {
      return this.messages$;
    }

    this.connectionStatus.set('Conectando...');
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      this.connectionStatus.set('Abierta');
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const msg: WsMessage = {
          type: data.type,
          payload : data.payload ?? {},
          timestamp: data.timestamp ?? new Date().toISOString(),
        };

        this.messagesSubject.next(msg);
      } catch (error) {
        this.messagesSubject.next({
          type: 'error',
          payload: { text: 'Mensaje no válido recibido por socket.' },
          timestamp: new Date().toISOString(),
        });
      }
    };

    this.socket.onerror = (error) => {
      this.connectionStatus.set('Error');
    };

    this.socket.onclose = () => {
      this.disconnect();
    };

    return this.messages$;
  }

  send(message: WsMessage): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket no está abierto');
      return;
    }

    const msgToSend = {
      ...message,
      timestamp: message.timestamp ?? new Date().toISOString(),
    };
    this.socket.send(JSON.stringify(msgToSend));
  }

  disconnect(): void {
    if (!this.socket) {
      this.connectionStatus.set('Cerrada');
      this.socket = undefined;
      return;
    }

    this.connectionStatus.set('Cerrando...');
    this.socket.close();
    this.socket = undefined;
  }


}