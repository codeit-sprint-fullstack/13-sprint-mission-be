-- DropForeignKey
ALTER TABLE "article_comment" DROP CONSTRAINT "article_comment_articleId_fkey";

-- AddForeignKey
ALTER TABLE "article_comment" ADD CONSTRAINT "article_comment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
