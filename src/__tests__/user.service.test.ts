import userRepository from "../repositories/user.repository";
import productRepository from "../repositories/product.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  AuthenticationError,
  NotFoundError,
  ServerError,
  ValidationError,
} from "../types/errors";

// 모듈 모킹
jest.mock("../repositories/user.repository");
const mockedUserRepository = userRepository as jest.Mocked<
  typeof userRepository
>;

jest.mock("../repositories/product.repository");
const mockedProductRepository = productRepository as jest.Mocked<
  typeof productRepository
>;

jest.mock("bcrypt");
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

jest.mock("jsonwebtoken");
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

// userService 도메인
describe("UserService", () => {
  let userService: typeof import("../services/user.service").default;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
    userService = require("../services/user.service").default;
  });

  // 유저 생성 테스트
  describe("createUser", () => {
    test("사용자 생성이 성공적으로 완료되어야 한다", async () => {
      // Setup
      const userData = {
        email: "test@example.com",
        nickname: "Test User",
        password: "password123",
        image: null,
      };

      const hashedPassword = "hashedPassword123";
      const createdUser = {
        id: 1,
        email: "test@example.com",
        nickname: "Test User",
        password: hashedPassword,
        image: null,
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const expectedUser = {
        id: 1,
        email: "test@example.com",
        nickname: "Test User",
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedUserRepository.findByEmail.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);
      mockedUserRepository.save.mockResolvedValue(createdUser);

      // Exercise
      const result = await userService.createUser(userData);

      // Assertion
      expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(
        userData.email,
      );
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(mockedUserRepository.save).toHaveBeenCalledWith({
        ...userData,
        password: hashedPassword,
      });
      expect(result).toEqual(expectedUser);
    });

    test("이미 존재하는 이메일인 경우 ValidationError를 반환해야 한다", async () => {
      // Setup
      const userData = {
        email: "existing@example.com",
        nickname: "Test User",
        password: "password123",
        image: null,
      };

      const existingUser = {
        id: 1,
        email: "existing@example.com",
        nickname: "Existing User",
        password: "hashedPassword",
        image: null,
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedUserRepository.findByEmail.mockResolvedValue(existingUser);

      // Exercise & Assertion
      await expect(userService.createUser(userData)).rejects.toThrow(
        ValidationError,
      );
    });

    test("bcrypt 해싱 중 에러가 발생하면 ServerError를 반환해야 한다", async () => {
      // Setup
      const userData = {
        email: "test@example.com",
        nickname: "Test User",
        password: "password123",
        image: null,
      };

      mockedUserRepository.findByEmail.mockResolvedValue(null);
      mockedBcrypt.hash.mockRejectedValue(new Error("Hashing failed") as never);

      // Exercise & Assertion
      await expect(userService.createUser(userData)).rejects.toThrow(
        ServerError,
      );
      expect(mockedUserRepository.save).not.toHaveBeenCalled();
    });

    test("사용자 저장 중 에러가 발생하면 ServerError를 반환해야 한다", async () => {
      // Setup
      const userData = {
        email: "test@example.com",
        nickname: "Test User",
        password: "password123",
        image: null,
      };

      const hashedPassword = "hashedPassword123";

      mockedUserRepository.findByEmail.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);
      mockedUserRepository.save.mockRejectedValue(new Error("DB save failed"));

      // Exercise & Assertion
      await expect(userService.createUser(userData)).rejects.toThrow(
        ServerError,
      );
    });

    test("데이터베이스 에러 발생 시 ServerError를 반환해야 한다", async () => {
      // Setup
      const userData = {
        email: "existing@example.com",
        nickname: "Test User",
        password: "password123",
        image: null,
      };

      mockedUserRepository.findByEmail.mockRejectedValue(
        new Error("Database error"),
      );

      // Exercise & Assertion
      await expect(userService.createUser(userData)).rejects.toThrow(
        ServerError,
      );
    });
  });

  // 유저 조회 테스트
  describe("getUser", () => {
    test("사용자 로그인이 성공적으로 완료되어야 한다", async () => {
      //Setup
      const email = "test@example.com";
      const inputPassword = "password123";
      const hashedPassword = "hashedPassword123";

      const user = {
        id: 1,
        email: "test@example.com",
        nickname: "Test User",
        password: hashedPassword,
        image: null,
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const expectedUser = {
        id: 1,
        email: "test@example.com",
        nickname: "Test User",
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedUserRepository.findByEmail.mockResolvedValue(user);
      mockedBcrypt.compare.mockResolvedValue(true as never);

      // Exercise
      const result = await userService.getUser(email, inputPassword);

      // Assertion
      expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        inputPassword,
        hashedPassword,
      );
      expect(result).toEqual(expectedUser);
    });

    test("존재하지 않는 이메일인 경우 AuthenticationError를 반환해야 한다", async () => {
      // Setup
      const email = "nonexistent@example.com";
      const password = "password123";

      mockedUserRepository.findByEmail.mockResolvedValue(null);

      // Exercise & Assertion
      await expect(userService.getUser(email, password)).rejects.toThrow(
        AuthenticationError,
      );
    });

    test("비밀번호가 일치하지 않는 경우 AuthenticationError를 반환해야 한다", async () => {
      // Setup
      const email = "test@example.com";
      const inputPassword = "wrongpassword";
      const hashedPassword = "hashedPassword123";

      const user = {
        id: 1,
        email: "test@example.com",
        nickname: "Test User",
        password: hashedPassword,
        image: null,
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedUserRepository.findByEmail.mockResolvedValue(user);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      // Exercise & Assertion
      await expect(userService.getUser(email, inputPassword)).rejects.toThrow(
        AuthenticationError,
      );
    });
  });

  // 유저 업데이트 테스트
  describe("updateUser", () => {
    test("사용자 정보 업데이트가 성공적으로 완료되어야 한다", async () => {
      // Setup
      const userId = 1;
      const updateData = {
        nickname: "Updated Name",
        refreshToken: "new-refresh-token",
      };

      const updatedUser = {
        id: 1,
        email: "test@example.com",
        nickname: "Updated Name",
        password: "hashedPassword",
        image: null,
        refreshToken: "new-refresh-token",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const expectedUser = {
        id: 1,
        email: "test@example.com",
        nickname: "Updated Name",
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedUserRepository.update.mockResolvedValue(updatedUser);

      // Exercise
      const result = await userService.updateUser(userId, updateData);

      // Assertion
      expect(mockedUserRepository.update).toHaveBeenCalledWith(
        userId,
        updateData,
      );
      expect(result).toEqual(expectedUser);
    });

    test("데이터베이스 에러 발생 시 에러를 반환해야 한다", async () => {
      // Setup
      const userId = 1;
      const updateData = { nickname: "Updated Name" };

      mockedUserRepository.update.mockRejectedValue(new Error("DB error"));

      // Exercise & Assertion
      await expect(userService.updateUser(userId, updateData)).rejects.toThrow(
        "DB error",
      );
    });
  });

  // 토큰 생성 테스트
  describe("createToken", () => {
    test("액세스 토큰이 성공적으로 생성되어야 한다", () => {
      // Setup
      const user = {
        id: 1,
        email: "test@example.com",
        nickname: "Test User",
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const expectedToken = "mock-access-token";
      mockedJwt.sign.mockImplementation(() => expectedToken);

      // Exercise
      const token = userService.createToken(user);

      // Assertion
      expect(mockedJwt.sign).toHaveBeenCalledWith(
        { userId: user.id },
        "test-secret",
        { expiresIn: "1h" },
      );
      expect(token).toBe(expectedToken);
    });

    test("리프레시 토큰이 성공적으로 생성되어야 한다", () => {
      // Setup
      const user = {
        id: 1,
        email: "test@example.com",
        nickname: "Test User",
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const expectedToken = "mock-refresh-token";
      mockedJwt.sign.mockImplementation(() => expectedToken);

      // Exercise
      const token = userService.createToken(user, "refresh");

      // Assertion
      expect(mockedJwt.sign).toHaveBeenCalledWith(
        { userId: user.id },
        "test-secret",
        { expiresIn: "2w" },
      );
      expect(token).toBe(expectedToken);
    });
  });

  // 토큰 갱신 테스트
  describe("refreshToken", () => {
    test("토큰 갱신이 성공적으로 완료되어야 한다", async () => {
      // Setup
      const userId = 1;
      const refreshToken = "valid-refresh-token";

      const user = {
        id: 1,
        email: "test@example.com",
        nickname: "Test User",
        password: "hashedPassword",
        image: null,
        refreshToken: "valid-refresh-token",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const newAccessToken = "new-access-token";
      const newRefreshToken = "new-refresh-token";

      mockedUserRepository.findById.mockResolvedValue(user);
      mockedJwt.sign
        .mockImplementationOnce(() => newAccessToken)
        .mockImplementationOnce(() => newRefreshToken);

      mockedUserRepository.update.mockResolvedValue({
        ...user,
        refreshToken: newRefreshToken,
      });

      // Exercise
      const result = await userService.refreshToken(userId, refreshToken);

      // Assertion
      expect(mockedUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockedJwt.sign).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
      expect(mockedUserRepository.update).toHaveBeenCalledWith(userId, {
        refreshToken: newRefreshToken,
      });
    });

    test("사용자가 존재하지 않는 경우 AuthenticationError를 반환해야 한다", async () => {
      // Setup
      const userId = 999;
      const refreshToken = "valid-refresh-token";

      mockedUserRepository.findById.mockResolvedValue(null);

      // Exercise & Assertion
      await expect(
        userService.refreshToken(userId, refreshToken),
      ).rejects.toThrow(AuthenticationError);
    });

    test("리프레시 토큰이 일치하지 않는 경우 AuthenticationError를 반환해야 한다", async () => {
      // Setup
      const userId = 1;
      const refreshToken = "invalid-refresh-token";

      const user = {
        id: 1,
        email: "test@example.com",
        nickname: "Test User",
        password: "hashedPassword",
        image: null,
        refreshToken: "different-refresh-token",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedUserRepository.findById.mockResolvedValue(user);

      // Exercise & Assertion
      await expect(
        userService.refreshToken(userId, refreshToken),
      ).rejects.toThrow(AuthenticationError);
    });

    test("토큰 서명 중 에러가 발생하면 에러를 반환해야 한다", async () => {
      // Setup
      const userId = 1;
      const refreshToken = "valid-refresh-token";

      const user = {
        id: 1,
        email: "test@example.com",
        nickname: "Test User",
        password: "hashedPassword",
        image: null,
        refreshToken: "valid-refresh-token",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedUserRepository.findById.mockResolvedValue(user);
      mockedJwt.sign.mockImplementation(() => {
        throw new Error("Sign failed");
      });

      // Exercise & Assertion
      await expect(
        userService.refreshToken(userId, refreshToken),
      ).rejects.toThrow("Sign failed");
    });
  });

  // 내 정보 조회 테스트
  describe("getMe", () => {
    test("사용자 조회가 성공적으로 완료되어야 한다", async () => {
      // Setup
      const userId = 1;
      const user = {
        id: 1,
        email: "test@example.com",
        nickname: "Test User",
        password: "hashedPassword",
        image: null,
        refreshToken: "refresh-token",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const expectedUser = {
        id: 1,
        email: "test@example.com",
        nickname: "Test User",
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedUserRepository.findById.mockResolvedValue(user);

      // Exercise
      const result = await userService.getMe(userId);

      // Assertion
      expect(mockedUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedUser);
    });

    test("사용자가 존재하지 않는 경우 NotFoundError를 반환해야 한다", async () => {
      // Setup
      const userId = 999;
      mockedUserRepository.findById.mockResolvedValue(null);

      // Exercise & Assertion
      await expect(userService.getMe(userId)).rejects.toThrow(NotFoundError);
    });
  });

  // 내가 좋아요한 상품 조회 테스트
  describe("getMyLikes", () => {
    //키워드 없을 때
    test("좋아요 누른 상품 목록과 총 개수를 정상적으로 반환해야 한다", async () => {
      // Setup
      const params = { userId: 1, page: 1, pageSize: 10 };

      const mockProduct = {
        id: 1,
        name: "Test Product",
        description: "Description",
        price: 10000,
        image: ["image.jpg"],
        tags: [{ name: "tag1" }],
        writer: { id: 2, nickname: "Seller" },
        likeCount: 5,
      };

      const mockLikes = [{ createdAt: new Date(), product: mockProduct }];
      const mockTotalCount = 1;

      mockedProductRepository.findLikes.mockResolvedValue([
        mockLikes as any,
        mockTotalCount,
      ]);

      // Exercise
      const result = await userService.getMyLikes(params);

      // Assertion
      expect(mockedProductRepository.findLikes).toHaveBeenCalledWith({
        where: { userId: 1 },
        skip: 0,
        take: 10,
      });
      expect(result.totalCount).toBe(1);
      expect(result.list).toHaveLength(1);
      expect(result.list[0].name).toBe("Test Product");
    });

    //키워드 있을 때
    test("키워드가 주어지면 상품명 또는 설명에 대한 OR 검색 조건이 포함되어야 한다", async () => {
      // Setup
      const params = { userId: 1, page: 2, pageSize: 5, keyword: "노트북" };

      const mockProduct = {
        id: 2,
        name: "게이밍 노트북",
        description: "최고급 사양의 노트북입니다.",
        price: 1500000,
        image: ["laptop.jpg"],
        tags: [{ name: "전자기기" }, { name: "컴퓨터" }],
        writer: { id: 3, nickname: "TechStore" },
        likeCount: 10,
      };

      const mockLikes = [{ createdAt: new Date(), product: mockProduct }];
      const mockTotalCount = 1;

      mockedProductRepository.findLikes.mockResolvedValue([
        mockLikes as any,
        mockTotalCount,
      ]);

      // Exercise
      const result = await userService.getMyLikes(params);

      // Assertion
      expect(mockedProductRepository.findLikes).toHaveBeenCalledWith({
        where: {
          userId: 1,
          product: {
            OR: [
              { name: { contains: "노트북", mode: "insensitive" } },
              { description: { contains: "노트북", mode: "insensitive" } },
            ],
          },
        },
        skip: 5,
        take: 5,
      });

      expect(result.totalCount).toBe(1);
      expect(result.list).toHaveLength(1);
      expect(result.list[0].name).toBe("게이밍 노트북");
      expect(result.list[0].tags).toEqual(["전자기기", "컴퓨터"]); // 중첩 배열 매핑 검증
    });

    test("상품 조회 중 데이터베이스 에러가 발생하면 에러를 반환해야 한다", async () => {
      // Setup
      const params = { userId: 1, page: 1, pageSize: 10 };

      mockedProductRepository.findLikes.mockRejectedValue(
        new Error("DB error"),
      );

      // Exercise & Assertion
      await expect(userService.getMyLikes(params)).rejects.toThrow("DB error");
    });
  });
});
