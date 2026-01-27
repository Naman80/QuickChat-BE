import { UserRepo } from "./user.repo.ts";
import type { CreateUserBody } from "./user.schema.ts";

export const UserService = {
  async createUser({ phone }: CreateUserBody) {
    const user = await UserRepo.createUser({
      name: phone, // initially
      phone,
    });

    return user;
  },

  async getUserById(id: string) {
    return await UserRepo.getUserById(id);
  },

  async getUserByPhone(phone: string) {
    return await UserRepo.getUserByPhone(phone);
  },

  // TODO : we have to add the update user service
  updateUser(id: string, input: Partial<CreateUserBody>) {
    return UserRepo.updateUser(id, input);
  },

  deleteUser(id: string) {
    return UserRepo.deleteUser(id);
  },
};
