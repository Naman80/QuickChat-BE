import { MessageStatus } from "../../../../generated/prisma/enums.ts";
import type { TransactionClient } from "../../../../generated/prisma/internal/prismaNamespace.ts";

export const MessageUserStateRepo = {
  create(
    tx: TransactionClient,
    messageId: string,
    userId: string,
    status: MessageStatus,
  ) {
    return tx.messageUserState.create({
      data: {
        messageId,
        userId,
        status,
      },
    });
  },

  createMany(
    tx: TransactionClient,
    data: {
      messageId: string;
      userId: string;
      status: MessageStatus;
    }[],
  ) {
    return tx.messageUserState.createMany({
      data,
    });
  },
};
