import { Article, PrismaClient, User } from "@prisma/client";

const articleData = [
  {
    title: "이사 다들 어떻게 하시나요?",
    content: "다음 달에 이사하는데 팁 있으면 공유해주세요!",
  },
  {
    title: "동네 맛집 추천 받습니다",
    content: "이 동네 이사온 지 얼마 안 됐는데 맛집 아시는 분 계신가요?",
  },
  {
    title: "중고 거래 시 주의사항",
    content: "직거래할 때 다들 어디서 만나시나요? 안전하게 거래하는 팁 알려주세요.",
  },
  {
    title: "판다마켓 사용 후기",
    content: "생각보다 거래가 빨리 되네요. 다들 좋은 하루 보내세요!",
  },
  {
    title: "택배 분실 경험 있으신가요?",
    content: "택배로 물건 보냈는데 감감무소식이라 걱정이네요.",
  },
];

export async function seedArticles(prisma: PrismaClient, users: User[]) {
  const articles: Article[] = [];
  for (let i = 0; i < articleData.length; i++) {
    const owner = users[i % users.length];
    const article = await prisma.article.create({
      data: {
        ...articleData[i],
        ownerId: owner.id,
      },
    });
    articles.push(article);
  }

  return articles;
}
