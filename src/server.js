import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  console.log(`API 문서: http://localhost:${PORT}/api-docs`);
});
