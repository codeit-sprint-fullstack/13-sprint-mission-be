import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

// 사람 이름은 재미로 연예인 닉네임을 씀 (실제 인물과 무관한 로컬 테스트 데이터)
const CELEBRITIES = [
  { nickname: "아이유", email: "iu@example.com" },
  { nickname: "지드래곤", email: "gd@example.com" },
  { nickname: "박보검", email: "bogum@example.com" },
  { nickname: "손흥민", email: "sonny@example.com" },
  { nickname: "유재석", email: "yjs@example.com" },
  { nickname: "이효리", email: "hyori@example.com" },
  { nickname: "마동석", email: "madongseok@example.com" },
  { nickname: "강호동", email: "hodong@example.com" },
  { nickname: "김연아", email: "yuna@example.com" },
  { nickname: "뷔", email: "v@example.com" },
];

const PRODUCTS = [
  { name: "아이패드 프로 11인치", description: "거의 새 제품, 케이스랑 펜슬 포함해서 팝니다.", price: 850000, tags: ["전자기기", "애플"] },
  { name: "무선 청소기", description: "작년에 구매한 무선 청소기, 흡입력 좋아요.", price: 120000, tags: ["가전", "생활용품"] },
  { name: "원목 책상", description: "이사 때문에 급처합니다. 상태 좋아요.", price: 60000, tags: ["가구"] },
  { name: "캠핑 텐트 4인용", description: "작년 여름에 한 번 쓰고 보관만 했어요.", price: 95000, tags: ["캠핑", "아웃도어"] },
  { name: "로드 자전거", description: "입문용으로 좋은 상태, 기어 부드러워요.", price: 320000, tags: ["스포츠", "자전거"] },
  { name: "일렉기타 세트", description: "앰프까지 같이 드려요, 초보자 추천.", price: 180000, tags: ["악기"] },
  { name: "커피 머신", description: "하루 한 잔도 안 마셔서 놀고 있어요.", price: 75000, tags: ["가전", "주방"] },
  { name: "러닝머신", description: "접이식이라 자리 많이 안 차지해요.", price: 150000, tags: ["운동", "헬스"] },
  { name: "겨울 롱패딩", description: "한 시즌만 입었어요, 사이즈 L.", price: 65000, tags: ["패션", "의류"] },
  { name: "닌텐도 스위치", description: "게임 3개 포함해서 팝니다.", price: 220000, tags: ["게임", "전자기기"] },
  { name: "에어프라이어", description: "대용량이라 자취생한테 딱이에요.", price: 45000, tags: ["가전", "주방"] },
  { name: "캐리어 24인치", description: "여행 두 번밖에 안 썼어요.", price: 55000, tags: ["여행", "가방"] },
  { name: "전동 스탠딩 책상", description: "재택근무하면서 산 건데 이제 필요없어요.", price: 130000, tags: ["가구", "사무용품"] },
  { name: "무선 이어폰", description: "케이스만 살짝 사용감 있고 음질 좋아요.", price: 85000, tags: ["전자기기", "음향"] },
  { name: "요가매트+블록 세트", description: "몇 번 쓰고 안 써서 팝니다.", price: 25000, tags: ["운동", "요가"] },
  { name: "고양이 캣타워", description: "이사가면서 급처, 상태 아주 좋음.", price: 40000, tags: ["반려동물", "가구"] },
  { name: "미니 드론", description: "조작 쉽고 카메라 달려있어요.", price: 60000, tags: ["전자기기", "취미"] },
  { name: "전자레인지", description: "자취방 필수템, 고장 없이 잘 썼어요.", price: 30000, tags: ["가전", "주방"] },
  { name: "골프채 풀세트", description: "입문용, 백까지 포함입니다.", price: 280000, tags: ["스포츠", "골프"] },
  { name: "무드등 스탠드 조명", description: "감성 인테리어용, 밝기 조절 가능.", price: 22000, tags: ["가구", "조명"] },
];

const ARTICLES = [
  { title: "오늘 날씨 진짜 좋네요", content: "다들 산책 한 번씩 다녀오세요!" },
  { title: "중고거래 사기 조심하세요", content: "최근에 사기 사례가 늘고 있으니 직거래 위주로 하시길 추천드려요." },
  { title: "첫 자취 꿀팁 공유합니다", content: "관리비 아끼는 법부터 정리해봤어요, 도움 되셨으면 좋겠네요." },
  { title: "재택근무 3년차 후기", content: "장단점 솔직하게 적어봅니다, 궁금한 분들 질문 받아요." },
  { title: "요즘 넷플릭스 뭐가 재밌나요?", content: "볼 거 없어서 고민 중인데 추천 좀 해주세요." },
  { title: "헬스장 등록했는데 작심삼일 안 되는 법", content: "저만의 노하우 공유해봐요, 다들 화이팅입니다." },
  { title: "자취방 인테리어 고민 있으신 분?", content: "좁은 원룸 활용법 아시는 분 계신가요." },
  { title: "다들 아침 뭐 드세요?", content: "매일 뭐 먹을지 고민이라 다른 분들 루틴 궁금해요." },
  { title: "중고나라 vs 당근마켓 뭐가 나아요?", content: "둘 다 써봤는데 장단점이 있는 것 같아서 여쭤봐요." },
  { title: "이사 준비 체크리스트 정리해봤어요", content: "다음 달에 이사하는 분들 참고하시라고 올려요." },
  { title: "강아지 키우기 전에 알아야 할 것들", content: "입양 전에 꼭 확인해야 하는 것들 정리했습니다." },
  { title: "재테크 초보인데 조언 부탁드려요", content: "적금밖에 몰라서 이제 막 공부 시작했어요." },
  { title: "주말에 갈만한 데이트 코스 추천", content: "매번 똑같은 곳만 가서 새로운 곳 좀 추천받고 싶어요." },
  { title: "노트북 살 때 뭘 봐야 하나요?", content: "예산은 백만원 정도인데 뭘 우선으로 봐야할지 모르겠어요." },
  { title: "자취 요리 초보 레시피 추천해주세요", content: "간단하고 실패 없는 요리 좀 알려주세요." },
  { title: "미니멀 라이프 시작한 지 한 달 됐어요", content: "물건 절반은 비웠는데 생각보다 만족스럽네요." },
  { title: "택배 파손됐을 때 어떻게 하세요?", content: "오늘 받은 물건이 박살나 있어서 여쭤봐요." },
  { title: "오늘 점심 뭐 먹지 고민되는 분", content: "메뉴 추천 좀 해주세요, 아무거나 다 좋아요." },
  { title: "새벽 배송 진짜 편하네요", content: "써보고 나서 못 끊을 것 같아요, 다들 쓰시나요?" },
  { title: "이 동네 살기 어때요?", content: "이사 고민 중인데 살아보신 분 계시면 알려주세요." },
];

