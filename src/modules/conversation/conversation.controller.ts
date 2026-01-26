import type { Request, Response } from "express";
import {
  createOrGetDirectConversation,
  createGroupConversation,
  getUserConversations,
  markConversationRead,
} from "./conversation.service.ts";

export async function createDirectConversation(req: Request, res: Response) {
  const userId = req.user.id;
  const { phone } = req.body;

  const conversation = await createOrGetDirectConversation(userId, phone);

  res.json({
    conversationId: conversation.id,
    type: conversation.type,
  });
}

export async function createGroupConversation(req: Request, res: Response) {
  const userId = req.user.id;
  const { members } = req.body;

  const conversation = await createGroupConversation(userId, members);

  res.json({
    conversationId: conversation.id,
    type: conversation.type,
  });
}

export async function listConversationsController(req: Request, res: Response) {
  const userId = req.user.id;

  const conversations = await getUserConversations(userId);
  res.json(conversations);
}

export async function markConversationReadController(
  req: Request,
  res: Response,
) {
  const userId = req.user.id;
  const { id: conversationId } = req.params;
  const { lastReadMessageId } = req.body;

  if (!conversationId) {
    res.sendStatus(400);
    return;
  }

  await markConversationRead(userId, conversationId, lastReadMessageId);
  res.sendStatus(204);
}
