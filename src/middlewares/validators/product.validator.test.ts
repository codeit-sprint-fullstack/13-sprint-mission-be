import { NextFunction, Request, Response } from "express";
import productValidator, { schema } from "./product.validator";

describe("tags 유효성 검사", () => {
  //Setup
  const tags = schema.shape.tags;

  test("태그가 문자열 1개로 들어오면 배열로 변환된다", () => {
    //Exercise
    const result = tags.safeParse("문자");

    //Assertion
    expect(result.data).toEqual(["문자"]);
    expect(result.success).toBe(true);
  });

  test("태그가 중복되면 에러를 던져야 한다", () => {
    //Exercise
    const result = tags.safeParse(["같음", "같음"]);

    //Assertion
    expect(result.error?.issues[0].message).toBe("태그가 중복됐습니다.");
  });
});

describe("existingImages 유효성 검사", () => {
  test("이미지가 문자열 1개로 들어오면 배열로 변환된다", () => {
    //Setup
    const existingImages = schema.shape.existingImages;

    //Exercise
    const result = existingImages.safeParse("image12345");

    //Assertion
    expect(result.data).toEqual(["image12345"]);
    expect(result.success).toBe(true);
  });
});

describe("validateCreateProduct", () => {
  test("이미지가 없는 경우 에러가 나온다", () => {
    //Setup
    const req = {
      body: {
        name: "테스트",
        description: "테스트 설명",
        price: 123,
      },
      files: [],
    } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    //Exercise&Assertion
    expect(() =>
      productValidator.validateCreateProduct(req, res, next),
    ).toThrow("이미지 파일을 1개 이상 등록해주세요");
  });
});
