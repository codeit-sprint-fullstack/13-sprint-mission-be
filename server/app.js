const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");

dotenv.config();

console.log("포트 설정:", process.env.PORT);
console.log("DB 주소:", process.env.DATABASE_URL);

const app = express();

// [미들웨어 설정]

app.use(express.json());

// [CORS 설정 추가]
app.use(cors());

// [라우터 연결 추가]
app.use("/api", productRoutes);

// [데이터베이스 연결]
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("✅ 데이터베이스(MongoDB)에 성공적으로 연결되었습니다!");
  } catch (err) {
    console.error("❌ 데이터베이스 연결 중 오류 발생:", err.message);
    console.log(
      "💡 Tip: MongoDB Atlas를 사용 중이라면, Network Access에 현재 IP가 추가되어 있는지 확인해 보세요.",
    );
    process.exit(1);
  }
};

connectDB();

// [기본 경로 설정]
app.get("/", (req, res) => {
  res.send("중고마켓 서버가 정상적으로 작동 중입니다!");
});

// [서버 시작]
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
  🚀 서버가 실행되었습니다!
  - 접속 주소: http://localhost:${PORT}
  - 연결된 DB: ${process.env.DATABASE_URL}
  `);
});
