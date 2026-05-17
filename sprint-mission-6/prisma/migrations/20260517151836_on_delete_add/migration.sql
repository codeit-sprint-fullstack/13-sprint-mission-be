-- DropForeignKey
ALTER TABLE "reply" DROP CONSTRAINT "reply_articleId_fkey";

-- AddForeignKey
ALTER TABLE "reply" ADD CONSTRAINT "reply_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
