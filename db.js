import mongoose from "mongoose";

// 🚀 시작 전 준비 (한 번만 하면 돼요):
//   1. https://www.mongodb.com/cloud/atlas 에서 무료 계정 생성
//   2. 클러스터(M0 Free) 생성 → Database Access 에서 사용자 추가 (ID/비밀번호 꼭 기억!)
//   3. Network Access 에서 IP 0.0.0.0/0 추가 (모든 IP 허용)
//   4. Connect → Drivers → 연결 문자열 복사
//   5. 프로젝트 루트에 .env 파일을 만들고 MONGODB_URI 에 붙여넣기
//      (.env.example 파일을 참고하세요)

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("✅ MongoDB 연결 성공!");
  } catch (error) {
    console.error("❌ MongoDB 연결 실패:", error.message);
    process.exit(1); // 연결 실패 시 서버 종료
  }
}

export default connectDB;
