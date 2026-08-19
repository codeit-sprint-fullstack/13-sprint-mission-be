import { UserPasswordBuilder } from '../../src/infra/UserPasswordBuilder.js';
import type { Prisma } from '@prisma/client';

export const UserMocks = [
    {
        email: 'firstUser@pandamarket.com',
        encryptedPassword: UserPasswordBuilder.hashPassword('password'),
        nickname: 'firstUser',
        image: null,
    },
] satisfies Prisma.UserCreateManyInput[];
