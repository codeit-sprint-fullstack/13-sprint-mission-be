import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  const { keyword, page = 1, limit = 10, sort } = req.query;
  const sortOption = sort === "recent" ? { createdAt: -1 } : {};
  const skip = (page - 1) * limit;
  const query = {};
  if (keyword) {
    query.$or = [];

    query.$or.push(
      { name: new RegExp(keyword, "i") }, // new RegExp(name,'i')의 반환값은 /name(실제쿼리의네임값)/i(대소문자구별x)

      { description: new RegExp(keyword, "i") },
    );
  }
  try {
    const totalCount = await Product.countDocuments(query);

    const products = await Product.find(query, {
      name: 1,
      price: 1,
      createdAt: 1,
    })
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));
    res.status(200).json({ products, totalCount });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; //쿼리사용가능한 전체상품조회//description,tags 제외

export const getProductsById = async (req, res) => {
  const { id } = req.params;
  try {
    const productByID = await Product.findById(id, { updatedAt: 0 });
    if (!productByID) {
      return res
        .status(404)
        .json({ message: `${id}는 존재하지 않는 id입니다` });
    }
    res.status(200).json(productByID);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; // id로 특정상품 상세조회

export const createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const patchProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!patchProduct) {
      return res
        .status(404)
        .json({ message: `${id}는 존재하지 않는 id입니다` });
    }
    res.status(200).json(patchProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteProductById = await Product.findByIdAndDelete(id);
    if (!deleteProductById) {
      return res
        .status(404)
        .json({ message: `${id}는 존재하지 않는 id입니다` });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
