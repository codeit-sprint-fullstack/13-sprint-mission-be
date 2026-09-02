import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/user.repository";
import userService from "./user.service";
import createToken from "../utils/token";

jest.mock("bcrypt");
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

jest.mock("jsonwebtoken");
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

jest.mock("../repositories/user.repository");
const mockedUserRepository = userRepository as jest.Mocked<
  typeof userRepository
>;

jest.mock("../utils/token");
const mockedCreateToken = createToken as jest.MockedFunction<
  typeof createToken
>;

//Teardown
afterEach(() => {
  jest.clearAllMocks();
});

describe("createUser", () => {
  test("정상 입력이면 비밀번호를 해싱해서 저장하고, 비밀번호를 뺀 데이터를 반환해야 한다", async () => {
    //Setup
    const dto = {
      email: "test@test.com",
      name: "test",
      password: "1234",
    };
    const hashedPassword = "hashedPassword";
    const userData = {
      id: 1,
      email: "test@test.com",
      nickname: "test",
      encryptedPassword: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      image: null,
      refreshToken: null,
    };

    mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);
    mockedUserRepository.create.mockResolvedValue(userData);

    //Exercise
    const result = await userService.createUser(dto);

    //Assertion
    expect(mockedBcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
    expect(mockedUserRepository.create).toHaveBeenCalledWith({
      email: dto.email,
      nickname: dto.name,
      encryptedPassword: hashedPassword,
    });

    const { encryptedPassword, ...safeUserData } = userData;
    expect(result).toEqual(safeUserData);
  });
});

describe("loginUser", () => {
  //Setup
  const userData = {
    id: 1,
    email: "test@test.com",
    nickname: "test",
    encryptedPassword: "hashPassword",
    createdAt: new Date(),
    updatedAt: new Date(),
    image: null,
    refreshToken: null,
  };

  test("등록되어 있는 이메일이 아니면 에러가 발생한다.", async () => {
    //Setup
    const dto = {
      email: "test@test.com",
      password: "1234",
    };

    mockedUserRepository.findByEmail.mockResolvedValue(null);

    //Exercise & Assertion
    await expect(userService.loginUser(dto)).rejects.toThrow(
      "등록된 이메일이 아닙니다",
    );
  });

  test("비밀번호가 일치하지 않는 경우 에러가 발생한다.", async () => {
    //Setup
    const password = "wrongpassword";
    const email = userData.email;

    mockedUserRepository.findByEmail.mockResolvedValue(userData);
    mockedBcrypt.compare.mockResolvedValue(false as never);

    //Exercise & Assertion
    await expect(userService.loginUser({ email, password })).rejects.toThrow(
      "등록된 비밀번호가 아닙니다",
    );
    expect(mockedBcrypt.compare).toHaveBeenCalledWith(
      password,
      userData.encryptedPassword,
    );
  });

  test("사용자 로그인이 성공적으로 완료되어야 한다.", async () => {
    //Setup
    const email = userData.email;
    const password = "1234";

    mockedUserRepository.findByEmail.mockResolvedValue(userData);
    mockedBcrypt.compare.mockResolvedValue(true as never);
    mockedCreateToken.mockImplementation((_userId, type) =>
      type === "refresh" ? "new-refresh-token" : "new-access-token",
    );

    //Exercise
    const result = await userService.loginUser({ email, password });

    //Assertion
    //인자가 엉뚱한게 오지않고 정확하게 오는지 확인하기위함
    expect(mockedBcrypt.compare).toHaveBeenCalledWith(
      password,
      userData.encryptedPassword,
    );
    expect(mockedCreateToken).toHaveBeenNthCalledWith(
      1,
      userData.id,
      "refresh",
    );
    expect(mockedCreateToken).toHaveBeenNthCalledWith(2, userData.id);
    expect(mockedUserRepository.updateRefreshToken).toHaveBeenCalledWith(
      userData.id,
      "new-refresh-token",
    );

    const { encryptedPassword, refreshToken, ...safeUserData } = userData;
    expect(result).toEqual({
      userData: safeUserData,
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
    });
  });
});

