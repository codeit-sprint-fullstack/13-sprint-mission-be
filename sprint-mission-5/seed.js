import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js"; // ⚠️ 주의: ES Module에서는 끝에 '.js' 확장자를 반드시 적어주어야 합니다!

// .env 파일의 환경 변수를 로드합니다.
dotenv.config();

// MongoDB에 삽입할 초기 상품 데이터 (테스트용)
const mockProducts = [
  {
    name: "빈티지 가죽 자켓",
    description:
      "상태 아주 좋은 리얼 가죽 빈티지 자켓입니다. 스타일리시하게 입기 좋아요.",
    price: 85000,
    tags: ["의류", "빈티지", "가죽자켓"],
  },
  {
    name: "무선 기계식 키보드",
    description:
      "갈축 스위치를 탑재한 타건감 좋은 블루투스 무선 키보드입니다. 박스 풀 패키지 구성입니다.",
    price: 120000,
    tags: ["전자기기", "키보드", "데스크테리어"],
  },
  {
    name: "아이패드 에어 5세대 (64GB)",
    description:
      "스페이스 그레이 색상이며 액정 필름 항상 붙여 사용해서 기스 전혀 없습니다. 충전기 포함.",
    price: 580000,
    tags: ["애플", "태블릿", "아이패드"],
  },
  {
    name: "캠핑용 미니 버너",
    description:
      "바람막이가 내장되어 야외에서도 화력이 아주 강한 컴팩트 버너입니다. 가방도 드려요.",
    price: 25000,
    tags: ["캠핑", "아웃도어", "캠핑용품"],
  },
  {
    name: "스탠리 텀블러 887ml",
    description:
      "선물 받았는데 한 번도 안 쓴 미개봉 새상품입니다. 로즈쿼츠 색상이에요.",
    price: 35000,
    tags: ["생활용품", "텀블러", "새상품"],
  },
];

const seedDatabase = async () => {
  try {
    // 1. .env에 적힌 MONGO_URI를 사용해 데이터베이스에 연결합니다.
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error(
        ".env 파일에 MONGO_URI 환경 변수가 설정되어 있지 않습니다!",
      );
    }

    await mongoose.connect(mongoUri);
    console.log("🟢 MongoDB에 성공적으로 연결되었습니다.");

    // 2. 기존 상품 데이터를 전부 삭제하여 중복 적재를 방지합니다.
    await Product.deleteMany({});
    console.log("🧹 기존 상품 데이터를 초기화했습니다.");

    // 3. 준비된 초기 데이터를 일괄 등록합니다.
    const createdProducts = await Product.insertMany(mockProducts);
    console.log(
      `✨ 성공적으로 ${createdProducts.length}개의 테스트 상품 데이터를 등록했습니다!`,
    );
    console.log(createdProducts);

    // 4. 작업 완료 후 프로세스 안전하게 종료
    mongoose.connection.close();
    console.log("🔌 데이터베이스 연결을 안전하게 종료합니다.");
    process.exit(0);
  } catch (error) {
    console.error("🔴 데이터 시딩 중 에러 발생:", error);
    process.exit(1);
  }
};

// 시드 스크립트 실행
seedDatabase();
