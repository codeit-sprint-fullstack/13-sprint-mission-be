import { UserPasswordBuilder } from '../../src/infra/UserPasswordBuilder.js';

export const UserMocks = [
    {
        email: 'firstUser@pandamarket.com',
        encryptedPassword: UserPasswordBuilder.hashPassword('password'),
        nickname: 'firstUser',
        image: null,
    },
];