const PRODUCT_COMMENTS = [
  "가격 조금만 깎아주실 수 있나요?",
  "직거래 가능한가요?",
  "아직 판매 중인가요?",
  "택배 거래도 되나요?",
  "실물 사진 더 볼 수 있을까요?",
  "상태 진짜 좋아 보이네요!",
  "네고 가능한가요?",
  "어느 지역에서 거래 가능하신가요?",
  "박스랑 구성품 다 있나요?",
  "고장난 부분은 없나요?",
  "사용 기간이 얼마나 되셨나요?",
  "오늘 바로 거래 가능할까요?",
  "인수 방법 알려주세요",
  "혹시 다른 색상도 있나요?",
  "가격 착하네요, 예약할게요!",
];

const ARTICLE_COMMENTS = [
  "좋은 정보 감사합니다!",
  "저도 예전에 당할 뻔했어요 ㅠㅠ",
  "완전 공감돼요",
  "저도 궁금했던 내용이라 잘 봤습니다",
  "글 잘 읽었어요, 도움 많이 됐습니다",
  "오 진짜 유용한 정보네요",
  "저도 비슷한 경험 있어요",
  "추천 감사해요, 참고할게요",
  "이런 글 자주 올려주세요",
  "저는 다르게 생각하는데 흥미롭네요",
  "댓글로 남겨주신 분들도 다 도움되네요",
  "저도 한번 해봐야겠어요",
  "글 재밌게 잘 봤습니다 ㅎㅎ",
  "정말 유익한 글이에요",
  "공감 백 프로입니다",
];

async function main() {
  console.log("🌱 시딩 시작...");

  // FK 순서 고려: 자식 -> 부모 순으로 삭제
  await prisma.like.deleteMany();
  await prisma.productComment.deleteMany();
  await prisma.articleComment.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.product.deleteMany();
  await prisma.article.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("password123!", SALT_ROUNDS);

  const users = await Promise.all(
    CELEBRITIES.map(({ nickname, email }) =>
      prisma.user.create({
        data: { nickname, email, encryptedPassword: password },
      }),
    ),
  );
  console.log("✅ 유저 생성 완료");

  // 상품 20개 생성 (연예인 유저들에게 순서대로 배정)
  const products = await Promise.all(
    PRODUCTS.map((product, i) =>
      prisma.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          images: [],
          userId: users[i % users.length].id,
          tags: { create: product.tags.map((name) => ({ name })) },
        },
      }),
    ),
  );
  console.log("✅ 상품 생성 완료");

  // 게시글 20개 생성 (연예인 유저들에게 순서대로 배정)
  const articles = await Promise.all(
    ARTICLES.map((article, i) =>
      prisma.article.create({
        data: {
          title: article.title,
          content: article.content,
          userId: users[(i + 1) % users.length].id,
        },
      }),
    ),
  );
  console.log("✅ 게시글 생성 완료");

  // 상품/게시글마다 댓글 1개씩 (작성자와 다른 유저가 남기도록 오프셋)
  await prisma.productComment.createMany({
    data: products.map((product, i) => ({
      content: PRODUCT_COMMENTS[i % PRODUCT_COMMENTS.length],
      productId: product.id,
      userId: users[(i + 2) % users.length].id,
    })),
  });

  await prisma.articleComment.createMany({
    data: articles.map((article, i) => ({
      content: ARTICLE_COMMENTS[i % ARTICLE_COMMENTS.length],
      articleId: article.id,
      userId: users[(i + 3) % users.length].id,
    })),
  });
  console.log("✅ 댓글 생성 완료");

  // 상품/게시글마다 좋아요 1개씩 (작성자와 다른 유저, productId/articleId가 전부 달라서
  // (userId, productId) / (userId, articleId) 유니크 제약에 걸릴 일 없음)
  await prisma.like.createMany({
    data: products.map((product, i) => ({
      userId: users[(i + 4) % users.length].id,
      productId: product.id,
    })),
  });

  await prisma.like.createMany({
    data: articles.map((article, i) => ({
      userId: users[(i + 5) % users.length].id,
      articleId: article.id,
    })),
  });
  console.log("✅ 좋아요 생성 완료");

  console.log("🌱 시딩 완료!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
