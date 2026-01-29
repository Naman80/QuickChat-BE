import type { RawData } from "ws";
import { ZodType } from "zod";
import {
  type TWsInboundMessage,
  WsInboundMessageSchema,
} from "./schemas/ws.inboundMessages.schema.ts";
import {
  type TWsOutboundMessage,
  WsOutboundMessageSchema,
} from "./schemas/ws.outboundMessages.schema.ts";

function validateWsMessage(rawData: RawData, schema: ZodType) {
  const parsed =
    typeof rawData === "string"
      ? JSON.parse(rawData)
      : Buffer.isBuffer(rawData)
        ? JSON.parse(rawData.toString("utf-8"))
        : rawData;

  const payloadSchema = schema.parse(parsed);

  return payloadSchema;
}

export function validateWsInboundMessage(rawData: RawData) {
  const payloadSchema = validateWsMessage(
    rawData,
    WsInboundMessageSchema,
  ) as TWsInboundMessage;

  return payloadSchema;
}

export function validateWsOutboundMessage(rawData: RawData) {
  const payloadSchema = validateWsMessage(
    rawData,
    WsOutboundMessageSchema,
  ) as TWsOutboundMessage;
  return payloadSchema;
}
