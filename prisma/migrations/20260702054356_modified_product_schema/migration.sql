/*
  Warnings:

  - The `product_id` column on the `comments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `products` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.
  - Added the required column `encryptedpassword` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_product_id_fkey";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "product_id",
ADD COLUMN     "product_id" INTEGER;

-- AlterTable
ALTER TABLE "products" DROP CONSTRAINT "products_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP COLUMN "password",
ADD COLUMN     "encryptedpassword" TEXT NOT NULL,
ADD COLUMN     "image" TEXT;

-- CreateIndex
CREATE INDEX "comments_product_id_created_at_idx" ON "comments"("product_id", "created_at");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
