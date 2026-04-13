import { DatePipe, UpperCasePipe } from '@angular/common';
import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { TitleComponent } from '../../components/title/title.component';
import { WsMessage, WsMessageType } from '../../models/ws-message';
import { WebsocketService } from '../../services/websocket.service';

@Component({
    selector: 'app-ws-messages',
    imports: [TitleComponent, DatePipe, UpperCasePipe, FormsModule, TranslatePipe],
    templateUrl: './ws-messages.component.html',
    styleUrl: './ws-messages.component.scss'
})
export class WsMessagesComponent implements OnDestroy {
    private wsService = inject(WebsocketService);
    private translate = inject(TranslateService);
    private sus?: Subscription;

    isConnectionActive = false;
    status = this.wsService.connectionStatus;
    messages = signal<WsMessage[]>([]);
    wsMessageTypes: WsMessageType[] = ['general', 'progress', 'notification', 'status', 'ping', 'chat', 'system', 'error'];
    typeFilter = signal<'' | WsMessageType>('');
    messageText = '';

    filteredMessages = computed(() => {
        const selectedType = this.typeFilter();
        const allMessages = this.messages();

        if (!selectedType) {
            return allMessages;
        }

        return allMessages.filter((msg) => msg.type === selectedType);
    });

    startConnection(): void {
        if (this.isConnectionActive) {
            return;
        }

        this.isConnectionActive = true;
        this.messages.set([]);

        this.wsService.connect();

        this.sus = this.wsService.messages$.subscribe({
            next: (msg) => {
                this.messages.update((messages) => [msg, ...messages]);
            },
            error: (err) => {
                console.error('Error en ws-messages:', err);
            }
        });
    }

    sendMessage(): void {
        const trimmedMessage = this.messageText.trim();
        if (!trimmedMessage) {
            return;
        }

        const prefix = this.translate.instant('ws.sentPrefix');
        const text = `${prefix} ${trimmedMessage}`;

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

    resetFilters(): void {
        this.typeFilter.set('');
    }

    ngOnDestroy(): void {
        this.stopConnection();
    }
}
