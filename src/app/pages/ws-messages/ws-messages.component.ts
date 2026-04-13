import { DatePipe, UpperCasePipe } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FooterComponent } from '../../components/footer/footer.component';
import { TitleComponent } from '../../components/title/title.component';
import { WsMessage } from '../../models/ws-message';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-ws-messages',
  imports: [TitleComponent, FooterComponent, DatePipe, UpperCasePipe, FormsModule],
  templateUrl: './ws-messages.component.html',
  styleUrl: './ws-messages.component.scss'
})
export class WsMessagesComponent implements OnDestroy {
  private wsService = inject(WebsocketService);
  private sus?: Subscription;

  isConnectionActive = false;
  status = this.wsService.connectionStatus;
  messages: WsMessage[] = [];
  messageText = '';

  startConnection(): void {
    if (this.isConnectionActive) {
      return;
    }

    this.isConnectionActive = true;
    this.messages = [];

    this.wsService.connect();

    this.sus = this.wsService.messages$.subscribe({
      next: (msg) => {
        this.messages.unshift(msg);
      },
      error: (err) => {
        console.error('Error en ws-messages:', err);
      }
    });
  }

  sendMessage(): void {
    const text = "Mensaje enviado al servidor: " + this.messageText.trim();
    if (!text) {
      return;
    }

    this.wsService.send({
      type: 'chat',
      payload: {
        text
      },
      timestamp: new Date().toISOString()
    });

    this.messageText = '';
  }

  sendPing(): void {
    this.wsService.send({
      type: 'ping',
      payload: { text: 'ping' },
      timestamp: new Date().toISOString()
    });
  }

  stopConnection(): void {
    if (this.sus) {
      this.sus.unsubscribe();
      this.sus = undefined;
    }

    this.wsService.disconnect();
    this.isConnectionActive = false;
  }

  ngOnDestroy(): void {
    this.stopConnection();
  }
}
