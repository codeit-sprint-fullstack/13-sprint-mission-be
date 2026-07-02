const express = require("express");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const { port, uploadDir } = require("./config/env");
const swaggerSpec = require("./config/swagger");
const { errorHandler, notFoundHandler } = require("./middlewares/error");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const uploadRoutes = require("./routes/uploads");
const productRoutes = require("./routes/products");
const articleRoutes = require("./routes/articles");
const commentRoutes = require("./routes/comments");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.resolve(uploadDir)));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/uploads", uploadRoutes);
app.use("/products", productRoutes);
app.use("/articles", articleRoutes);
app.use("/comments", commentRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Panda Market API listening on http://127.0.0.1:${port}`);
  });
}

module.exports = app;
