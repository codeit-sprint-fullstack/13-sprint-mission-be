import createToken from "./token";
import jwt from "jsonwebtoken";

//테스트용 JWT_SECRET키
process.env.JWT_SECRET = "test-secret";

describe("createToken", () => {
  //Setup 공용으로 사용될 유저 아이디
  const userId = 1;

  //Teardown
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("생성되는 토큰 type이 default일 때 토큰의 유효기간이 1시간이어야 한다", () => {
    //Setup
    const signSpy = jest.spyOn(jwt, "sign");

    //ExerCise
    createToken(userId);

    //Assertion
    expect(signSpy).toHaveBeenCalledWith(
      { userId },
      process.env.JWT_SECRET,
      expect.objectContaining({ expiresIn: "1h" }),
    );
  });

  test("생성되는 토큰 type이 refresh일 때 토큰의 유효기간이 1일이어야 한다", () => {
    //Setup
    const signSpy = jest.spyOn(jwt, "sign");

    //Exercise
    createToken(userId, "refresh");

    //Assertion
    expect(signSpy).toHaveBeenCalledWith(
      { userId },
      process.env.JWT_SECRET,
      expect.objectContaining({ expiresIn: "1d" }),
    );
  });
});
