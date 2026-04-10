import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TitleComponent } from '../../components/title/title.component';
import { FooterComponent } from "../../components/footer/footer.component";
import { SseService } from '../../services/sse.service';
import { Subscription } from 'rxjs';
import { DatePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-messages-list',
  imports: [TitleComponent, FooterComponent, DatePipe, UpperCasePipe],
  templateUrl: './messages-list.component.html',
  styleUrl: './messages-list.component.scss'
})

export class MessagesListComponent implements OnInit, OnDestroy {
  private sseService = inject(SseService);
  private sus?: Subscription;
  isConnectionActive = false;
  status = this.sseService.connectionStatus;
  messages: any[] = [];
  // progressMessages: any[] = [];
  currentProgress = 0;

  ngOnInit() {
    this.startConnection();
  }

  startConnection(): void {
    if (this.isConnectionActive) {
      return;
    }

    this.isConnectionActive = true;
    this.messages = []; // Estado inicial de la conexión: barra de progreso al 0% y tabla vacía. 
    // this.progressMessages = [];
    this.currentProgress = 0;
    this.sseService.setConnectingStatus();
    this.sus = this.sseService.getServerEvents().subscribe({
      next: (data) => {
        if (data?.type === 'progreso') {
          // this.progressMessages.push(data); // Innecesario, no van a mostrarse estos mensajes por pantalla, únicamente interesa el valor que trasladan.
          this.currentProgress = Number(data.progress ?? 0);

          if (this.currentProgress >= 100) {
            this.stopConnection();
          }

          return;
        }

        this.messages.push(data);
        console.log('Mensaje recibido en el componente:', data);
      },
      error: (err) => console.error('Error en el componente:', err),
    });
  }

  stopConnection(): void {
    this.sus?.unsubscribe();
    this.sus = undefined;
    this.isConnectionActive = false;
    this.sseService.setDisconnectedStatus();
  }

  ngOnDestroy(): void {
    this.stopConnection();
  }
}
