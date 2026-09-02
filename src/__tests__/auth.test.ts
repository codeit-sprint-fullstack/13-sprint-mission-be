import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { ForbiddenError, NotFoundError } from "../types/errors";

process.env.JWT_SECRET = "test-secret";

const auth = require("../middlewares/auth").default;

// 모듈 모킹
jest.mock("../lib/prisma", () => ({
  prisma: {
    product: { findUnique: jest.fn() },
    article: { findUnique: jest.fn() },
    comment: { findUnique: jest.fn() },
  },
}));
const mockedPrisma = prisma as jest.Mocked<typeof prisma>;

describe("Auth Middleware", () => {
  let mockRequest: any;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {};
    mockResponse = {};
    mockNext = jest.fn() as jest.MockedFunction<NextFunction>;
  });

  describe("verifyRefreshToken", () => {
    test("expressjwt 미들웨어가 올바르게 설정되어야 한다", () => {
      // Exercise & Assertion
      expect(auth.verifyRefreshToken).toBeDefined();
      expect(typeof auth.verifyRefreshToken).toBe("function");
    });
  });

  describe("isLoggedIn", () => {
    test("expressjwt 미들웨어가 올바르게 설정되어야 한다", () => {
      // Exercise & Assertion
      expect(auth.isLoggedIn).toBeDefined();
      expect(typeof auth.isLoggedIn).toBe("function");
    });
  });

  describe("isProductOwner", () => {
    test("상품 등록자와 로그인한 유저가 일치하면 다음 미들웨어로 진행되어야 한다", async () => {
      // Setup
      const userId = 1;
      const productId = 1;
      mockRequest.params = { id: productId.toString() };
      mockRequest.auth = { userId };

      (mockedPrisma.product.findUnique as jest.Mock).mockResolvedValue({
        id: productId,
        writerId: userId,
      });

      // Exercise
      await auth.isProductOwner(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assertion
      expect(mockedPrisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: productId },
      });
      expect(mockNext).toHaveBeenCalledWith();
    });

    test("상품이 존재하지 않으면 NotFoundError를 발생시켜야 한다", async () => {
      // Setup
      const productId = 999;
      mockRequest.params = { id: productId.toString() };
      mockRequest.auth = { userId: 1 };

      (mockedPrisma.product.findUnique as jest.Mock).mockResolvedValue(null);

      // Exercise
      await auth.isProductOwner(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assertion
      expect(mockedPrisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: productId },
      });
      expect(mockNext).toHaveBeenCalledWith(expect.any(NotFoundError));
      const error = mockNext.mock.calls[0][0] as unknown as NotFoundError;
      expect(error.message).toBe("해당 상품을 찾을 수 없습니다.");
    });

    test("다른 사용자의 상품에 접근하면 ForbiddenError를 발생시켜야 한다", async () => {
      // Setup
      const userId = 1;
      const productId = 1;
      mockRequest.params = { id: productId.toString() };
      mockRequest.auth = { userId };

      (mockedPrisma.product.findUnique as jest.Mock).mockResolvedValue({
        id: productId,
        writerId: 2, // 다른 사용자
      });

      // Exercise
      await auth.isProductOwner(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assertion
      expect(mockNext).toHaveBeenCalledWith(expect.any(ForbiddenError));
      const error = mockNext.mock.calls[0][0] as unknown as ForbiddenError;
      expect(error.message).toBe("상품 등록자만 수정 및 삭제가 가능합니다.");
    });
  });

  describe("isArticleOwner", () => {
    test("게시글 작성자와 로그인한 유저가 일치하면 다음 미들웨어로 진행되어야 한다", async () => {
      // Setup
      const userId = 1;
      const articleId = 1;
      mockRequest.params = { id: articleId.toString() };
      mockRequest.auth = { userId };

      (mockedPrisma.article.findUnique as jest.Mock).mockResolvedValue({
        id: articleId,
        writerId: userId,
      });

      // Exercise
      await auth.isArticleOwner(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assertion
      expect(mockedPrisma.article.findUnique).toHaveBeenCalledWith({
        where: { id: articleId },
      });
      expect(mockNext).toHaveBeenCalledWith();
    });

    test("게시글이 존재하지 않으면 NotFoundError를 발생시켜야 한다", async () => {
      // Setup
      mockRequest.params = { id: "999" };
      mockRequest.auth = { userId: 1 };
      (mockedPrisma.article.findUnique as jest.Mock).mockResolvedValue(null);

      // Exercise
      await auth.isArticleOwner(
        mockRequest,
        mockResponse as Response,
        mockNext,
      );

      // Assertion
      expect(mockNext).toHaveBeenCalledWith(expect.any(NotFoundError));
    });

    test("다른 사용자의 게시글에 접근하면 ForbiddenError를 발생시켜야 한다", async () => {
      // Setup
      mockRequest.params = { id: "1" };
      mockRequest.auth = { userId: 1 };
      (mockedPrisma.article.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        writerId: 2,
      });

      // Exercise
      await auth.isArticleOwner(
        mockRequest,
        mockResponse as Response,
        mockNext,
      );

      // Assertion
      expect(mockNext).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });
  });

  describe("isCommentOwner", () => {
    test("댓글 작성자와 로그인한 유저가 일치하면 다음 미들웨어로 진행되어야 한다", async () => {
      // Setup
      const userId = 1;
      const commentId = 1;
      mockRequest.params = { id: commentId.toString() };
      mockRequest.auth = { userId };

      (mockedPrisma.comment.findUnique as jest.Mock).mockResolvedValue({
        id: commentId,
        writerId: userId,
      });

      // Exercise
      await auth.isCommentOwner(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assertion
      expect(mockedPrisma.comment.findUnique).toHaveBeenCalledWith({
        where: { id: commentId },
      });
      expect(mockNext).toHaveBeenCalledWith();
    });

    test("댓글이 존재하지 않으면 NotFoundError를 발생시켜야 한다", async () => {
      // Setup
      mockRequest.params = { id: "999" };
      mockRequest.auth = { userId: 1 };
      (mockedPrisma.comment.findUnique as jest.Mock).mockResolvedValue(null);

      // Exercise
      await auth.isCommentOwner(
        mockRequest,
        mockResponse as Response,
        mockNext,
      );

      // Assertion
      expect(mockNext).toHaveBeenCalledWith(expect.any(NotFoundError));
    });

    test("다른 사용자의 댓글에 접근하면 ForbiddenError를 발생시켜야 한다", async () => {
      // Setup
      mockRequest.params = { id: "1" };
      mockRequest.auth = { userId: 1 };
      (mockedPrisma.comment.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        writerId: 2,
      });

      // Exercise
      await auth.isCommentOwner(
        mockRequest,
        mockResponse as Response,
        mockNext,
      );

      // Assertion
      expect(mockNext).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });
  });
});
