import { NextFunction } from "express";
import { validate, validateQuery } from "../middlewares/validate";
import { z, ZodError } from "zod";

describe("Validator Middlewares", () => {
  let mockRequest: any;
  let mockResponse: any;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {};
    mockResponse = {};
    mockNext = jest.fn() as jest.MockedFunction<NextFunction>;
  });

  describe("validate (req.body 검증)", () => {
    const bodySchema = z.object({
      name: z.string(),
      age: z.number(),
    });

    test("body 데이터가 스키마를 통과하면 파싱된 결과로 req.body를 업데이트하고 next()를 호출해야 한다", () => {
      // Setup
      const validBody = { name: "테스터", age: 25 };
      mockRequest.body = validBody;

      const middleware = validate(bodySchema);

      // Exercise
      middleware(mockRequest, mockResponse, mockNext);

      // Assertion
      expect(mockRequest.body).toEqual(validBody);
      expect(mockNext).toHaveBeenCalledWith();
    });

    test("body 데이터가 스키마 조건에 맞지 않으면 예외를 catch하여 next(error)를 호출해야 한다", () => {
      // Setup
      const invalidBody = { name: "테스터", age: "스물다섯" };
      mockRequest.body = invalidBody;

      const middleware = validate(bodySchema);

      // Exercise
      middleware(mockRequest, mockResponse, mockNext);

      // Assertion
      expect(mockNext).toHaveBeenCalledWith(expect.any(ZodError)); // ZodError가 next로 전달됨
    });
  });

  describe("validateQuery (req.query 검증)", () => {
    const querySchema = z.object({
      keyword: z.string().min(2),
    });

    test("query 파라미터가 스키마를 통과하면 req.validatedQuery에 할당하고 next()를 호출해야 한다", () => {
      // Setup
      const validQuery = { keyword: "노트북" };
      mockRequest.query = validQuery;

      const middleware = validateQuery(querySchema);

      // Exercise
      middleware(mockRequest, mockResponse, mockNext);

      // Assertion
      expect(mockRequest.validatedQuery).toEqual(validQuery);
      expect(mockNext).toHaveBeenCalledWith();
    });

    test("query 파라미터가 스키마 조건에 맞지 않으면 예외를 catch하여 next(error)를 호출해야 한다", () => {
      // Setup
      const invalidQuery = { keyword: "폰" };
      mockRequest.query = invalidQuery;

      const middleware = validateQuery(querySchema);

      // Exercise
      middleware(mockRequest, mockResponse, mockNext);

      // Assertion
      expect(mockNext).toHaveBeenCalledWith(expect.any(ZodError));
    });
  });
});
