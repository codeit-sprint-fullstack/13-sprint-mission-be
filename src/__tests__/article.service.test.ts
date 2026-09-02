import ArticleRepository from "../repositories/article.repository";
import articleService from "../services/article.service";
import * as pagination from "../lib/pagination";
import { NotFoundError } from "../types/errors";

// 모듈 모킹
jest.mock("../repositories/article.repository");
const mockedArticleRepository = ArticleRepository as jest.Mocked<
  typeof ArticleRepository
>;

jest.mock("../lib/pagination");
const mockedPagination = pagination as jest.Mocked<typeof pagination>;

// articleService 도메인
describe("ArticleService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockWriter = { id: 1, nickname: "WriterUser", image: null };
  const mockArticle = {
    id: 1,
    title: "테스트 게시글",
    content: "게시글 내용입니다.",
    image: ["test.jpg"],
    likeCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    writerId: 1,
    writer: mockWriter,
  };

  // 게시물 목록 조회 테스트
  describe("findArticle", () => {
    // 키워드 없을 때
    test("게시물 목록과 총 개수를 정상적으로 반환해야 한다", async () => {
      // Setup
      const page = 1,
        pageSize = 10,
        sort = "recent",
        keyword = "";
      mockedPagination.offsetPagination.mockReturnValue({
        pageNum: 1,
        take: 10,
        skip: 0,
      });

      mockedArticleRepository.findArticlesAndCount.mockResolvedValue([
        [mockArticle as any],
        1,
      ]);

      // Exercise
      const result = await articleService.findArticle(
        page,
        pageSize,
        sort,
        keyword,
      );

      // Assertion
      expect(mockedPagination.offsetPagination).toHaveBeenCalledWith(
        page,
        pageSize,
      );
      expect(mockedArticleRepository.findArticlesAndCount).toHaveBeenCalledWith(
        {
          where: {},
          orderBy: { createdAt: "desc" },
          skip: 0,
          take: 10,
        },
      );
      expect(result.total).toBe(1);
      expect(result.articles).toHaveLength(1);
      expect(result.articles[0].title).toBe("테스트 게시글");
    });

    // 키워드 있을 때
    test("키워드가 주어지면 제목과 내용에 대한 OR 검색 조건이 포함되어야 한다", async () => {
      // Setup
      mockedPagination.offsetPagination.mockReturnValue({
        pageNum: 1,
        take: 10,
        skip: 0,
      });
      mockedArticleRepository.findArticlesAndCount.mockResolvedValue([[], 0]);

      // Exercise
      await articleService.findArticle(1, 10, "recent", "테스트");

      // Assertion
      expect(mockedArticleRepository.findArticlesAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { title: { contains: "테스트", mode: "insensitive" } },
              { content: { contains: "테스트", mode: "insensitive" } },
            ],
          },
        }),
      );
    });
  });

  // 게시물 상세 조회 테스트
  describe("findArticleById", () => {
    test("게시물 상세 정보와 좋아요 여부를 성공적으로 반환해야 한다", async () => {
      // Setup
      const articleId = 1,
        userId = 2;
      mockedArticleRepository.findArticleById.mockResolvedValue(
        mockArticle as any,
      );
      mockedArticleRepository.findArticleLike.mockResolvedValue({
        id: 1,
        userId,
        articleId,
        createdAt: new Date(),
      } as any);

      // Exercise
      const result = await articleService.findArticleById(articleId, userId);

      // Assertion
      expect(mockedArticleRepository.findArticleById).toHaveBeenCalledWith(
        articleId,
      );
      expect(mockedArticleRepository.findArticleLike).toHaveBeenCalledWith(
        userId,
        articleId,
      );
      expect(result.id).toBe(articleId);
      expect(result.isLiked).toBe(true);
    });

    test("게시물이 존재하지 않으면 NotFoundError를 던져야 한다", async () => {
      // Setup
      mockedArticleRepository.findArticleById.mockResolvedValue(null);

      // Exercise & Assertion
      await expect(articleService.findArticleById(999, 1)).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  // 게시물 생성 테스트
  describe("createArticle", () => {
    test("게시물을 성공적으로 생성해야 한다", async () => {
      // Setup
      const newArticle = {
        title: "새 글",
        content: "내용",
        writerId: 1,
        images: ["img.jpg"],
      };
      mockedArticleRepository.createArticle.mockResolvedValue(
        mockArticle as any,
      );

      // Exercise
      await articleService.createArticle(newArticle);

      // Assertion
      expect(mockedArticleRepository.createArticle).toHaveBeenCalledWith(
        newArticle,
      );
    });
  });

  // 게시물 수정 테스트
  describe("updateArticle", () => {
    test("게시물을 성공적으로 업데이트해야 한다", async () => {
      // Setup
      const updateData = { title: "수정된 제목", content: "수정된 내용" };
      mockedArticleRepository.updateArticle.mockResolvedValue(
        mockArticle as any,
      );

      // Exercise
      await articleService.updateArticle(1, updateData);

      // Assertion
      expect(mockedArticleRepository.updateArticle).toHaveBeenCalledWith(
        1,
        updateData,
      );
    });
  });

  // 게시물 삭제 테스트
  describe("deleteArticle", () => {
    test("게시물을 성공적으로 삭제해야 한다", async () => {
      // Setup
      mockedArticleRepository.deleteArticle.mockResolvedValue(
        undefined as never,
      );

      // Exercise
      await articleService.deleteArticle(1);

      // Assertion
      expect(mockedArticleRepository.deleteArticle).toHaveBeenCalledWith(1);
      expect(mockedArticleRepository.deleteArticle).toHaveBeenCalledTimes(1);
    });
  });

  // 게시물 좋아요 추가 테스트
  describe("addLikeArticle", () => {
    test("좋아요 내역이 없으면 새로 생성하고 결과(isLiked: true)를 반환해야 한다", async () => {
      // Setup
      const articleId = 1,
        userId = 2;
      mockedArticleRepository.findArticleById.mockResolvedValue(
        mockArticle as any,
      );
      mockedArticleRepository.findArticleLike.mockResolvedValue(null);
      mockedArticleRepository.createArticleLikeWithIncrement.mockResolvedValue(
        undefined as never,
      );

      // Exercise
      const result = await articleService.addLikeArticle(articleId, userId);

      // Assertion
      expect(
        mockedArticleRepository.createArticleLikeWithIncrement,
      ).toHaveBeenCalledWith(userId, articleId);
      expect(result.isLiked).toBe(true);
    });

    test("존재하지 않는 게시물에 좋아요를 시도하면 에러를 던져야 한다", async () => {
      // Setup
      mockedArticleRepository.findArticleById.mockResolvedValue(null);

      // Exercise & Assertion
      await expect(articleService.addLikeArticle(999, 1)).rejects.toThrow(
        NotFoundError,
      );
    });

    test("이미 좋아요 내역이 존재하면 생성 로직을 건너뛰고 결과를 반환해야 한다", async () => {
      // Setup
      const articleId = 1,
        userId = 2;
      mockedArticleRepository.findArticleById.mockResolvedValue(
        mockArticle as any,
      );
      mockedArticleRepository.findArticleLike.mockResolvedValue({
        id: 1,
        userId,
        articleId,
        createdAt: new Date(),
      } as any);

      // Exercise
      const result = await articleService.addLikeArticle(articleId, userId);

      // Assertion
      expect(
        mockedArticleRepository.createArticleLikeWithIncrement,
      ).not.toHaveBeenCalled();
      expect(result.isLiked).toBe(true);
    });
  });

  // 게시물 좋아요 취소 테스트
  describe("unLikeArticle", () => {
    test("좋아요 내역이 존재하면 삭제하고 결과(isLiked: false)를 반환해야 한다", async () => {
      // Setup
      const articleId = 1,
        userId = 2;
      mockedArticleRepository.findArticleById.mockResolvedValue(
        mockArticle as any,
      );
      mockedArticleRepository.findArticleLike.mockResolvedValue({
        id: 1,
        userId,
        articleId,
        createdAt: new Date(),
      } as any);
      mockedArticleRepository.deleteArticleLikeWithDecrement.mockResolvedValue(
        undefined as never,
      );

      // Exercise
      const result = await articleService.unLikeArticle(articleId, userId);

      // Assertion
      expect(
        mockedArticleRepository.deleteArticleLikeWithDecrement,
      ).toHaveBeenCalledWith(userId, articleId);
      expect(result.isLiked).toBe(false);
    });

    test("존재하지 않는 게시물에 좋아요 취소를 시도하면 NotFoundError를 던져야 한다", async () => {
      // Setup
      mockedArticleRepository.findArticleById.mockResolvedValue(null);

      // Exercise & Assertion
      await expect(articleService.unLikeArticle(999, 1)).rejects.toThrow(
        NotFoundError,
      );
    });

    test("좋아요 내역이 없는 상태에서 취소 요청 시 삭제 로직 없이 결과를 반환해야 한다", async () => {
      // Setup
      const articleId = 1,
        userId = 2;
      mockedArticleRepository.findArticleById.mockResolvedValue(
        mockArticle as any,
      );
      mockedArticleRepository.findArticleLike.mockResolvedValue(null);

      // Exercise
      const result = await articleService.unLikeArticle(articleId, userId);

      // Assertion
      expect(
        mockedArticleRepository.deleteArticleLikeWithDecrement,
      ).not.toHaveBeenCalled();
      expect(result.isLiked).toBe(false);
    });
  });
});
