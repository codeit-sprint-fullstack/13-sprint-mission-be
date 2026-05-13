import dotenv from "dotenv";
import express from "express";
import connectDB from "./db.js";
import Product from "./models/Product.js";
import cors from "cors";

dotenv.config(); // .env 파일 로드 (맨 먼저!)

const app = express();

app.use(express.json());
app.use(cors());

// DB 연결
connectDB();

// 상품 등록 API
app.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.json(product);
    console.log(req.body);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// 상품 조회 API
app.get("/products", async (req, res) => {
  try {
    const product = await Product.find();

    res.json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "조회 실패",
    });
  }
});

// 상품 상세 조회 API
app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    res.json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "조회 실패",
    });
  }
});

// 상품 수정 API
app.patch("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "수정 실패",
    });
  }
});

// 상품 삭제 API
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleteProduct = await Product.findByIdAndDelete(id);

    res.json(deleteProduct);
    console.log("삭제 성공");
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "삭제 실패",
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("서버 실행 중!");
});
