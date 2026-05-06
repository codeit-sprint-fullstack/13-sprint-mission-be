// 상품 API 모음

const express = require("express");
const router = express.Router(); // 요청을 받을 app 대리인
const Product = require("../models/Product");

// 상품 등록
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 상품 목록 조회
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      orderBy = "recent",
      keyword = "",
    } = req.query;
    const sortOrder =
      orderBy === "recent" ? { createdAt: -1 } : { favoriteCount: -1 };
    const product = await Product.find()
      .sort(sortOrder)
      .skip((page - 1) * pageSize)
      .limit(Number(pageSize));
    const totalCount = await Product.countDocuments();

    res.status(200).json({ totalCount, list: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//

module.exports = router;
