import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import productRouter from "./routes/product.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Auth Router 등록
app.use("/auth", authRouter);

// User Router 등록
app.use("/users", userRouter);

// Product Router 등록
app.use("/products", productRouter);

app.get("/", (req, res) => {
  res.json({ message: "Todo API Server" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
