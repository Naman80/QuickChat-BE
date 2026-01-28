import type {
  UserCreateInput,
  UserSelect,
  UserUpdateInput,
} from "../../../generated/prisma/models.ts";
import { prisma } from "../../db/prisma.ts";

export const UserRepo = {
  createUser(data: UserCreateInput) {
    return prisma.user.create({
      data,
    });
  },

  getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  getUserByPhone(phone: string, select?: UserSelect) {
    return prisma.user.findUnique({
      where: { phone },
      select: select ?? null,
    });
  },

  updateUser(id: string, data: UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  deleteUser(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  },
};
