import { Request, Response, NextFunction } from "express";
import { errorHandler } from "./errorHandler";
import { CustomError } from "../utils/customError";

describe("errorHandler", () => {
  //Setup
  const mockRes = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  test("CustomError면 code를 상태 코드로 응답해야 한다", () => {
    //Setup
    const req = { path: "/products", method: "POST" } as unknown as Request;
    const res = mockRes();
    const next = jest.fn() as NextFunction;
    const error = new CustomError("입력값을 확인해주세요", 400, {
      reason: "invalid",
    });

    //Exercise
    errorHandler(error, req, res, next);

    //Assertion
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "/products",
        method: "POST",
        message: "입력값을 확인해주세요",
        data: { reason: "invalid" },
      }),
    );
  });

  test("어떤 조건에도 해당하지 않는 에러면 기본값 500으로 응답해야 한다", () => {
    //Setup
    const req = { path: "/products", method: "GET" } as unknown as Request;
    const res = mockRes();
    const next = jest.fn() as NextFunction;
    const error = new Error("예상치 못한 에러");

    //Exercise
    errorHandler(error, req, res, next);

    //Assertion
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
