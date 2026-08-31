import request from "supertest";
import app from "../src/app";

describe("앱 기본 엔드포인트", () => {
  test("GET / 은 200과 서비스 이름을 돌려준다", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Panda Market API" });
  });

  test("GET /health 는 상태와 현재 환경을 알려준다", async () => {
    // 배포 후 pm2·Nginx가 제대로 붙었는지 확인할 때 쓰는 경로다.
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok", env: "test" });
  });

  test("정의되지 않은 경로는 404", async () => {
    const res = await request(app).get("/이런경로는없다");

    expect(res.status).toBe(404);
  });
});
