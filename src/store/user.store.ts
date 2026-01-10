export interface User {
  userId: string;
  phone: string;
  createdAt: number;
}

const users = new Map<string, User>(); // key = phone

export function findUserByPhone(phone: string) {
  return users.get(phone);
}

export function createUser(user: User) {
  users.set(user.phone, user);
  return user;
}
