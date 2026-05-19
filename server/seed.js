const dotenv = require("dotenv");
const prisma = require("./lib/prisma");

// [환경 설정 불러오기]
dotenv.config();

// [테스트용 데이터 리스트]
const testProduct = [
  {
    title: "빈티지 가죽 가방",
    price: 55000,
    description: "관리가 잘 된 빈티지 가방입니다. 가죽 상태 아주 좋아요.",
  },
  {
    title: "기계식 키보드",
    price: 120000,
    description: "청축 키보드입니다. 타건감이 아주 좋습니다.",
  },
  {
    title: "스마트 워치",
    price: 210000,
    description: "최신형 스마트 워치입니다. 박스 포함 풀구성입니다.",
  },
  {
    title: "무선 노이즈 캔슬링 이어폰",
    price: 150000,
    description: "거의 새것입니다. 노이즈 캔슬링 아주 잘 됩니다.",
  },
  {
    title: "27인치 4K 모니터",
    price: 250000,
    description: "픽셀 깨짐 없고 화질 매우 선명합니다. 사무용으로 추천해요.",
  },
  {
    title: "캠핑용 텐트",
    price: 180000,
    description: "3회 사용한 캠핑용 텐트입니다. 구성품 모두 들어있습니다.",
  },
  {
    title: "미니 화분 세트",
    price: 15000,
    description: "인테리어용으로 좋은 미니 화분 3개 세트입니다.",
  },
  {
    title: "로봇 청소기",
    price: 300000,
    description: "작동 잘 되고 물걸레 기능도 포함되어 있습니다.",
  },
  {
    title: "요가 매트",
    price: 20000,
    description: "두께감 있어서 층간소음 방지에 좋습니다.",
  },
  {
    title: "캡슐 커피 머신",
    price: 85000,
    description: "인기 있는 캡슐 커피 머신입니다. 사용감 조금 있어요.",
  },
  {
    title: "블루투스 스피커",
    price: 45000,
    description: "음질 좋고 가벼워서 캠핑 갈 때 쓰기 좋습니다.",
  },
  {
    title: "고화질 웹캠",
    price: 60000,
    description: "화상 회의용으로 구매했는데 거의 사용하지 않아 팝니다.",
  },
  {
    title: "입문용 턴테이블",
    price: 130000,
    description: "입문용으로 좋은 턴테이블입니다. 소리 잘 나옵니다.",
  },
  {
    title: "자전거 헬멧",
    price: 30000,
    description: "사이즈 L, 한 번도 안 쓴 새 제품입니다.",
  },
  {
    title: "전동 킥보드",
    price: 250000,
    description: "출퇴근용으로 타기 좋습니다. 배터리 상태 양호해요.",
  },
];

const testArticles = [
  {
    title: "오늘 날씨가 너무 좋네요!",
    content: "산책하기 딱 좋은 날씨예요. 다들 오늘 뭐 하시나요?",
  },
  {
    title: "중고거래 할 때 팁 공유합니다.",
    content: "직거래를 할 때는 밝고 사람이 많은 곳에서 만나는 게 좋아요.",
  },
  {
    title: "판다마켓 사용 후기",
    content: "사고 싶었던 물건을 저렴하게 구해서 기분이 너무 좋네요!",
  },
  {
    title: "캠핑장 추천해주세요!",
    content: "주말에 갈만한 조용하고 별이 잘 보이는 캠핑장 아시는 분 있나요?",
  },
  {
    title: "요즘 읽을만한 책 추천",
    content: "소설이나 에세이 위주로 추천 부탁드립니다. 힐링이 필요해요.",
  },
  {
    title: "자전거 타기 좋은 코스",
    content: "한강 근처 자전거 코스 공유해요. 저녁에 타면 선선하고 좋습니다.",
  },
  {
    title: "직거래 장소 어디가 좋을까요?",
    content: "보통 지하철역에서 많이 하시나요? 첫 직거래라 떨리네요.",
  },
  {
    title: "당근마켓 말고 판다마켓!",
    content: "UI가 깔끔해서 쓰기 좋네요. 앞으로 자주 이용할 것 같습니다.",
  },
  {
    title: "맛집 탐방 다녀왔습니다",
    content: "홍대 근처 파스타 맛집 추천해요! 분위기도 좋고 맛있습니다.",
  },
  {
    title: "주말농장 하시는 분 계신가요?",
    content: "상추 키우기 시작했는데 쑥쑥 자라는 거 보니 재밌네요.",
  },
  {
    title: "물건 사진 예쁘게 찍는 법",
    content: "자연광에서 찍는 게 제일 잘 나오는 것 같아요. 꿀팁 공유합니다.",
  },
  {
    title: "반려동물 자랑",
    content: "우리 집 강아지 너무 귀엽죠? 산책 다녀와서 뻗었어요.",
  },
  {
    title: "퇴근 후 취미 생활",
    content: "다들 퇴근하고 뭐하시면서 쉬시나요? 저는 요즘 베이킹에 빠졌어요.",
  },
  {
    title: "중고 스마트폰 구매 시 주의점",
    content: "배터리 성능 꼭 확인하세요! 외관만 보면 안 됩니다.",
  },
  {
    title: "집 꾸미기 아이디어",
    content: "작은 조명 하나로 방 분위기가 확 달라지네요. 인테리어 공유해요.",
  },
];

const seedDatabase = async () => {
  try {
    console.log("🧹 기존 데이터를 삭제 중입니다...");
    await prisma.articleComment.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.article.deleteMany({});

    console.log("🌱 새로운 데이터를 생성 중입니다...");

    // 상품 데이터 삽입
    await prisma.product.createMany({
      data: testProduct,
    });

    // 게시글 데이터 삽입
    await prisma.article.createMany({
      data: testArticles,
    });

    // 방금 생성된 게시글 중 첫 번째 게시글을 가져옵니다.
    const createdArticles = await prisma.article.findMany();
    if (createdArticles.length > 0) {
      // 첫 번째 게시글에 테스트용 댓글 3개 추가
      await prisma.articleComment.createMany({
        data: [
          {
            content: "유용한 정보 감사합니다!",
            articleId: createdArticles[0].id,
          },
          {
            content: "저도 비슷한 경험이 있어요.",
            articleId: createdArticles[0].id,
          },
          {
            content: "좋은 팁이네요. 다음에 시도해봐야겠어요.",
            articleId: createdArticles[0].id,
          },
        ],
      });
    }

    console.log(
      "✅ 시딩이 완료되었습니다. (상품 15개, 게시글 15개, 테스트 댓글 3개)",
    );

    await prisma.$disconnect();
    process.exit();
  } catch (err) {
    console.error("❌ 시딩 중 오류 발생:", err);
    await prisma.$disconnect();
    process.exit(1);
  }
};

seedDatabase();
