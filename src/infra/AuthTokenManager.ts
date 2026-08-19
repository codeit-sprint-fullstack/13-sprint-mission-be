import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import type { Requester } from '../types/application.js';

interface TokenPayload {
    userId: number;
}

interface PandaMarketJwtPayload extends JwtPayload {
    user: {
        id: number;
    };
}

function getSecret(name: 'JWT_ACCESS_TOKEN_SECRET' | 'JWT_REFRESH_TOKEN_SECRET'): string {
    const secret = process.env[name];
    if (!secret) throw new Error(`${name} 환경 변수가 설정되지 않았습니다.`);
    return secret;
}

function isPandaMarketJwtPayload(payload: string | JwtPayload): payload is PandaMarketJwtPayload {
    if (typeof payload === 'string') return false;
    const user = payload.user;
    return typeof user === 'object' && user !== null && typeof user.id === 'number';
}

function verifyRequester(token: string | undefined, secret: string): Requester {
    if (!token) throw new Error('JWT 토큰이 없습니다.');
    const payload = jwt.verify(token, secret);
    if (!isPandaMarketJwtPayload(payload)) throw new Error('JWT payload 형식이 올바르지 않습니다.');
    return { userId: payload.user.id };
}

export class AuthTokenManager {
    /**
     * 현재 시각으로부터 1시간동안 유효한 액세스 토큰을 생성합니다.
     */
    static buildAccessToken(payload: TokenPayload): string {
        return jwt.sign(
            {
                user: {
                    id: payload.userId,
                },
            },
            getSecret('JWT_ACCESS_TOKEN_SECRET'),
            {
                expiresIn: '1h',
            },
        );
    }

    /**
     * 주어진 액세스 토큰이 유효한지 검증합니다.
     */
    static isValidAccessToken(accessToken: string | undefined): boolean {
        try {
            verifyRequester(accessToken, getSecret('JWT_ACCESS_TOKEN_SECRET'));

            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * 현재 시각으로부터 14일동안 유효한 리프레시 토큰을 생성합니다.
     */
    static buildRefreshToken(payload: TokenPayload): string {
        return jwt.sign(
            {
                user: {
                    id: payload.userId,
                },
            },
            getSecret('JWT_REFRESH_TOKEN_SECRET'),
            {
                expiresIn: '14d',
            },
        );
    }

    static isValidRefreshToken(refreshToken: string | undefined): boolean {
        try {
            verifyRequester(refreshToken, getSecret('JWT_REFRESH_TOKEN_SECRET'));

            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * 액세스 토큰 또는 리프래시 토큰으로부터 요청자 정보를 추출합니다.
     */
    static getRequesterFromToken(authorizationHeaderValue: string | undefined): Requester {
        const jwtToken = authorizationHeaderValue?.split(' ')[1];
        return verifyRequester(jwtToken, getSecret('JWT_ACCESS_TOKEN_SECRET'));
    }

    static getRequesterFromTokenOrDefault(authorizationHeaderValue: string | undefined): Requester {
        try {
            return this.getRequesterFromToken(authorizationHeaderValue);
        } catch (e) {
            return {
                userId: -1, // GUEST
            };
        }
    }

    static getRequesterFromRefreshToken(refreshToken: string): Requester {
        return verifyRequester(refreshToken, getSecret('JWT_REFRESH_TOKEN_SECRET'));
    }
}
