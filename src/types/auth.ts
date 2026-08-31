import type { User } from "@prisma/client";

// 비밀번호 해시를 제외하고 클라이언트에 내려주는 사용자 정보 (Omit 유틸리티 타입)
export type PublicUser = Omit<User, "encryptedPassword">;
