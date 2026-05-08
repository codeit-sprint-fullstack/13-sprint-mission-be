import Product from "../models/Products.js";

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const getProduct = async (req,res) =>{
  try{
    const productList = await Product.find()

    res.status(200).json(productList)
  }catch(error)[
    res.status(400).json({message : error.message})
  ]
}