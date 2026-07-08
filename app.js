import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import multer from 'multer';
import swaggerUi from 'swagger-ui-express';
import articleRoutes from './routes/articleRoutes.js';
import authRoutes from './routes/authRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import productRoutes from './routes/productRoutes.js';
import swaggerSpecs from './src/config/swagger.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use('/uploads', express.static('uploads'));

app.use('/auth', authRoutes);
app.use('/images', imageRoutes);
app.use(['/products', '/items'], productRoutes);
app.use('/articles', articleRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Panda Market API is running.' });
});

app.use((req, res, next) => {
  res.status(404).json({ message: '요청한 리소스를 찾을 수 없습니다.' });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: '업로드 파일을 확인해 주세요.' });
  }

  if (err?.message?.includes('이미지 파일')) {
    return res.status(400).json({ message: err.message });
  }

  if (err?.code === 'P2025') {
    return res.status(404).json({ message: '요청한 리소스를 찾을 수 없습니다.' });
  }

  if (err?.statusCode) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  console.error(err);
  return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중이에요!`);
});
