import "#/env.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";
import path from "path";
import "#/config/passport.js";
import swaggerSpec from "#/config/swagger.js";
import errorHandler from "#/middlewares/errorHandler.js";
import authRouter from "#/routes/authRouter.js";
import userRouter from "#/routes/userRouter.js";
import productRouter from "#/routes/productRouter.js";
import articleRouter from "#/routes/articleRouter.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => res.json(swaggerSpec));

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/articles", articleRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(
    `[${process.env.NODE_ENV || "development"}] Server running on port ${PORT}`,
  );
});
