import { mockDeep, mockReset, type DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient } from "@prisma/client";
import prisma from "../src/utils/prisma";

// 유닛 테스트는 실제 DB에 붙지 않는다.
// mockDeep은 PrismaClient의 모든 메서드(prisma.product.findUnique 등)를 자동으로
// jest.fn()으로 바꿔주므로, 테스트마다 "이 쿼리는 이 값을 돌려준다"고 지정할 수 있다.
jest.mock("../src/utils/prisma", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

// errorHandler가 모든 에러를 console.error로 남기는데, 400/404를 "일부러" 발생시키는
// 테스트가 많아서 출력이 묻힌다. 테스트 중에는 로그만 삼킨다.
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

// 앞 테스트에서 지정한 반환값이 다음 테스트로 새지 않도록 매번 초기화한다.
beforeEach(() => {
  mockReset(prismaMock);
});
