-- DropForeignKey
ALTER TABLE "article_comments" DROP CONSTRAINT "article_comments_articleId_fkey";

-- DropForeignKey
ALTER TABLE "product_comments" DROP CONSTRAINT "product_comments_productId_fkey";

-- AddForeignKey
ALTER TABLE "product_comments" ADD CONSTRAINT "product_comments_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_comments" ADD CONSTRAINT "article_comments_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
