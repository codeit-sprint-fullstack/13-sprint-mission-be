import { NextFunction } from "express";
import multer from "multer";
import { uploadImages } from "../middlewares/imageUpload";
import { BadRequestError } from "../types/errors";

// 모듈 모킹
jest.mock("multer", () => {
  const originalMulter = jest.requireActual("multer");
  const innerMockUpload = jest.fn();
  const multerFn = jest.fn(() => ({
    array: jest.fn(() => innerMockUpload),
  }));
  (multerFn as any).diskStorage = jest.fn();
  (multerFn as any).MulterError = originalMulter.MulterError;
  (multerFn as any).__mockUpload = innerMockUpload;

  return multerFn;
});

const mockUpload = (multer as any).__mockUpload;

describe("ImageUpload Middleware", () => {
  let mockRequest: any;
  let mockResponse: any;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {};
    mockResponse = {};
    mockNext = jest.fn() as jest.MockedFunction<NextFunction>;
  });

  test("파일이 3개 이하로 업로드되면 정상적으로 next()를 호출해야 한다", () => {
    // Setup
    mockUpload.mockImplementation((req: any, res: any, cb: any) => {
      cb();
    });

    // Exercise
    uploadImages(mockRequest as any, mockResponse as any, mockNext);

    // Assertion
    expect(mockUpload).toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith();
  });

  test("파일 개수가 3개를 초과하면 LIMIT_UNEXPECTED_FILE 에러를 잡아 BadRequestError를 전달해야 한다", () => {
    // Setup
    const limitError = new multer.MulterError("LIMIT_UNEXPECTED_FILE");
    mockUpload.mockImplementation((req: any, res: any, cb: any) => {
      cb(limitError);
    });

    // Exercise
    uploadImages(mockRequest as any, mockResponse as any, mockNext);

    // Assertion
    expect(mockUpload).toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestError));
    const error = mockNext.mock.calls[0][0] as unknown as BadRequestError;
    expect(error.message).toBe("이미지는 최대 3개까지 등록 가능합니다.");
  });

  test("그 외 Multer 처리 중 에러가 발생하면 해당 에러를 next()로 그대로 전달해야 한다", () => {
    // Setup
    const unknownError = new Error("알 수 없는 업로드 에러");
    mockUpload.mockImplementation((req: any, res: any, cb: any) => {
      cb(unknownError);
    });

    // Exercise
    uploadImages(mockRequest as any, mockResponse as any, mockNext);

    // Assertion
    expect(mockUpload).toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(unknownError);
  });
});
