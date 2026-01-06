import type { WS_EVENTS_TYPE } from "./ws.events.ts";

export interface WSMessage<T = any> {
  type: WS_EVENTS_TYPE;
  payload: T;
  meta?: {
    userId?: string;
    roomId?: string;
  };
}
