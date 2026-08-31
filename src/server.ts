import env from "./config/env";
import app from "./app";
import prisma from "./utils/prisma";

const server = app.listen(env.port, () => {
  console.log(`[${env.nodeEnv}] 서버 실행 중: ${env.port}`);
});

// pm2가 재시작·중지할 때 SIGINT/SIGTERM을 보내는데, 그대로 죽으면 처리 중이던 요청이
// 끊기고 DB 커넥션도 정리되지 않는다. 진행 중인 요청을 마무리한 뒤 종료한다.
function shutdown(signal: string): void {
  console.log(`${signal} 수신 — 서버를 정리합니다.`);
  server.close(() => {
    void prisma.$disconnect().finally(() => process.exit(0));
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

export default server;
