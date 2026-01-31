import { MessageStatus } from "../../../../generated/prisma/enums.ts";
import type {
  MessageUserStateCreateManyInput,
  TransactionClient,
} from "../../../../generated/prisma/internal/prismaNamespace.ts";
import { prisma } from "../../../db/prisma.ts";

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

  createMany(data: MessageUserStateCreateManyInput[], tx?: TransactionClient) {
    const db = tx || prisma;
    return db.messageUserState.createMany({
      data,
    });
  },
};
