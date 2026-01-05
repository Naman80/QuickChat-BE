import type { WS_EVENTS } from "./ws.events.ts";

export interface WSMessage<T = any> {
  type: WS_EVENTS;
  payload: T;
  meta?: {
    userId?: string;
    roomId?: string;
  };
}
