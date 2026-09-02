import { NextFunction } from "express";
import errorHandler from "../middlewares/errorHandler";
import { ZodError } from "zod";

describe("ErrorHandler Middleware", () => {
  let mockRequest: any;
  let mockResponse: any;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    jest.clearAllMocks();

    // 에러 발생 시 출력되는 console.error 로그가 테스트 결과창을 지저분하게 만드는 것을 방지
    jest.spyOn(console, "error").mockImplementation(() => {});

    mockRequest = {
      path: "/api/test",
      method: "POST",
    };

    // res.status(code).json(data) 체이닝을 모킹
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn() as jest.MockedFunction<NextFunction>;
  });

  test("JWT 인증 에러(UnauthorizedError 등) 발생 시 401 상태 코드를 반환해야 한다", () => {
    // Setup
    const error = new Error("jwt expired");
    error.name = "TokenExpiredError";

    // Exercise
    errorHandler(error, mockRequest, mockResponse, mockNext);

    // Assertion
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "/api/test",
        message: "jwt expired",
      }),
    );
  });

  test("ZodError 발생 시 400 상태 코드와 유효성 검사 실패 상세 필드를 반환해야 한다", () => {
    // Setup
    const zodError = new ZodError([
      {
        path: ["email"],
        message: "유효하지 않은 이메일 형식입니다.",
        code: "custom",
      },
    ]);

    // Exercise
    errorHandler(zodError, mockRequest, mockResponse, mockNext);

    // Assertion
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "입력값 유효성 검증에 실패했습니다.",
        data: [{ field: "email", message: "유효하지 않은 이메일 형식입니다." }],
      }),
    );
  });

  test("Prisma 중복 에러(P2002) 발생 시 400 상태 코드와 중복 메시지를 반환해야 한다", () => {
    // Setup
    const error: any = new Error("Prisma error");
    error.code = "P2002";

    // Exercise
    errorHandler(error, mockRequest, mockResponse, mockNext);

    // Assertion
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "중복된 값이 존재합니다.",
      }),
    );
  });

  test("Prisma 리소스 없음 에러(P2025) 발생 시 404 상태 코드를 반환해야 한다", () => {
    // Setup
    const error: any = new Error("Prisma error");
    error.code = "P2025";

    // Exercise
    errorHandler(error, mockRequest, mockResponse, mockNext);

    // Assertion
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "요청한 리소스를 찾을 수 없습니다.",
      }),
    );
  });

  test("그 외 일반 에러 발생 시 에러 객체의 코드나 기본 500 상태 코드를 반환해야 한다", () => {
    // Setup
    const error = new Error("알 수 없는 서버 에러 발생");

    // Exercise
    errorHandler(error, mockRequest, mockResponse, mockNext);

    // Assertion
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "알 수 없는 서버 에러 발생",
      }),
    );
  });
});
