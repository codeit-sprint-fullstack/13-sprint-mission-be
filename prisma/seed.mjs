import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;
const EXTRA_COUNT = 10;

// Like는 (userId, productId) / (userId, articleId)가 유니크 제약이라
// 랜덤으로 뽑을 때 중복 쌍이 안 나오게 걸러줌
function uniqueRandomPairs(users, items, count) {
  const seen = new Set();
  const pairs = [];
  let attempts = 0;
  while (pairs.length < count && attempts < count * 20) {
    attempts++;
    const user = faker.helpers.arrayElement(users);
    const item = faker.helpers.arrayElement(items);
    const key = `${user.id}-${item.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    pairs.push({ userId: user.id, itemId: item.id });
  }
  return pairs;
}

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

  const [alice, bob, charlie] = await Promise.all([
    prisma.user.create({
      data: {
        nickname: "엘리스",
        email: "alice@example.com",
        encryptedPassword: password,
      },
    }),
    prisma.user.create({
      data: {
        nickname: "이준호",
        email: "bob@example.com",
        encryptedPassword: password,
      },
    }),
    prisma.user.create({
      data: {
        nickname: "박서연",
        email: "charlie@example.com",
        encryptedPassword: password,
      },
    }),
  ]);

  // 페이지네이션/검색 테스트용으로 유저 10명 추가 생성
  const extraUsers = await Promise.all(
    Array.from({ length: EXTRA_COUNT }, (_, i) =>
      prisma.user.create({
        data: {
          nickname: faker.person.fullName(),
          email: `user${i + 1}@example.com`,
          encryptedPassword: password,
        },
      }),
    ),
  );
  console.log("✅ 유저 생성 완료");

  const users = [alice, bob, charlie, ...extraUsers];

  const product1 = await prisma.product.create({
    data: {
      name: "아이패드 프로 11인치",
      description: "거의 새 제품, 케이스랑 펜슬 포함해서 팝니다.",
      price: 850000,
      images: ["/uploads/sample-ipad-1.jpg"],
      userId: alice.id,
      tags: { create: [{ name: "전자기기" }, { name: "애플" }] },
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "무선 청소기",
      description: "작년에 구매한 무선 청소기, 흡입력 좋아요.",
      price: 120000,
      images: ["/uploads/sample-vacuum-1.jpg"],
      userId: bob.id,
      tags: { create: [{ name: "가전" }, { name: "생활용품" }] },
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: "원목 책상",
      description: "이사 때문에 급처합니다. 상태 좋아요.",
      price: 60000,
      images: [],
      userId: charlie.id,
      tags: { create: [{ name: "가구" }] },
    },
  });

  // 목록/검색/페이지네이션 테스트용으로 상품 10개 추가 생성 (랜덤 유저에게 배정)
  const extraProducts = await Promise.all(
    Array.from({ length: EXTRA_COUNT }, () =>
      prisma.product.create({
        data: {
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: faker.number.int({ min: 5000, max: 500000 }),
          images: [],
          userId: faker.helpers.arrayElement(users).id,
          tags: { create: [{ name: faker.commerce.department() }] },
        },
      }),
    ),
  );
  console.log("✅ 상품 생성 완료");

  const article1 = await prisma.article.create({
    data: {
      title: "오늘 날씨 진짜 좋네요",
      content: "다들 산책 한 번씩 다녀오세요!",
      userId: alice.id,
    },
  });

  const article2 = await prisma.article.create({
    data: {
      title: "중고거래 사기 조심하세요",
      content:
        "최근에 사기 사례가 늘고 있으니 직거래 위주로 하시길 추천드려요.",
      userId: bob.id,
    },
  });

  // 목록/검색/페이지네이션 테스트용으로 게시글 10개 추가 생성 (랜덤 유저에게 배정)
  const extraArticles = await Promise.all(
    Array.from({ length: EXTRA_COUNT }, () =>
      prisma.article.create({
        data: {
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraph(),
          userId: faker.helpers.arrayElement(users).id,
        },
      }),
    ),
  );
  console.log("✅ 게시글 생성 완료");

  const products = [product1, product2, product3, ...extraProducts];
  const articles = [article1, article2, ...extraArticles];

  await prisma.productComment.createMany({
    data: [
      {
        content: "가격 조금만 깎아주실 수 있나요?",
        productId: product1.id,
        userId: bob.id,
      },
      {
        content: "직거래 가능한가요?",
        productId: product1.id,
        userId: charlie.id,
      },
      {
        content: "아직 판매 중인가요?",
        productId: product2.id,
        userId: alice.id,
      },
      // 목록 조회(cursor 페이지네이션) 테스트용으로 댓글 10개 추가 생성
      ...Array.from({ length: EXTRA_COUNT }, () => ({
        content: faker.lorem.sentence(),
        productId: faker.helpers.arrayElement(products).id,
        userId: faker.helpers.arrayElement(users).id,
      })),
    ],
  });

  await prisma.articleComment.createMany({
    data: [
      {
        content: "좋은 정보 감사합니다!",
        articleId: article2.id,
        userId: charlie.id,
      },
      {
        content: "저도 예전에 당할 뻔했어요 ㅠㅠ",
        articleId: article2.id,
        userId: alice.id,
      },
      // 목록 조회(cursor 페이지네이션) 테스트용으로 댓글 10개 추가 생성
      ...Array.from({ length: EXTRA_COUNT }, () => ({
        content: faker.lorem.sentence(),
        articleId: faker.helpers.arrayElement(articles).id,
        userId: faker.helpers.arrayElement(users).id,
      })),
    ],
  });
  console.log("✅ 댓글 생성 완료");

  const extraProductLikes = uniqueRandomPairs(users, products, EXTRA_COUNT);
  const extraArticleLikes = uniqueRandomPairs(users, articles, EXTRA_COUNT);

  await prisma.like.createMany({
    data: [
      { userId: bob.id, productId: product1.id },
      { userId: charlie.id, productId: product1.id },
      { userId: alice.id, productId: product2.id },
      { userId: charlie.id, articleId: article1.id },
      { userId: bob.id, articleId: article1.id },
      // 좋아요 개수/isLiked 테스트용으로 좋아요 20개(상품 10 + 게시글 10) 추가 생성
      ...extraProductLikes.map(({ userId, itemId }) => ({ userId, productId: itemId })),
      ...extraArticleLikes.map(({ userId, itemId }) => ({ userId, articleId: itemId })),
    ],
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
