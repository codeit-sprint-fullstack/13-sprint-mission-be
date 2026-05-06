// 상품 API 모음

const express = require("express");
const router = express.Router(); // 요청을 받을 app 대리인
const Product = require("../models/Product");

//상품 등록
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.doby);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: "잘못된 요청" });
  }
});

module.exports = router;
