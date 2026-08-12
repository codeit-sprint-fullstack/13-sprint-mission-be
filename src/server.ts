import app from "./app.js";
import env from "./config/env.js";

app.listen(env.PORT, () => {
  console.log(`서버가 ${env.PORT} 에서 동작 중 입니다!`);
});
