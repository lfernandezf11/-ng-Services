export type WsMessageType =
  | 'general'
  | 'progress'
  | 'notification'
  | 'status'
  | 'ping'
  | 'chat'
  | 'system'
  | 'error';

export interface WsPayload {
  text: string;
  percentage?: number;
  [key: string]: unknown;
}

export interface WsMessage {
  type: WsMessageType;
  payload: WsPayload;
  timestamp?: string;
}
