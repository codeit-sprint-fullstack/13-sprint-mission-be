-- DropForeignKey
ALTER TABLE "articls" DROP CONSTRAINT "articls_userId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_articleId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_userId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_userId_fkey";

-- DropForeignKey
ALTER TABLE "tags" DROP CONSTRAINT "tags_productId_fkey";

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "favorite_count" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articls" ADD CONSTRAINT "articls_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articls"("id") ON DELETE CASCADE ON UPDATE CASCADE;