describe("getUser", () => {
  //Setup
  const userData = {
    id: 1,
    email: "test@test.com",
    nickname: "test",
    encryptedPassword: "hashPassword",
    createdAt: new Date(),
    updatedAt: new Date(),
    image: null,
    refreshToken: "old-refresh-token",
  };

  test("해당 유저가 없으면 에러를 던져야 한다", async () => {
    //Setup
    const userId = 999;

    mockedUserRepository.findById.mockResolvedValue(null);

    //Exercise & Assertion
    await expect(userService.getUser(userId)).rejects.toThrow(
      "해당 유저를 찾을 수 없습니다",
    );
  });

  test("정상적으로 조회되면 비밀번호와 리프레시 토큰을 뺀 데이터를 반환해야 한다", async () => {
    //Setup
    mockedUserRepository.findById.mockResolvedValue(userData);

    //Exercise
    const result = await userService.getUser(userData.id);

    //Assertion
    expect(mockedUserRepository.findById).toHaveBeenCalledWith(userData.id);

    const { encryptedPassword, refreshToken, ...safeUserData } = userData;
    expect(result).toEqual(safeUserData);
  });
});

describe("refreshUserToken", () => {
  //Setup
  const userData = {
    id: 1,
    email: "test@test.com",
    nickname: "test",
    encryptedPassword: "hashPassword",
    createdAt: new Date(),
    updatedAt: new Date(),
    image: null,
    refreshToken: "valid-refresh-token",
  };

  test("디코딩 결과가 문자열이면 에러를 던져야 한다", async () => {
    //Setup
    mockedJwt.verify.mockReturnValue("just-a-string" as never);

    //Exercise & Assertion
    await expect(userService.refreshUserToken("some-token")).rejects.toThrow(
      "유효하지 않은 토큰입니다.",
    );
  });

  test("디코딩된 userId가 숫자가 아니면 에러를 던져야 한다", async () => {
    //Setup
    mockedJwt.verify.mockReturnValue({ userId: "not-a-number" } as never);

    //Exercise & Assertion
    await expect(userService.refreshUserToken("some-token")).rejects.toThrow(
      "유효하지 않은 토큰입니다.",
    );
  });

  test("해당 유저가 없으면 에러를 던져야 한다", async () => {
    //Setup
    mockedJwt.verify.mockReturnValue({ userId: userData.id } as never);
    mockedUserRepository.findById.mockResolvedValue(null);

    //Exercise & Assertion
    await expect(userService.refreshUserToken("some-token")).rejects.toThrow(
      "해당 유저를 찾을 수 없습니다",
    );
  });

  test("DB에 저장된 refreshToken과 다르면 에러를 던져야 한다", async () => {
    //Setup
    mockedJwt.verify.mockReturnValue({ userId: userData.id } as never);
    mockedUserRepository.findById.mockResolvedValue(userData);

    //Exercise & Assertion
    await expect(userService.refreshUserToken("다른-토큰")).rejects.toThrow(
      "유효한 리프레시 토큰이 아닙니다.",
    );
  });

  test("정상이면 새로운 accessToken을 반환해야 한다", async () => {
    //Setup
    mockedJwt.verify.mockReturnValue({ userId: userData.id } as never);
    mockedUserRepository.findById.mockResolvedValue(userData);
    mockedCreateToken.mockReturnValue("new-access-token");

    //Exercise
    const result = await userService.refreshUserToken(userData.refreshToken);

    //Assertion
    expect(mockedCreateToken).toHaveBeenCalledWith(userData.id);
    expect(result).toBe("new-access-token");
  });
});

describe("logoutUser", () => {
  test("refreshToken을 null로 초기화해야 한다", async () => {
    //Setup
    const userId = 1;

    //Exercise
    await userService.logoutUser(userId);

    //Assertion
    expect(mockedUserRepository.updateRefreshToken).toHaveBeenCalledWith(
      userId,
      null,
    );
  });
});
