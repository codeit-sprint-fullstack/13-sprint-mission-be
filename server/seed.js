const dotenv = require("dotenv");
const prisma = require("./lib/prisma");
const { hashPassword } = require("./utils/password");

// [환경 설정 불러오기]
dotenv.config();

// [테스트용 데이터 리스트]
const testProduct = [
  {
    name: "빈티지 가죽 가방",
    price: 55000,
    description: "관리가 잘 된 빈티지 가방입니다. 가죽 상태 아주 좋아요.",
    tags: ["가방", "빈티지"],
    images: ["https://picsum.photos/seed/bag/600/400"],
  },
  {
    name: "기계식 키보드",
    price: 120000,
    description: "청축 키보드입니다. 타건감이 아주 좋습니다.",
    tags: ["키보드", "전자기기"],
    images: ["https://picsum.photos/seed/keyboard/600/400"],
  },
  {
    name: "스마트 워치",
    price: 210000,
    description: "최신형 스마트 워치입니다. 박스 포함 풀구성입니다.",
    tags: ["워치", "전자기기"],
    images: ["https://picsum.photos/seed/watch/600/400"],
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
];

const seedDatabase = async () => {
  try {
    console.log("🧹 기존 데이터를 삭제 중입니다...");
    await prisma.productLike.deleteMany({});
    await prisma.articleLike.deleteMany({});
    await prisma.productComment.deleteMany({});
    await prisma.articleComment.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.article.deleteMany({});
    await prisma.user.deleteMany({});

    console.log("🌱 새로운 데이터를 생성 중입니다...");

    const encryptedPassword = await hashPassword("password123");

    const testUser = await prisma.user.create({
      data: {
        email: "test@example.com",
        nickname: "테스트 유저",
        encryptedPassword,
        image: "https://picsum.photos/seed/user1/120/120",
      },
    });

    const otherUser = await prisma.user.create({
      data: {
        email: "seller@example.com",
        nickname: "판매자 유저",
        encryptedPassword,
        image: "https://picsum.photos/seed/user2/120/120",
      },
    });

    // 상품 데이터 삽입
    const products = await Promise.all(
      testProduct.map((product, index) =>
        prisma.product.create({
          data: {
            ...product,
            ownerId: index % 2 === 0 ? testUser.id : otherUser.id,
          },
        }),
      ),
    );

    // 게시글 데이터 삽입
    const articles = await Promise.all(
      testArticles.map((article, index) =>
        prisma.article.create({
          data: {
            ...article,
            ownerId: index % 2 === 0 ? testUser.id : otherUser.id,
          },
        }),
      ),
    );

    await prisma.productComment.createMany({
      data: [
        {
          content: "상품 상태가 좋아 보여요. 아직 구매 가능한가요?",
          productId: products[0].id,
          writerId: otherUser.id,
        },
        {
          content: "직거래 장소는 어디가 편하신가요?",
          productId: products[1].id,
          writerId: testUser.id,
        },
      ],
    });

    await prisma.articleComment.createMany({
      data: [
        {
          content: "좋은 팁 감사합니다!",
          articleId: articles[1].id,
          writerId: testUser.id,
        },
        {
          content: "저도 판다마켓 잘 쓰고 있어요.",
          articleId: articles[2].id,
          writerId: otherUser.id,
        },
      ],
    });

    await prisma.productLike.createMany({
      data: [
        {
          productId: products[0].id,
          userId: otherUser.id,
        },
        {
          productId: products[1].id,
          userId: testUser.id,
        },
      ],
      skipDuplicates: true,
    });

    await prisma.articleLike.createMany({
      data: [
        {
          articleId: articles[0].id,
          userId: otherUser.id,
        },
        {
          articleId: articles[1].id,
          userId: testUser.id,
        },
      ],
      skipDuplicates: true,
    });

    console.log("✅ 시딩이 완료되었습니다.");
    console.log("- 유저 2명");
    console.log("- 상품 3개, 상품 댓글 2개, 상품 좋아요 2개");
    console.log("- 게시글 3개, 게시글 댓글 2개, 게시글 좋아요 2개");
    console.log("- 테스트 로그인: test@example.com / password123");
    console.log("- 테스트 로그인: seller@example.com / password123");

    await prisma.$disconnect();
    process.exit();
  } catch (err) {
    console.error("❌ 시딩 중 오류 발생:", err);
    await prisma.$disconnect();
    process.exit(1);
  }
};

seedDatabase();
