import Redis from "ioredis";

// refresh token 저장용 (세션 별 발급/회전/만료 관리)
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

redis.on("error", (err) => {
  console.error("Redis 연결 에러:", err.message);
});

export default redis;
