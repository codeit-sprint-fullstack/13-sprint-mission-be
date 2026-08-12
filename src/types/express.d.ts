import "express";

// express-jwt 는 Request 를 전역 확장하지 않고 자체 Request 타입만 export 한다.
// 미들웨어가 붙여주는 auth 페이로드를 여기서 한 번만 선언해 전 라우터에서 쓴다.
declare global {
  namespace Express {
    interface Request {
      auth?: { userId: number };
    }
  }
}
