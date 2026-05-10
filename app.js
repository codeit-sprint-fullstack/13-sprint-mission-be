const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const Product = require('./models/Product');

dotenv.config();

mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('MongoDB(데이터베이스)에 연결되었습니다.');
  })
  .catch((error) => {
    console.log('MongoDB 연결 실패하였습니다.', error.message)
  });

const app = express();

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('판다마켓 백엔드 서버가 무사히 켜졌습니다. 🐼')
});
app.get('/products', async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const keyword = req.query.keyword || '';
    const searchQuery = keyword
      ? {
          $or: [
            { name: { $regex: keyword, $options: 'i' }},
            { description: { $regex: keyword, $options: 'i' }},
          ],
        }
      :{};
      const skip = (page - 1) * pageSize;
      const products = await Product.find(searchQuery)
        .sort({ createdAt: -1})
        .skip(skip)
        .limit(pageSize);
      const totalCount = await Product.countDocuments(searchQuery);

      res.status(200).send({ list: products, totalCount });
    } catch (error) {
      res.status(500).send({ message: error.message }); 
    }
});

app.post('/products', async (req, res) => {
  try {
    const { name, description, price, tags } = req.body;
    const newProduct = await Product.create({
      name,
      description,
      price,
      tags,
    });
    res.status(201).send(newProduct);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
})

app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send({ message: '상품을 찾을 수 없습니다.' });
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.patch('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).send({ message: '상품을 찾을 수 없습니다.' });
    res.status(200).send(product);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
})

app.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).send({ message: '상품을 찾을 수 없습니다.'});
    res.status(200).send({ message: '상품이 정상적으로 삭제되었습니다.'});
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 작동하고 있습니다.`);
});