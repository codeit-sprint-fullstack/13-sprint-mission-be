const express = require("express");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const { port, uploadDir } = require("./utils/env.util");
const swaggerSpec = require("./utils/swagger.util");
const { errorHandler, notFoundHandler } = require("./middlewares/error");
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const uploadRoutes = require("./routes/upload.route");
const productRoutes = require("./routes/product.route");
const articleRoutes = require("./routes/article.route");
const commentRoutes = require("./routes/comment.route");

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
