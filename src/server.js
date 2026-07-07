import app from "./app.js";

const port = process.env.PORT ?? 3001;
app.listen(port, () => {
  console.log(`서버가 ${port} 에서 동작 중 입니다!`);
});
