const config = {
  preset: "ts-jest", // ts-jest 프리셋 사용
  testEnvironment: "node", // node 환경 사용
  clearMocks: true, // 테스트마다 mock 호출기록 초기화 (mock.calls 비움)
  restoreMocks: true, // jest.spyOn으로 가로챈 원본 함수를 되돌림 (spyOn 호출 전으로)

  coverageProvider: "babel", // TS 소스맵 이슈 회피
  coverageDirectory: "coverage", // 커버리지 결과 저장 폴더
  coverageReporters: ["text", "lcov"], // 커버리지 결과 형식

  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.{test,spec}.ts",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
    "!src/types/**",
    "!src/server.ts", // listen() 진입점 제외
  ],

  // 유닛테스트 대상 폴더만 평가. 전체 평균은 아직 의미 없음
  coverageThreshold: {
    // 커버리지 기준 설정. 달성 못할 시 CI 실패
    global: {}, // 타입 만족용. 기준 항목이 없으니 아무것도 강제 안 함
    "./src/services/": {
      statements: 70,
      branches: 60,
      functions: 70,
      lines: 70,
    },
    "./src/middlewares/": {
      statements: 70,
      branches: 60,
      functions: 70,
      lines: 70,
    },
  },
};

export default config;
