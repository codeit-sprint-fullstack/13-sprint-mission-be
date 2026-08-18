// req.auth = user; 사용시 타입 확장
export {}; // 이 파일을 모듈로 만들어야 declare global이 실제로 병합됨

declare global {
  namespace Express {
    interface Request {
      user?: { userId: number };
    }
  }
}
