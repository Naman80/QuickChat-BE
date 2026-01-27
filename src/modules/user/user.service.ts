import type { CreateUserBody } from "./user.schema.ts";

export const createUser = ({ name, phone }: CreateUserBody) => {
  console.log(name, phone);
  console.log("create user serive is called");
  return Promise.resolve({ name, phone });
};

const getUser = () => {};

const updateUser = () => {};

const deleteUser = () => {};
