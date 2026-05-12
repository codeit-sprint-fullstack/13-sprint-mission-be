import dotenv from "dotenv";
import express from "express";
import connectDB from "./db.js";
import Product from "./models/Product.js";

dotenv.config();

const app = express();
app.use(express.json());

connectDB();
console.log(process.env.MONGODB_URI);

app.listen(process.env.PORT || 4000, () => {
  console.log("서버 실행 중!");
});

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    // Mongoose 유효성 검사 실패 시
    res.status(400).json({ message: error.message });
  }
};

app.post("/products", createProduct);

const produtcs = await Product.find();

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
app.get("/products", getProducts);

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없어요." });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

app.patch("/products/:id", updateProduct);

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없어요." });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

app.delete("/product/:id", deleteProduct);
