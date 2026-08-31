// src/config/env.ts는 import되는 즉시 환경 변수를 검증하고, 값이 없으면 예외를 던진다.
// 테스트는 실제 .env나 실제 DB에 의존하면 안 되므로 여기서 고정값을 미리 넣어준다.
// (dotenv는 이미 설정된 값을 덮어쓰지 않으므로 이 값들이 그대로 유지된다.)
process.env.NODE_ENV = "test";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/panda_test?schema=public";
process.env.JWT_SECRET = "test-secret-key-for-unit-tests";
process.env.JWT_EXPIRES_IN = "1h";
process.env.CORS_ORIGIN = "http://localhost:3001";
process.env.PORT = "3000";

// 업로드 테스트는 실제 S3에 붙지 않는다.
// 앱은 local 모드로 두되, S3 유틸을 단독으로 검증할 수 있도록 버킷 이름은 채워둔다.
// (UPLOAD_DRIVER를 명시했으므로 S3_BUCKET이 있어도 driver는 local로 유지된다.)
process.env.UPLOAD_DRIVER = "local";
process.env.AWS_REGION = "ap-northeast-2";
process.env.S3_BUCKET = "test-panda-bucket";
process.env.S3_PRESIGN_EXPIRES = "300";
