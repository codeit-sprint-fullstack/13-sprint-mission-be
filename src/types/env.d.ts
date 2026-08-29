// 실제 검증과 기본값 처리는 src/config/env.ts 의 zod 스키마가 담당한다.
// 여기서는 process.env를 직접 참조하는 코드(예: Prisma의 DATABASE_URL)를 위해
// 어떤 키가 쓰이는지 타입으로 명시해 둔다.
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: "development" | "production" | "test";
      DATABASE_URL: string;
      JWT_SECRET: string;
      JWT_EXPIRES_IN?: string;
      CORS_ORIGIN?: string;
      PORT?: string;

      UPLOAD_DRIVER?: "local" | "s3";
      AWS_REGION?: string;
      S3_BUCKET?: string;
      S3_PRESIGN_EXPIRES?: string;
      AWS_ACCESS_KEY_ID?: string;
      AWS_SECRET_ACCESS_KEY?: string;
    }
  }
}

export {};
