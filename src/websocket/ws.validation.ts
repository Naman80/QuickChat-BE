import type { RawData } from "ws";
import { WsMessageSchema } from "./ws.types.ts";

export function validateWsMessage(rawData: RawData) {
  // 1. parse JSON
  const parsed =
    typeof rawData === "string"
      ? JSON.parse(rawData)
      : Buffer.isBuffer(rawData)
        ? JSON.parse(rawData.toString("utf-8"))
        : rawData;

  const payloadSchema = WsMessageSchema.parse(parsed);

  return payloadSchema;
}
