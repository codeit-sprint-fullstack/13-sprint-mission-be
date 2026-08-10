import express from "express";
import cors from "cors";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { port, uploadDir } from "./utils/env.util";
import swaggerSpec from "./utils/swagger.util";
import { errorHandler, notFoundHandler } from "./middlewares/error";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import uploadRoutes from "./routes/upload.route";
import productRoutes from "./routes/product.route";
import articleRoutes from "./routes/article.route";
import commentRoutes from "./routes/comment.route";

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

export default app;
