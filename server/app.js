const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const articleRoutes = require("./routes/articleRoutes");
const authRoutes = require("./routes/authRoutes");
const commentRoutes = require("./routes/commentRoutes");
const notFoundHandler = require("./middlewares/notFoundHandler");
const errorHandler = require("./middlewares/errorHandler");
const { uploadsDir } = require("./middlewares/uploadMiddleware");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));

app.use("/api", productRoutes);
app.use("/api", articleRoutes);
app.use("/api", authRoutes);
app.use("/api", commentRoutes);

app.get("/", (req, res) => {
  res.json({ message: "중고마켓 서버가 정상적으로 작동 중입니다!" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`
  서버가 실행되었습니다.
  - 접속 주소: http://localhost:${PORT}
  `);
  });
}

module.exports = app;
