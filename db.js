// DB 연결

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB 연결 성공");
  } catch (error) {
    console.log("❌ MongoDB 연결 실패", err);
    process.exit(1); // 연결 실패 시 서버 비정상 종료
  }
};

module.exports = connectDB;
