/** @type {import('jest').Config} */
module.exports = {
  // ts-jest가 .ts 파일을 그때그때 컴파일해주므로, 테스트 전에 따로 빌드할 필요가 없다.
  preset: "ts-jest",
  // 브라우저 API(jsdom)가 필요 없는 백엔드 코드라서 node 환경으로 돌린다.
  testEnvironment: "node",

  roots: ["<rootDir>/tests"],
  testMatch: ["**/*.test.ts"],

  // config/env.ts가 import되는 순간 환경 변수를 검증하므로, 그보다 먼저 값을 채워둬야 한다.
  setupFiles: ["<rootDir>/tests/setupEnv.ts"],
  // Prisma 모킹은 테스트 프레임워크가 준비된 뒤에 걸어야 beforeEach를 쓸 수 있다.
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],

  // 테스트마다 mock 호출 기록을 초기화해서 서로 영향을 주지 않게 한다.
  clearMocks: true,

  collectCoverageFrom: [
    "src/**/*.ts",
    // 서버 기동/타입 선언은 로직이 없어 커버리지 대상에서 제외한다.
    "!src/server.ts",
    "!src/types/**",
    "!src/**/*.d.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
};
