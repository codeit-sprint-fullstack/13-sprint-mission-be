import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import connectDB from './db.js';
import Product from './models/Product.js';

// .env 파일 로드 (반드시 다른 코드보다 먼저!)
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB 연결
connectDB();

function serializeProduct(product) {
  return {
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    tags: product.tags,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

function serializeProductListItem(product) {
  return {
    id: product._id.toString(),
    name: product.name,
    price: product.price,
    createdAt: product.createdAt,
  };
}

app.get(['/products', '/items'], async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const offset = req.query.offset !== undefined
      ? Math.max(Number(req.query.offset), 0)
      : (page - 1) * limit;
    const keyword = String(req.query.keyword || req.query.search || '').trim();
    const filter = keyword
      ? {
          $or: [
            { name: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .select('name price createdAt')
        .lean(),
      Product.countDocuments(filter),
    ]);

    res.json({
      list: items.map(serializeProductListItem),
      totalCount: total,
      offset,
      limit,
      hasNext: offset + items.length < total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post(['/products', '/items'], async (req, res) => {
  try {
    const product = await Product.create({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      tags: Array.isArray(req.body.tags) ? req.body.tags : [],
    });

    res.status(201).json(serializeProduct(product));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get(['/products/:id', '/items/:id'], async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .select('name description price tags createdAt')
      .lean();

    if (!product) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }

    res.json(serializeProduct(product));
  } catch (error) {
    res.status(400).json({ message: '잘못된 상품 id입니다.' });
  }
});

app.patch(['/products/:id', '/items/:id'], async (req, res) => {
  try {
    const payload = {};
    ['name', 'description', 'tags'].forEach((key) => {
      if (req.body[key] !== undefined) payload[key] = req.body[key];
    });
    if (req.body.price !== undefined) payload.price = Number(req.body.price);

    const product = await Product.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }

    res.json(serializeProduct(product));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete(['/products/:id', '/items/:id'], async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Panda Market API is running.' });
});

// ─────────────────────────────────────────────────────────────
// 서버 시작
// ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중이에요! 🚀`);
});
