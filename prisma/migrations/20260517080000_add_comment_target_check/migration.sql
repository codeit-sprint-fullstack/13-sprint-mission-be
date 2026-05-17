-- 댓글 대상은 상품 또는 게시글 중 정확히 하나여야 합니다.
ALTER TABLE "comments"
ADD CONSTRAINT "comments_target_check"
CHECK (
  ("product_id" IS NOT NULL AND "article_id" IS NULL)
  OR
  ("product_id" IS NULL AND "article_id" IS NOT NULL) 
);
