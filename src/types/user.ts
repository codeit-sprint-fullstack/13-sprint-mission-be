import { User } from "@prisma/client";

export type UserRequestType = {
  name: string;
  email: string;
  username: string;
  password: string;
  passwordConfirmation?: string;
};

export type UserReturnType = Omit<User, "password">;
