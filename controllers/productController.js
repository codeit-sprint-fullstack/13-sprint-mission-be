import Product from "../models/Products.js";

//상품 등록
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//상품 목록 조회
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      orderBy = "recent",
      keyword = "",
    } = req.query;

    const offset = (Number(page) - 1) * Number(pageSize);

    //https://www.mongodb.com/ko-kr/docs/manual/reference/operator/query/or/
    //regex : keyowrd를 포함한 모든것 , options i = 대소문자 구분 X
    const searchFilter = keyword
      ? {
          $or: [
            { name: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
          ],
        }
      : {};

    const sort = orderBy === "recent" ? { createdAt: -1 } : {};

    const totalCount = await Product.countDocuments(searchFilter);

    const list = await Product.find(searchFilter, "name price createdAt")
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(Number(pageSize));

    res.status(200).json({ list, totalCount });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//상품 상세 조회
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(400).json({ message: "존재하지 않는 ID 입니다." });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      res.status(400).json({ message: "존재하지 않는 ID 입니다." });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//상품 삭제
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "존재하지 않는 ID 입니다." });
    }

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
