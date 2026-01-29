import { type WebSocket } from "ws";
import { WsOutboundEvents } from "../../websocket/ws.types.ts";
import { WsRoomStore } from "../../store/rooms.store.ts";
import { WsConnectionStore } from "../../store/connection.store.ts";
import { MessageService } from "../messages/messages.service.ts";
import {
  type TSendMessageBody,
  RecipientType,
} from "../messages/schemas/messages.schema.ts";
import type {
  TWsJoinRoom,
  TWsSendMessage,
} from "../../websocket/schemas/ws.inboundMessages.schema.ts";
import type { TWsNewMessage } from "../../websocket/schemas/ws.outboundMessages.schema.ts";
import { WebsocketUtils } from "../../websocket/ws.utils.ts";

interface IHandleJoinRoom {
  ws: WebSocket;
  message: TWsJoinRoom;
}

interface IHandleSendMessage {
  ws: WebSocket;
  message: TWsSendMessage;
}

function mapWsToSendMessageBody({ payload }: TWsSendMessage): TSendMessageBody {
  const bastSendMessageBody = {
    message: payload.message,
  };

  if ("to" in payload) {
    return {
      ...bastSendMessageBody,
      recipient_type: RecipientType.Individual,
      to: payload.to,
    };
  }

  return {
    ...bastSendMessageBody,
    recipient_type: RecipientType.Group,
    to: payload.conversationId,
  };
}

export const ChatService = {
  handleJoinRoom({ ws, message }: IHandleJoinRoom) {
    const userId = WsConnectionStore.getUserId(ws);

    if (!userId) {
      throw new Error("Join room failed: user not found");
    }

    const { conversationId } = message.payload;

    // OPTIONAL (recommended): validate membership via service
    // ConversationService.assertParticipant(userId, roomId);

    WsRoomStore.joinRoom(conversationId, ws);

    WebsocketUtils.sendMessage(ws, {
      type: WsOutboundEvents.USER_JOINED,
      payload: { conversationId },
    });
  },

  async handleSendMessage({ ws, message }: IHandleSendMessage) {
    const senderId = WsConnectionStore.getUserId(ws);

    if (!senderId) {
      throw new Error("Send message failed: sender user not found");
    }

    const messageBody = mapWsToSendMessageBody(message);

    // 1. Call domain service (source of truth)
    const result = await MessageService.sendMessage(senderId, messageBody);

    const { conversationId, message: newMessage, participants } = result;

    // 2. Ensure sender socket is in the room (chat is open)
    WsRoomStore.joinRoom(conversationId, ws);

    // 3. ACK to sender (optional but recommended)

    WebsocketUtils.sendMessage(ws, {
      type: WsOutboundEvents.MESSAGE_ACK,
      payload: {
        conversationId,
        message: newMessage,
      },
    });

    // 4. Fan-out to all participants (user-based)
    const newMessageData: TWsNewMessage = {
      type: WsOutboundEvents.NEW_MESSAGE,
      payload: { conversationId, message: newMessage },
    };

    const sockets = new Set<WebSocket>(); // get all unique sockets

    for (const userId of participants) {
      if (userId === senderId) continue;
      WsConnectionStore.getSocketsByUserId(userId).forEach((s) =>
        sockets.add(s),
      );
    }

    for (const socket of sockets) {
      if (socket.readyState === socket.OPEN) {
        WebsocketUtils.sendMessage(socket, newMessageData);
      }
    }
  },
};
