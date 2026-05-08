const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('MongoDB(데이터베이스)에 연결되었습니다.');
  })
  .catch((error) => {
    console.log('MongoDB 연결 실패하였습니다.')
  });

const app = express();

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('판다마켓 백엔드 서버가 무사히 켜졌습니다. 🐼')
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 작동하고 있습니다.`);
});