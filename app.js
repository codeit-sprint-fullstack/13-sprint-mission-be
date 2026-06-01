import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import articleRoutes from './routes/articleRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

app.use('/auth', authRoutes);
app.use(['/products', '/items'], productRoutes);
app.use('/articles', articleRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Panda Market API is running.' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중이에요!`);
});
