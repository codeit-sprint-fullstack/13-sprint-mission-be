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
    const { page, pageSize, orderBy, keyword } = req.query;
    const offset = (page - 1) * pageSize;
    let search = {};
    if (keyword) {
      search = {
        $or: [
          {
            name: { $regex: keyword },
          },
          {
            description: { $regex: keyword },
          },
        ],
      };
    }

    const productData = await Product.find(search)
      .sort({ createdAt: orderBy === "recent" ? -1 : 1 })
      .skip(offset)
      .limit(pageSize);

    if (!productData)
      return res.status(500).json({ message: "데이터를 가져오지 못했습니다." });
    res.json({ totalCnt: productData.length, list: productData });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

app.post("/product", async (req, res) => {
  try {
    const productData = await Product.create({ ...req.body });
    if (!productData) {
      return res.status(500).json(error.message);
    }
    res.json(productData);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

app.patch("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const productData = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!productData) {
      throw new Error("해당하는 데이터가 없습니다.");
    }

    res.json(productData);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

app.delete("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const productData = await Product.findByIdAndDelete(id);
    if (!productData) {
      throw new Error("해당하는 ID가 없습니다.");
    }
    res.status(201).send();
  } catch (error) {
    res.status(400).json(error.message);
  }
});

app.listen(process.env.PORT, () => {
  console.log("서버가 실행중 입니다.");
});
