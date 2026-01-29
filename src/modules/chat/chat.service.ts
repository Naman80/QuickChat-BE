import { type WebSocket } from "ws";
import {
  WsEvents,
  type TWsJoinRoom,
  type TWsSendMessage,
} from "../../websocket/ws.types.ts";
import { WsRoomStore } from "../../store/rooms.store.ts";
import { WsConnectionStore } from "../../store/connection.store.ts";
import { MessageService } from "../messages/messages.service.ts";
import {
  RecipientType,
  TSendMessageBody,
} from "../messages/schemas/messages.schema.ts";

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

    ws.send(
      JSON.stringify({
        type: WsEvents.USER_JOINED,
        payload: { conversationId },
      }),
    );
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
    ws.send(
      JSON.stringify({
        type: WsEvents.MESSAGE_SENT,
        payload: {
          conversationId,
          message: newMessage,
        },
      }),
    );

    // 4. Fan-out to all participants (user-based)
    for (const userId of participants) {
      if (userId === senderId) continue;

      const sockets = WsConnectionStore.getSocketsByUserId(userId);

      for (const socket of sockets) {
        socket.send(
          JSON.stringify({
            type: WsEvents.NEW_MESSAGE,
            payload: {
              conversationId,
              message: newMessage,
            },
          }),
        );
      }
    }
  },
};
