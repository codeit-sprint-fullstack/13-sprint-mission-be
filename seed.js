import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const seedData = [
  {
    name: "카카오톡",
    description: "카카오톡은 한국에서 가장 많이 사용하는 메신저 앱입니다.",
    price: 50000,
  },
  {
    name: "유튜브",
    description: "유튜브는 전 세계에서 가장 큰 동영상 스트리밍 플랫폼입니다.",
    price: 120000,
  },
  {
    name: "인스타그램",
    description:
      "인스타그램은 사진과 영상을 공유하는 소셜 미디어 플랫폼입니다.",
    price: 95000,
  },
  {
    name: "트위터",
    description: "트위터는 짧은 글을 올리고 소통하는 소셜 미디어 서비스입니다.",
    price: 80000,
  },
  {
    name: "틱톡",
    description: "틱톡은 짧은 동영상을 촬영하고 공유할 수 있는 플랫폼입니다.",
    price: 75000,
  },
  {
    name: "라인",
    description: "라인은 일본과 아시아에서 많이 사용하는 메신저 앱입니다.",
    price: 45000,
  },
  {
    name: "줌",
    description: "줌은 화상 회의와 온라인 미팅을 지원하는 협업 도구입니다.",
    price: 110000,
  },
  {
    name: "슬랙",
    description: "슬랙은 팀 협업을 위한 채널 기반 메신저 플랫폼입니다.",
    price: 130000,
  },
  {
    name: "노션",
    description: "노션은 메모, 문서, 데이터베이스를 통합한 생산성 도구입니다.",
    price: 60000,
  },
  {
    name: "피그마",
    description: "피그마는 웹 기반의 UI 및 UX 디자인 협업 도구입니다.",
    price: 85000,
  },
  {
    name: "깃허브",
    description:
      "깃허브는 코드를 저장하고 협업할 수 있는 버전 관리 플랫폼입니다.",
    price: 70000,
  },
  {
    name: "드롭박스",
    description: "드롭박스는 파일을 클라우드에 저장하고 공유하는 서비스입니다.",
    price: 55000,
  },
  {
    name: "에버노트",
    description: "에버노트는 메모와 문서를 체계적으로 관리할 수 있는 앱입니다.",
    price: 40000,
  },
  {
    name: "트렐로",
    description: "트렐로는 칸반 보드 방식으로 프로젝트를 관리하는 도구입니다.",
    price: 65000,
  },
  {
    name: "아사나",
    description:
      "아사나는 팀의 작업과 프로젝트를 체계적으로 관리하는 플랫폼입니다.",
    price: 100000,
  },
  {
    name: "스포티파이",
    description:
      "스포티파이는 음악과 팟캐스트를 스트리밍하는 글로벌 서비스입니다.",
    price: 88000,
  },
  {
    name: "디스코드",
    description:
      "디스코드는 게이머와 커뮤니티를 위한 음성 및 채팅 플랫폼입니다.",
    price: 72000,
  },
  {
    name: "링크드인",
    description:
      "링크드인은 직업과 비즈니스 네트워킹을 위한 소셜 미디어입니다.",
    price: 115000,
  },
  {
    name: "핀터레스트",
    description:
      "핀터레스트는 이미지를 수집하고 공유하는 비주얼 검색 플랫폼입니다.",
    price: 68000,
  },
  {
    name: "레딧",
    description:
      "레딧은 다양한 주제의 커뮤니티가 모여있는 소셜 뉴스 플랫폼입니다.",
    price: 92000,
  },
  {
    name: "트위치",
    description:
      "트위치는 게임과 다양한 콘텐츠를 라이브로 스트리밍하는 플랫폼입니다.",
    price: 78000,
  },
  {
    name: "쇼피파이",
    description:
      "쇼피파이는 누구나 쉽게 온라인 쇼핑몰을 만들 수 있는 플랫폼입니다.",
    price: 135000,
  },
  {
    name: "스트라이프",
    description:
      "스트라이프는 온라인 결제를 간편하게 처리할 수 있는 핀테크 서비스입니다.",
    price: 145000,
  },
  {
    name: "에어비앤비",
    description: "에어비앤비는 전 세계 숙소를 연결하는 숙박 공유 플랫폼입니다.",
    price: 160000,
  },
  {
    name: "우버",
    description:
      "우버는 스마트폰으로 택시를 호출할 수 있는 모빌리티 서비스입니다.",
    price: 140000,
  },
  {
    name: "배달의민족",
    description:
      "배달의민족은 음식 배달을 연결해주는 국내 대표 배달 플랫폼입니다.",
    price: 82000,
  },
  {
    name: "당근마켓",
    description:
      "당근마켓은 동네 주민끼리 중고 물품을 거래하는 로컬 플랫폼입니다.",
    price: 63000,
  },
  {
    name: "쿠팡",
    description: "쿠팡은 로켓배송으로 유명한 한국 최대 이커머스 플랫폼입니다.",
    price: 175000,
  },
  {
    name: "네이버",
    description:
      "네이버는 검색, 쇼핑, 뉴스 등 다양한 서비스를 제공하는 포털입니다.",
    price: 200000,
  },
  {
    name: "카카오",
    description:
      "카카오는 메신저부터 금융까지 다양한 서비스를 운영하는 플랫폼입니다.",
    price: 185000,
  },
  {
    name: "토스",
    description: "토스는 간편 송금과 금융 서비스를 제공하는 핀테크 앱입니다.",
    price: 155000,
  },
  {
    name: "야놀자",
    description:
      "야놀자는 숙박과 레저를 예약할 수 있는 종합 여가 플랫폼입니다.",
    price: 98000,
  },
  {
    name: "무신사",
    description:
      "무신사는 패션 브랜드와 소비자를 연결하는 온라인 패션 플랫폼입니다.",
    price: 112000,
  },
  {
    name: "마켓컬리",
    description:
      "마켓컬리는 신선 식품을 새벽 배송으로 제공하는 이커머스 서비스입니다.",
    price: 87000,
  },
  {
    name: "직방",
    description:
      "직방은 부동산 매물 정보를 제공하는 온라인 부동산 플랫폼입니다.",
    price: 73000,
  },
  {
    name: "클래스101",
    description:
      "클래스101은 다양한 취미와 기술을 배울 수 있는 온라인 클래스 플랫폼입니다.",
    price: 66000,
  },
  {
    name: "리멤버",
    description: "리멤버는 명함 관리와 비즈니스 네트워킹을 도와주는 앱입니다.",
    price: 48000,
  },
  {
    name: "뱅크샐러드",
    description:
      "뱅크샐러드는 자산 관리와 소비 분석을 도와주는 핀테크 앱입니다.",
    price: 52000,
  },
  {
    name: "왓챠",
    description:
      "왓챠는 영화와 드라마를 스트리밍으로 감상할 수 있는 OTT 서비스입니다.",
    price: 59000,
  },
  {
    name: "리디북스",
    description:
      "리디북스는 전자책과 웹툰을 즐길 수 있는 디지털 콘텐츠 플랫폼입니다.",
    price: 44000,
  },
  {
    name: "멜론",
    description:
      "멜론은 국내 최대 음원 스트리밍 서비스로 다양한 음악을 제공합니다.",
    price: 38000,
  },
  {
    name: "지그재그",
    description:
      "지그재그는 여성 패션 쇼핑몰을 한곳에 모아놓은 패션 커머스 앱입니다.",
    price: 57000,
  },
  {
    name: "오늘의집",
    description:
      "오늘의집은 인테리어 정보와 가구를 구매할 수 있는 라이프스타일 플랫폼입니다.",
    price: 83000,
  },
  {
    name: "번개장터",
    description:
      "번개장터는 중고 거래를 빠르고 안전하게 할 수 있는 중고 마켓입니다.",
    price: 47000,
  },
  {
    name: "크몽",
    description:
      "크몽은 프리랜서와 클라이언트를 연결하는 재능 거래 플랫폼입니다.",
    price: 61000,
  },
  {
    name: "탈잉",
    description:
      "탈잉은 다양한 분야의 튜터와 수강생을 연결하는 교육 플랫폼입니다.",
    price: 54000,
  },
  {
    name: "퍼블리",
    description:
      "퍼블리는 커리어 성장을 위한 콘텐츠와 커뮤니티를 제공하는 플랫폼입니다.",
    price: 42000,
  },
  {
    name: "스터디파이",
    description:
      "스터디파이는 스터디 그룹을 만들고 함께 학습할 수 있는 플랫폼입니다.",
    price: 36000,
  },
  {
    name: "모두싸인",
    description:
      "모두싸인은 전자 서명과 계약서 관리를 간편하게 처리하는 서비스입니다.",
    price: 79000,
  },
  {
    name: "채널톡",
    description:
      "채널톡은 고객 상담과 마케팅을 통합 관리할 수 있는 비즈니스 메신저입니다.",
    price: 94000,
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ DB 연결 성공");

  // 기존 데이터 전체 삭제 후 새로 삽입
  await Product.deleteMany({});
  console.log("🗑️ 기존 데이터 삭제 완료");

  await Product.insertMany(seedData);
  console.log(`🌱 시드 데이터 ${seedData.length}개 삽입 완료`);

  await mongoose.disconnect();
  console.log("👋 DB 연결 종료");
}

seed();
