import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from './models/Product.js';

// .env 파일 로드 (반드시 다른 코드보다 먼저!)
dotenv.config();

const seedData = [
  {
    name: '로봇 청소기',
    description: '상태 좋은 무선 로봇 청소기입니다.',
    price: 1500000,
    tags: ['청소', '가전'],
  },
  {
    name: '커피 머신',
    description: '홈카페용으로 사용하기 좋은 커피 머신입니다.',
    price: 500000,
    tags: ['커피', '가전'],
  },
  {
    name: '무드 조명',
    description: '침실이나 책상에 두기 좋은 작은 조명입니다.',
    price: 30000,
    tags: ['조명', '인테리어'],
  },
  {
    name: '셔츠',
    description: '가볍게 입기 좋은 데일리 셔츠입니다.',
    price: 18000,
    tags: ['의류'],
  },
  {
    name: '책장',
    description: '깔끔하게 정리하기 좋은 원목 책장입니다.',
    price: 70000,
    tags: ['가구'],
  },
  {
    name: '키보드',
    description: '타건감이 좋은 블루투스 키보드입니다.',
    price: 45000,
    tags: ['전자'],
  },
  {
    name: '가방',
    description: '외출할 때 쓰기 좋은 넉넉한 가방입니다.',
    price: 25000,
    tags: ['잡화'],
  },
  {
    name: '스피커',
    description: '작지만 소리가 선명한 무선 스피커입니다.',
    price: 60000,
    tags: ['음향'],
  },
  {
    name: '스탠드',
    description: '공부방 책상에 놓기 좋은 스탠드입니다.',
    price: 22000,
    tags: ['조명'],
  },
  {
    name: '텀블러',
    description: '보온 보냉이 잘 되는 휴대용 텀블러입니다.',
    price: 15000,
    tags: ['생활'],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ DB 연결 성공');

  await Product.deleteMany({});
  console.log('🗑️  기존 데이터 삭제 완료');

  await Product.insertMany(seedData);
  console.log(`🌱 시드 데이터 ${seedData.length}개 삽입 완료`);

  await mongoose.disconnect();
  console.log('👋 DB 연결 종료');
}

seed();
