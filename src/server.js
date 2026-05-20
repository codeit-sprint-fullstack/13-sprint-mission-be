import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

console.log("PORT:", PORT);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`서버 실행 중: port ${PORT}`);
});