import prisma from "./db.js";

const seedProduct = {
  id: "seed-product-korea-uniform",
  name: "축구유니폼",
  description: "대한민국 홈 유니폼 새 상품입니다.",
  price: 135000,
  tags: ["축구", "유니폼"],
  images: [
    "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/2aa15d75-ec40-4907-ac7e-370870dd8f0a/AS+KOR+M+NK+DF+JSY+SS+STAD+HM.png",
  ],
  ownerId: 1,
  favoriteCount: 150,
};

const seedArticles = [
  {
    title: "거래할 때 직거래 장소는 어디가 좋을까요?",
    content: "사람 많은 지하철 역이 좋을 것 같아요!",
  },
  {
    title: "택배 거래 전에 확인하면 좋은 것",
    content: "상품 상태 말고도 미리 체크하면 좋은 팁이 있을까요?",
  },
  {
    title: "요즘 많이 찾는 중고 물건",
    content: "계절이 바뀌면서 어떤 물건이 잘 팔리는지 궁금해요.",
  },
];

async function seed() {
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.product.deleteMany({
    where: {
      id: seedProduct.id,
    },
  });

  const product = await prisma.product.create({
    data: seedProduct,
  });

  const articles = [];

  for (const article of seedArticles) {
    articles.push(
      await prisma.article.create({
        data: article,
      }),
    );
  }

  await prisma.comment.createMany({
    data: [
      {
        content: "사람 많은 지하철역이나 카페 앞이 좋아요.",
        articleId: articles[0].id,
      },
      {
        content: "택배 거래는 포장 사진도 받아두면 좋아요.",
        articleId: articles[1].id,
      },
      {
        content: "상태 좋은 전자기기는 계속 수요가 있는 편이에요.",
        articleId: articles[2].id,
      },
      {
        content: "상품 상태가 좋아 보여요.",
        productId: product.id,
      },
    ],
  });

  console.log("데이터 seed 성공!.");
}

seed()
  .catch((error) => {
    console.error("Seed 작업 실패:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
