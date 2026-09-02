import productRepository from "../repositories/product.repository";
import productService from "../services/product.service";
import * as pagination from "../lib/pagination";
import { NotFoundError } from "../types/errors";

jest.mock("../repositories/product.repository");
const mockedProductRepository = productRepository as jest.Mocked<
  typeof productRepository
>;

jest.mock("../lib/pagination");
const mockedPagination = pagination as jest.Mocked<typeof pagination>;

// productService 도메인
describe("ProductService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockWriter = { id: 1, nickname: "Seller", image: null };
  const mockTags = [{ id: 1, name: "전자제품" }];
  const mockProduct = {
    id: 1,
    name: "테스트 상품",
    description: "상품 설명입니다.",
    price: 10000,
    image: ["image.jpg"],
    likeCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    writerId: 1,
    tags: mockTags,
    writer: mockWriter,
    comments: [],
  };

  // 상품 목록 조회 테스트
  describe("findProduct", () => {
    //키워드 없을 때
    test("상품 목록과 총 개수를 정상적으로 반환해야 한다", async () => {
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

      mockedProductRepository.findProductsAndCount.mockResolvedValue([
        [mockProduct as any],
        1,
      ]);

      // Exercise
      const result = await productService.findProduct(
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
      expect(mockedProductRepository.findProductsAndCount).toHaveBeenCalledWith(
        {
          where: {},
          orderBy: { createdAt: "desc" },
          skip: 0,
          take: 10,
        },
      );
      expect(result.total).toBe(1);
      expect(result.products).toHaveLength(1);
      expect(result.products[0].tags).toEqual(["전자제품"]);
    });

    //키워드 있을 때
    test("키워드가 주어지면 OR 검색 조건이 포함되어야 한다", async () => {
      // Setup
      mockedPagination.offsetPagination.mockReturnValue({
        pageNum: 1,
        take: 10,
        skip: 0,
      });
      mockedProductRepository.findProductsAndCount.mockResolvedValue([[], 0]);

      // Exercise
      await productService.findProduct(1, 10, "recent", "노트북");

      // Assertion
      expect(mockedProductRepository.findProductsAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { name: { contains: "노트북", mode: "insensitive" } },
              { description: { contains: "노트북", mode: "insensitive" } },
            ],
          },
        }),
      );
    });
  });

  // 단일 상품 상세 조회 테스트
  describe("findProductById", () => {
    test("상품과 좋아요 여부를 성공적으로 반환해야 한다", async () => {
      // Setup
      const productId = 1;
      const userId = 2;

      mockedProductRepository.findProductById.mockResolvedValue(
        mockProduct as any,
      );
      mockedProductRepository.findProductLike.mockResolvedValue({
        id: 1,
        userId,
        productId,
        createdAt: new Date(),
      });

      // Exercise
      const result = await productService.findProductById(productId, userId);

      // Assertion
      expect(mockedProductRepository.findProductById).toHaveBeenCalledWith(
        productId,
      );
      expect(mockedProductRepository.findProductLike).toHaveBeenCalledWith(
        userId,
        productId,
      );
      expect(result.id).toBe(productId);
      expect(result.isLiked).toBe(true); // 좋아요가 존재하므로 true
    });

    test("상품이 존재하지 않으면 NotFoundError를 던져야 한다", async () => {
      // Setup
      mockedProductRepository.findProductById.mockResolvedValue(null);

      // Exercise & Assertion
      await expect(productService.findProductById(999, 1)).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  // 상품 생성 테스트
  describe("createProduct", () => {
    test("상품을 성공적으로 생성해야 한다", async () => {
      // Setup
      const newProduct = {
        name: "새 상품",
        description: "설명",
        price: 5000,
        writerId: 1,
        images: ["img1.jpg"],
        tags: ["태그1"],
      };

      const expectedRepoCall = {
        rest: { name: "새 상품", description: "설명", price: 5000 },
        images: ["img1.jpg"],
        writerId: 1,
        tags: ["태그1"],
      };

      mockedProductRepository.createProduct.mockResolvedValue(
        mockProduct as any,
      );

      // Exercise
      await productService.createProduct(newProduct);

      // Assertion
      expect(mockedProductRepository.createProduct).toHaveBeenCalledWith(
        expectedRepoCall,
      );
    });
  });

  // 상품 수정 테스트
  describe("updateProduct", () => {
    test("태그와 이미지가 포함된 상품 정보를 성공적으로 업데이트해야 한다", async () => {
      // Setup
      const updateData = {
        price: 20000,
        tags: ["수정태그"],
        images: ["new.jpg"],
      };
      mockedProductRepository.updateProduct.mockResolvedValue(
        mockProduct as any,
      );

      // Exercise
      await productService.updateProduct(1, updateData);

      // Assertion
      expect(mockedProductRepository.updateProduct).toHaveBeenCalledWith(1, {
        price: 20000,
        image: ["new.jpg"],
        tags: {
          set: [],
          connectOrCreate: [
            { where: { name: "수정태그" }, create: { name: "수정태그" } },
          ],
        },
      });
    });
  });

  // 상품 삭제 테스트
  describe("deleteProduct", () => {
    test("상품을 성공적으로 삭제해야 한다", async () => {
      // Setup
      const productId = 1;
      // 삭제 함수는 반환값이 없으므로 undefined(또는 void)를 resolve 하도록 모킹합니다.
      mockedProductRepository.deleteProduct.mockResolvedValue(
        undefined as never,
      );

      // Exercise
      await productService.deleteProduct(productId);

      // Assertion
      expect(mockedProductRepository.deleteProduct).toHaveBeenCalledWith(
        productId,
      );
      expect(mockedProductRepository.deleteProduct).toHaveBeenCalledTimes(1);
    });
  });

  // 상품 좋아요 추가 테스트
  describe("addLikeProduct", () => {
    test("좋아요 내역이 없으면 새로 생성하고 결과(isLiked: true)를 반환해야 한다", async () => {
      // Setup
      const productId = 1,
        userId = 2;
      mockedProductRepository.findProductById.mockResolvedValue(
        mockProduct as any,
      );
      mockedProductRepository.findProductLike.mockResolvedValue(null); // 기존 좋아요 없음
      mockedProductRepository.createProductLikeWithIncrement.mockResolvedValue();

      // Exercise
      const result = await productService.addLikeProduct(productId, userId);

      // Assertion
      expect(
        mockedProductRepository.createProductLikeWithIncrement,
      ).toHaveBeenCalledWith(userId, productId);
      expect(result.isLiked).toBe(true);
    });

    test("이미 좋아요 내역이 존재하면 생성 로직을 건너뛰고 결과를 반환해야 한다", async () => {
      // Setup
      const productId = 1,
        userId = 2;
      mockedProductRepository.findProductById.mockResolvedValue(
        mockProduct as any,
      );
      mockedProductRepository.findProductLike.mockResolvedValue({
        id: 1,
        userId,
        productId,
        createdAt: new Date(),
      }); // 기존 좋아요 있음

      // Exercise
      const result = await productService.addLikeProduct(productId, userId);

      // Assertion
      expect(
        mockedProductRepository.createProductLikeWithIncrement,
      ).not.toHaveBeenCalled(); // 호출되지 않아야 함
      expect(result.isLiked).toBe(true);
    });

    test("상품이 존재하지 않으면 NotFoundError를 던져야 한다", async () => {
      mockedProductRepository.findProductById.mockResolvedValue(null);

      await expect(productService.addLikeProduct(999, 1)).rejects.toThrow(
        NotFoundError,
      );

      expect(mockedProductRepository.findProductLike).not.toHaveBeenCalled();
    });
  });

  // 상품 좋아요 취소 테스트
  describe("unLikeProduct", () => {
    test("좋아요 내역이 존재하면 삭제하고 결과(isLiked: false)를 반환해야 한다", async () => {
      // Setup
      const productId = 1,
        userId = 2;
      mockedProductRepository.findProductById.mockResolvedValue(
        mockProduct as any,
      );
      mockedProductRepository.findProductLike.mockResolvedValue({
        id: 1,
        userId,
        productId,
        createdAt: new Date(),
      });

      // Exercise
      const result = await productService.unLikeProduct(productId, userId);

      // Assertion
      expect(
        mockedProductRepository.deleteProductLikeWithDecrement,
      ).toHaveBeenCalledWith(userId, productId);
      expect(result.isLiked).toBe(false);
    });

    test("좋아요 내역이 없는 상태에서 취소 요청 시 삭제 로직 없이 결과를 반환해야 한다", async () => {
      // Setup
      const productId = 1,
        userId = 2;
      mockedProductRepository.findProductById.mockResolvedValue(
        mockProduct as any,
      );
      mockedProductRepository.findProductLike.mockResolvedValue(null); // 좋아요 없음

      // Exercise
      const result = await productService.unLikeProduct(productId, userId);

      // Assertion
      expect(
        mockedProductRepository.deleteProductLikeWithDecrement,
      ).not.toHaveBeenCalled();
      expect(result.isLiked).toBe(false);
    });

    test("상품이 존재하지 않으면 NotFoundError를 던져야 한다", async () => {
      mockedProductRepository.findProductById.mockResolvedValue(null);

      await expect(productService.unLikeProduct(999, 1)).rejects.toThrow(
        NotFoundError,
      );
    });
  });
});
