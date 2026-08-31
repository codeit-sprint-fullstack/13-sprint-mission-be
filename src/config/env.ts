import path from "path";
import dotenv from "dotenv";
import { z } from "zod";

// 배포 환경에서는 NODE_ENV=production 으로 실행되고, 로컬에서는 지정하지 않으므로
// development 로 취급한다. 이 값에 따라 읽어들일 .env 파일이 달라진다.
const nodeEnv = process.env.NODE_ENV ?? "development";

// dotenv는 "이미 설정된 값은 덮어쓰지 않는다"는 규칙이라, 더 구체적인 파일을 먼저 읽는다.
// 즉 .env.production > .env 순서로 우선순위가 잡힌다.
// EC2처럼 OS 환경 변수로 직접 주입하는 경우엔 파일이 없어도 그 값이 그대로 쓰인다.
// quiet: dotenv가 매번 찍는 안내 로그를 끈다(테스트 출력이 묻히는 걸 방지).
dotenv.config({ path: path.resolve(process.cwd(), `.env.${nodeEnv}`), quiet: true });
dotenv.config({ path: path.resolve(process.cwd(), ".env"), quiet: true });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),

  DATABASE_URL: z.string().min(1, "DATABASE_URL 환경 변수가 필요합니다."),

  JWT_SECRET: z.string().min(1, "JWT_SECRET 환경 변수가 필요합니다."),
  JWT_EXPIRES_IN: z.string().default("7d"),

  // 로컬 프론트와 배포된 프론트(Vercel)를 동시에 허용해야 하므로 쉼표로 여러 개를 받는다.
  CORS_ORIGIN: z.string().default("http://localhost:3001"),

  // 업로드 저장소. 로컬 개발 중에는 AWS 없이도 돌아가야 해서 local을 쓸 수 있게 둔다.
  UPLOAD_DRIVER: z.enum(["local", "s3"]).optional(),

  AWS_REGION: z.string().default("ap-northeast-2"),
  S3_BUCKET: z.string().optional(),
  // EC2에서는 IAM Role로 자격 증명을 받으므로 이 두 값이 없어도 정상이다.
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  // Presigned URL 유효 시간(초)
  S3_PRESIGN_EXPIRES: z.coerce.number().int().positive().default(300),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // 서버가 반쯤 뜬 채로 나중에 터지는 것보다, 시작 시점에 원인을 알고 죽는 편이 낫다.
  const messages = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(`환경 변수 설정이 올바르지 않습니다:\n${messages}`);
}

const raw = parsed.data;

// S3_BUCKET이 있으면 s3, 없으면 local을 기본값으로 삼는다.
// UPLOAD_DRIVER를 명시하면 그 값이 우선한다.
const uploadDriver = raw.UPLOAD_DRIVER ?? (raw.S3_BUCKET ? "s3" : "local");

if (uploadDriver === "s3" && !raw.S3_BUCKET) {
  throw new Error("UPLOAD_DRIVER=s3 인 경우 S3_BUCKET 환경 변수가 필요합니다.");
}

const env = {
  nodeEnv: raw.NODE_ENV,
  isProduction: raw.NODE_ENV === "production",
  isTest: raw.NODE_ENV === "test",
  port: raw.PORT,

  databaseUrl: raw.DATABASE_URL,

  jwt: {
    secret: raw.JWT_SECRET,
    expiresIn: raw.JWT_EXPIRES_IN,
  },

  // "a, b" 형태로 들어와도 되도록 공백을 정리한다.
  corsOrigins: raw.CORS_ORIGIN.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),

  upload: {
    driver: uploadDriver,
    maxFileSize: 5 * 1024 * 1024,
    maxFiles: 3,
  },

  aws: {
    region: raw.AWS_REGION,
    bucket: raw.S3_BUCKET,
    presignExpires: raw.S3_PRESIGN_EXPIRES,
  },
} as const;

export type Env = typeof env;

export default env;
