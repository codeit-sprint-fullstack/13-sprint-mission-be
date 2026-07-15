import express from "express";
import cors from "cors";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { port, uploadDir } from "./utils/env.util.js";
import swaggerSpec from "./utils/swagger.util.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import uploadRoutes from "./routes/upload.route.js";
import productRoutes from "./routes/product.route.js";
import articleRoutes from "./routes/article.route.js";
import commentRoutes from "./routes/comment.route.js";
import { fileURLToPath } from "url";

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

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(port, () => {
    console.log(`Panda Market API listening on http://127.0.0.1:${port}`);
  });
}

export default app;
