import CommentRepository from "../repositories/comment.repository";
import commentService from "../services/comment.service";
import * as pagination from "../lib/pagination";

// 모듈 모킹
jest.mock("../repositories/comment.repository");
const mockedCommentRepository = CommentRepository as jest.Mocked<
  typeof CommentRepository
>;

jest.mock("../lib/pagination");
const mockedPagination = pagination as jest.Mocked<typeof pagination>;

describe("CommentService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockWriter = { id: 1, nickname: "Commenter", image: null };
  const mockComment = {
    id: 10,
    content: "테스트 댓글입니다.",
    createdAt: new Date(),
    updatedAt: new Date(),
    writerId: 1,
    productId: 1,
    articleId: null,
    writer: mockWriter,
  };

  // 댓글 목록 조회 테스트
  describe("findCommentList", () => {
    test("댓글 목록과 총 개수, 그리고 다음 커서를 정상적으로 반환해야 한다", async () => {
      // Setup
      const target = { productId: 1 };
      const limit = 10;
      const sort = "recent";
      const lastId = undefined;

      const mockQueryOptions = { take: 10 };
      mockedPagination.cursorPagination.mockReturnValue(mockQueryOptions);

      mockedCommentRepository.findCommentsAndCount.mockResolvedValue([
        [mockComment as any],
        1,
      ]);

      // Exercise
      const result = await commentService.findCommentList(
        target,
        limit,
        sort,
        lastId,
      );

      // Assertion
      expect(mockedPagination.cursorPagination).toHaveBeenCalledWith(
        limit,
        lastId,
      );
      expect(mockedCommentRepository.findCommentsAndCount).toHaveBeenCalledWith(
        {
          queryOptions: mockQueryOptions,
          where: target,
          orderBy: { createdAt: "desc" },
        },
      );
      expect(result.total).toBe(1);
      expect(result.comments).toHaveLength(1);
      expect(result.comments[0].content).toBe("테스트 댓글입니다.");
      expect(result.nextCursor).toBe(10);
    });

    test("조회된 댓글이 없는 경우 nextCursor는 null을 반환해야 한다", async () => {
      // Setup
      mockedPagination.cursorPagination.mockReturnValue({ take: 10 });
      mockedCommentRepository.findCommentsAndCount.mockResolvedValue([[], 0]);

      // Exercise
      const result = await commentService.findCommentList(
        { articleId: 2 },
        10,
        "recent",
        undefined,
      );

      // Assertion
      expect(result.comments).toHaveLength(0);
      expect(result.nextCursor).toBeNull();
    });

    test("댓글 목록과 총 개수, 그리고 다음 커서를 정상적으로 반환해야 한다", async () => {
      // Setup
      const target = { productId: 1 };
      const limit = 10;
      const sort = "recent";
      const lastId = undefined;

      const mockQueryOptions = { take: 10 };
      mockedPagination.cursorPagination.mockReturnValue(mockQueryOptions);

      mockedCommentRepository.findCommentsAndCount.mockResolvedValue([
        [mockComment as any],
        1,
      ]);

      // Exercise
      const result = await commentService.findCommentList(
        target,
        limit,
        sort,
        lastId,
      );

      // Assertion
      expect(mockedPagination.cursorPagination).toHaveBeenCalledWith(
        limit,
        lastId,
      );
      expect(mockedCommentRepository.findCommentsAndCount).toHaveBeenCalledWith(
        {
          queryOptions: mockQueryOptions,
          where: target,
          orderBy: { createdAt: "desc" },
        },
      );
      expect(result.total).toBe(1);
      expect(result.comments).toHaveLength(1);
      expect(result.comments[0]).toEqual({
        id: mockComment.id,
        content: mockComment.content,
        createdAt: mockComment.createdAt,
        updatedAt: mockComment.updatedAt,
        writer: {
          id: mockWriter.id,
          nickname: mockWriter.nickname,
          image: mockWriter.image,
        },
      });
      expect(result.nextCursor).toBe(10);
    });
  });

  // 댓글 생성 테스트
  describe("createComment", () => {
    test("댓글을 성공적으로 생성해야 한다", async () => {
      // Setup
      const content = "새로운 댓글";
      const target = { productId: 1 };
      const writerId = 2;

      mockedCommentRepository.createComment.mockResolvedValue(
        mockComment as any,
      );

      // Exercise
      await commentService.createComment(content, target, writerId);

      // Assertion
      expect(mockedCommentRepository.createComment).toHaveBeenCalledWith({
        content,
        writerId,
        productId: 1,
      });
    });
  });

  // 댓글 수정 테스트
  describe("updateComment", () => {
    test("댓글을 성공적으로 업데이트해야 한다", async () => {
      // Setup
      const commentId = 10;
      const updateData = { content: "수정된 댓글 내용" };

      mockedCommentRepository.updateComment.mockResolvedValue(
        mockComment as any,
      );

      // Exercise
      const result = await commentService.updateComment(commentId, updateData);

      // Assertion
      expect(mockedCommentRepository.updateComment).toHaveBeenCalledWith(
        commentId,
        updateData,
      );
      expect(result).toEqual(mockComment);
    });
  });

  // 댓글 삭제 테스트
  describe("deleteComment", () => {
    test("댓글을 성공적으로 삭제해야 한다", async () => {
      // Setup
      const commentId = 10;
      mockedCommentRepository.deleteComment.mockResolvedValue(
        undefined as never,
      );

      // Exercise
      await commentService.deleteComment(commentId);

      // Assertion
      expect(mockedCommentRepository.deleteComment).toHaveBeenCalledWith(
        commentId,
      );
      expect(mockedCommentRepository.deleteComment).toHaveBeenCalledTimes(1);
    });
  });
});
