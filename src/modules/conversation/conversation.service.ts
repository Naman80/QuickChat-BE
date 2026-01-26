import { randomUUID } from "crypto";
import type { Conversation, ConversationType } from "./conversation.types.ts";

const conversations = new Map<string, Conversation>();

export function createOrGetDirectConversation(
  userId1: string,
  userId2: string,
): Conversation {
  for (const convo of conversations.values()) {
    if (
      convo.type === "DIRECT" &&
      convo.participants.has(userId1) &&
      convo.participants.has(userId2)
    ) {
      return convo;
    }
  }

  const conversation: Conversation = {
    id: randomUUID(),
    type: "DIRECT",
    participants: new Set([userId1, userId2]),
    admins: new Set(),
  };

  conversations.set(conversation.id, conversation);
  return conversation;
}

export function isParticipant(userId: string, conversationId: string): boolean {
  const convo = conversations.get(conversationId);
  return !!convo && convo.participants.has(userId);
}

export function getConversation(conversationId: string): Conversation | null {
  return conversations.get(conversationId) ?? null;
}

// export async function createOrGetDirectConversation(
//   userId: string,
//   phone: string,
// ) {
//   // 1. resolve phone → userId
//   // 2. find existing direct conversation
//   // 3. else create Conversation + ConversationParticipant rows
// }

export async function createGroupConversation(
  creatorId: string,
  members: string[],
) {
  // create Conversation
  // create ConversationParticipant rows
  // creator is admin
  const conversation: Conversation = {
    id: randomUUID(),
    type: "GROUP",
    participants: new Set([creatorId, ...members]),
    admins: new Set([creatorId]),
  };

  conversations.set(conversation.id, conversation);
  return conversation;
}

export async function getUserConversations(userId: string) {
  // sidebar query from your notes
}

export async function markConversationRead(
  userId: string,
  conversationId: string,
  lastReadMessageId: string,
) {
  // UPDATE ConversationParticipant
}
