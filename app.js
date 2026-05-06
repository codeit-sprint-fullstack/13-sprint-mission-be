import dotenv from "dotenv";
import express from "express";
import connectDB from "./connectDB.js";
import Product from "./models/Product.js";

//.env 파일 로드.
dotenv.config();

const app = express();
app.use(express.json());
connectDB();

app.get("/product", async (req, res) => {
  try {
    const productData = await Product.find();
    res.json(productData);
  } catch (error) {
    res.status(500).json({ message: "데이터를 가져오지 못했습니다." });
  }
});

app.post("/product", async (req, res) => {
  try {
    const productData = await Product.create({ ...req.body });
    res.json(productData);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

app.listen(process.env.PORT, () => {
  console.log("서버가 실행중 입니다.");
});
