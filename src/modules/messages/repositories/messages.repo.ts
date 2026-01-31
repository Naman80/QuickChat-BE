import { prisma } from "../../../db/prisma.ts";
import type {
  MessageUncheckedCreateInput,
  TransactionClient,
} from "../../../../generated/prisma/internal/prismaNamespace.ts";

export const MessageRepo = {
  createMessage(data: MessageUncheckedCreateInput, tx?: TransactionClient) {
    const db = tx || prisma;
    return db.message.create({
      data,
    });
  },
};
