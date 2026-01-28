import { MessageContentType } from "../../../../generated/prisma/enums.ts";
import type { TransactionClient } from "../../../../generated/prisma/internal/prismaNamespace.ts";

export const MessageRepo = {
  createMessage(
    tx: TransactionClient,
    input: {
      conversationId: string;
      senderId: string;
      content: string;
    },
  ) {
    return tx.message.create({
      data: {
        conversationId: input.conversationId,
        senderId: input.senderId,
        content: input.content,
        contentType: MessageContentType.text,
      },
    });
  },
};
